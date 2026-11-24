// On-device photo labeling with Apple's Vision framework (no network, no tokens).
//
// For every photo in a Takeout album folder this records:
//   labels         top scene/object classifications (e.g. "ruins", "mosque", "harbor")
//   faces          number of faces detected, and the largest face's share of the frame
//   aesthetic      Apple's overall aesthetics score, -1 (poor) to 1 (great)
//   utility        true for screenshots, receipts, documents and similar non-memories
//   width, height  pixel size
//
// Build and run (from the repo root; needs macOS 15+):
//
//   swiftc -O scripts/photo_labels.swift -o /tmp/photo_labels
//   /tmp/photo_labels "data/takeout/Takeout/Google Photos/<album>" data/photo-labels.jsonl
//
// Output is one JSON object per line, sorted by file name. It holds only file
// names and labels -- no GPS, names or URLs -- so it is safe to commit.

import Foundation
import ImageIO
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
    FileHandle.standardError.write("usage: photo_labels <album_dir> <out.jsonl>\n".data(using: .utf8)!)
    exit(2)
}
let albumDir = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let photoExtensions: Set<String> = ["heic", "heif", "jpg", "jpeg", "png"]

let files = try FileManager.default
    .contentsOfDirectory(at: albumDir, includingPropertiesForKeys: nil)
    .filter { photoExtensions.contains($0.pathExtension.lowercased()) }
    .sorted { $0.lastPathComponent < $1.lastPathComponent }

// NSDecimalNumber keeps JSON tidy ("0.79", not "0.79000000000000004").
func round2(_ x: Double) -> NSDecimalNumber { NSDecimalNumber(string: String(format: "%.2f", x)) }
func round4(_ x: Double) -> NSDecimalNumber { NSDecimalNumber(string: String(format: "%.4f", x)) }

func analyze(_ url: URL) -> [String: Any] {
    var record: [String: Any] = ["file": url.lastPathComponent]

    if let source = CGImageSourceCreateWithURL(url as CFURL, nil),
       let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any] {
        record["width"] = props[kCGImagePropertyPixelWidth] as? Int ?? 0
        record["height"] = props[kCGImagePropertyPixelHeight] as? Int ?? 0
    }

    let classify = VNClassifyImageRequest()
    let faces = VNDetectFaceRectanglesRequest()
    let aesthetics = VNCalculateImageAestheticsScoresRequest()
    let handler = VNImageRequestHandler(url: url, options: [:])
    do {
        try handler.perform([classify, faces, aesthetics])
    } catch {
        record["error"] = String(describing: error)
        return record
    }

    record["labels"] = (classify.results ?? [])
        .filter { $0.confidence >= 0.2 }
        .sorted { $0.confidence > $1.confidence }
        .prefix(10)
        .map { ["label": $0.identifier, "confidence": round2(Double($0.confidence))] }

    let faceBoxes = faces.results ?? []
    record["faces"] = faceBoxes.count
    record["max_face_area"] = round4(faceBoxes.map { Double($0.boundingBox.width * $0.boundingBox.height) }.max() ?? 0)

    if let score = aesthetics.results?.first {
        record["aesthetic"] = round2(Double(score.overallScore))
        record["utility"] = score.isUtility
    }
    return record
}

// Photos are processed one at a time. Vision parallelizes each request
// internally; driving it from DispatchQueue.concurrentPerform exhausts its
// internal task-queue capacity and deadlocks (every thread waits at 0% CPU).
//
// Each record is appended as soon as it is done, so an interrupted run can
// simply be restarted: files already in the output are skipped.
var done = Set<String>()
if let existing = try? String(contentsOf: outURL, encoding: .utf8) {
    for line in existing.split(separator: "\n") {
        if let obj = try? JSONSerialization.jsonObject(with: Data(line.utf8)) as? [String: Any],
           let file = obj["file"] as? String, obj["error"] == nil {
            done.insert(file)
        }
    }
} else {
    FileManager.default.createFile(atPath: outURL.path, contents: nil)
}
let todo = files.filter { !done.contains($0.lastPathComponent) }
let out = try FileHandle(forWritingTo: outURL)
out.seekToEndOfFile()

let start = Date()
for (i, url) in todo.enumerated() {
    let record = autoreleasepool { analyze(url) }
    let data = try JSONSerialization.data(withJSONObject: record, options: [.sortedKeys])
    out.write(data)
    out.write("\n".data(using: .utf8)!)
    let n = i + 1
    if n % 50 == 0 || n == todo.count {
        let rate = Date().timeIntervalSince(start) / Double(n)
        let left = Int(rate * Double(todo.count - n))
        print("labeled \(n)/\(todo.count)  (\(String(format: "%.2f", rate)) s/photo, ~\(left / 60)m \(left % 60)s left)")
        fflush(stdout)
    }
}
try out.close()
print("Done: \(todo.count) new records (\(done.count) already present) in \(outURL.path)")
