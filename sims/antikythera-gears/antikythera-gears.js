// Antikythera-inspired teaching model, not a historical reconstruction.
// CANVAS_HEIGHT: 695
// Layout: 580 drawing + 3 control rows (3 * 35 + 10 = 115).
// Buttons: (10,585), (90,585), (170,585). Sliders: (160,625/660).
let canvasWidth = 800;
let drawHeight = 580;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 160;
let startButton, resetButton, stepButton, timeSlider, speedSlider;
let years = 0;
let isRunning = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  startButton = createButton('Start');
  resetButton = createButton('Reset');
  stepButton = createButton('+1 month');
  timeSlider = createSlider(0, 2, 0, 0.001);
  speedSlider = createSlider(0.02, 0.2, 0.06, 0.01);
  for (const control of [startButton, resetButton, stepButton, timeSlider, speedSlider]) {
    control.parent(document.querySelector('main'));
    control.style('font-size', '16px');
  }
  timeSlider.attribute('aria-label', 'Model time in years, zero to two');
  speedSlider.attribute('aria-label', 'Playback speed in model years per second');
  startButton.elt.addEventListener('click', () => {
    if (years >= 2) years = 0;
    setRunning(!isRunning);
  });
  resetButton.elt.addEventListener('click', () => {
    setRunning(false);
    years = 0;
    timeSlider.value(0);
    speedSlider.value(0.06);
  });
  stepButton.elt.addEventListener('click', () => {
    setRunning(false);
    years = Math.min(2, years + 1 / 12);
    timeSlider.value(years);
  });
  timeSlider.input(() => {
    setRunning(false);
    years = Number(timeSlider.value());
  });
  positionControls();
  textFont('Arial');
  describe('Three expanded gear trains model Sun, Moon and Mars cycles. Each left input turns once per model year. Sun: 48 teeth drive 48, ratio 1. Moon: 48 drive 12, linked axle carries 39 driving 12, ratio 13. Mars: 24 drive 48, ratio one half. Gear directions are mechanical, not directions in the sky. Use the labeled time slider or month step to compare outputs.');
}

function setRunning(value) {
  isRunning = value;
  startButton.html(value ? 'Pause' : 'Start');
}

function positionControls() {
  startButton.position(10, drawHeight + 5);
  startButton.size(70, 30);
  resetButton.position(90, drawHeight + 5);
  resetButton.size(70, 30);
  stepButton.position(170, drawHeight + 5);
  stepButton.size(110, 30);
  timeSlider.position(sliderLeftMargin, drawHeight + 45);
  speedSlider.position(sliderLeftMargin, drawHeight + 80);
  timeSlider.size(canvasWidth - sliderLeftMargin - margin);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function label(value, x, y, size = 16, align = LEFT, ink = 'midnightblue') {
  fill(ink);
  textSize(size);
  textAlign(align, CENTER);
  noStroke();
  text(value, x, y);
}

function draw() {
  const oldWidth = canvasWidth;
  updateCanvasSize();
  if (oldWidth !== canvasWidth) {
    resizeCanvas(canvasWidth, canvasHeight);
    positionControls();
  }
  if (isRunning) {
    years = Math.min(2, years + Math.min(deltaTime, 100) / 1000 * Number(speedSlider.value()));
    timeSlider.value(years);
    if (years >= 2) setRunning(false);
  }
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  label('Antikythera Gears', canvasWidth / 2, 25, 24, CENTER);
  label('Sun, Moon & Mars • simplified cycles', canvasWidth / 2, 52, 16, CENTER);
  const inputAngle = TWO_PI * years;
  const scaleFactor = Math.min(1, (canvasWidth - 40) / 420);
  const origin = (canvasWidth - 420 * scaleFactor) / 2;
  const rows = [
    ['Sun', 'goldenrod', 1, '48 / 48 = 1 turn per year'],
    ['Moon', 'lightsteelblue', 13, '(48 / 12) × (39 / 12) = 13 turns/year'],
    ['Mars', 'coral', 0.5, '24 / 48 = ½ turn per year']
  ];
  rows.forEach((row, i) => {
    const top = 85 + i * 145;
    label(row[0], 20, top, 20);
    label((years * row[2]).toFixed(2) + ' turns', canvasWidth - 20, top, 18, RIGHT);
    // Only horizontal coordinates and radii scale; the overall height stays fixed.
    push();
    translate(origin, top + 62);
    scale(scaleFactor, Math.min(scaleFactor, 1));
    if (i === 0) {
      gear(90, 0, 48, inputAngle, 'wheat');
      gear(186, 0, 48, -inputAngle + PI / 48, row[1]);
      label('output', 275, 0);
    } else if (i === 1) {
      // Expanded view: two separated centers represent the SAME rigid axle.
      stroke('slategray');
      strokeWeight(2);
      drawingContext.setLineDash([5, 5]);
      line(150, 0, 275, 0);
      drawingContext.setLineDash([]);
      label('same axle', 212, -48, 16, CENTER);
      gear(90, 0, 48, inputAngle, 'wheat');
      const intermediate = -4 * inputAngle + PI / 12;
      gear(150, 0, 12, intermediate, row[1]);
      gear(275, 0, 39, intermediate, row[1]);
      // Meshing phase: N1*a1 + N2*a2 = (N2-1)*PI.
      gear(326, 0, 12, (11 * PI - 39 * intermediate) / 12, row[1]);
    } else {
      gear(90, 0, 24, inputAngle, 'wheat');
      gear(162, 0, 48, -inputAngle / 2 + PI / 48, row[1]);
      label('output', 250, 0);
    }
    pop();
    label(row[3], canvasWidth / 2, top + 120, 16, CENTER);
    if (i < 2) {
      stroke('silver');
      line(20, top + 132, canvasWidth - 20, top + 132);
    }
  });
  label('Each left gear: 1 turn per model year.', canvasWidth / 2, 527, 16, CENTER);
  label('Teaching gears, not a sky-position predictor.', canvasWidth / 2, 552, canvasWidth < 380 ? 14 : 16, CENTER);
  label('Year: ' + years.toFixed(3), 10, drawHeight + 55);
  label('Speed: ' + Number(speedSlider.value()).toFixed(2) + ' yr/s', 10, drawHeight + 90);
}

function gear(x, y, teeth, angle, colorName) {
  // Equal module: pitch radius is teeth pixels. Four vertices per tooth.
  // Opposing gears use complementary tooth phases at the pitch circle.
  push();
  translate(x, y);
  rotate(angle);
  fill(colorName);
  stroke('saddlebrown');
  strokeWeight(1);
  beginShape();
  for (let tooth = 0; tooth < teeth; tooth++) {
    for (let corner = 0; corner < 4; corner++) {
      const a = (tooth + corner / 4 - 0.375) * TWO_PI / teeth;
      const r = teeth + (corner === 1 || corner === 2 ? 1.8 : -1.8);
      vertex(r * cos(a), r * sin(a));
    }
  }
  endShape(CLOSE);
  stroke('saddlebrown');
  strokeWeight(2);
  line(0, 0, teeth - 5, 0);
  fill('saddlebrown');
  noStroke();
  circle(teeth - 5, 0, 5);
  pop();
  // Fixed upright tooth-count badges; the spoke shows angular motion.
  fill('white');
  stroke('saddlebrown');
  strokeWeight(1);
  circle(x, y, teeth < 20 ? 19 : 28);
  label(String(teeth), x, y, teeth < 20 ? 12 : 16, CENTER);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
