---
title: Story Characters, Places and House Style
description: The shared visual bible for the Mediterranean Travels graphic novels - one canonical description of every character, place and object that appears in more than one story, plus the house art style.
---

# Story Characters, Places and House Style

This page is the **single source of truth** for anything that appears in more
than one of the graphic-novel stories. Every story's `index.md` points here,
and every image prompt in those stories reuses the **paste-in blocks** below
word for word, so that Glaux, Athena or the Parthenon looks like the same
person or place in every story, however many different images the
text-to-image model makes.

Glaux's identity comes from the mascot's canonical file,
[`docs/img/mascot/character-sheet.md`](../img/mascot/character-sheet.md). The
block for Glaux below is a compact copy of that sheet. If the two ever
disagree, **the character sheet wins**; fix this page to match it.

## How the Prompts Use This Page

- Each image prompt is **self-contained**. A text-to-image model has no
  memory of this page, so every prompt that shows a recurring character,
  place or object pastes that item's block in full.
- Each prompt opens with the **house style line** below, so all 22 stories
  share one look.
- Each prompt ends with the guide's required sentence: *Generate the image
  immediately without asking clarifying questions.*
- **No lettering in panels.** Panel images contain no captions, speech
  bubbles, signs or labels, because image models misspell text. The story's
  words live in the paragraph under each panel. The **cover** is the one
  exception: it carries the story title.
- All images are wide landscape, **16:9**.

## House Style

Paste this sentence at the start of every prompt body, right after the
identifier line:

```text
Style: a hand-drawn travel-sketchbook graphic-novel illustration, with clean dark ink outlines, flat softly shaded color fills and a faint watercolor paper texture, like a page from a traveler's journal; warm, sunlit, painterly lighting; no text, captions, signs, letters or speech bubbles anywhere in the image.
```

This is the same style as Glaux's own pose set, so the owl never looks pasted
in from another book. Each story adds its own palette on top of the house
style (see "Palettes by Era" below), but never replaces it. Real photographs,
3D renders, anime styles and photorealism are all off-brand.

### Safe-Image Rules

Image models refuse some content. These stories involve sieges, battles and
a trial, so every violent moment is shown by its aftermath or its symbol:

- No blood, wounds, corpses, weapons mid-strike, torture or executions.
- A death is shown by an empty chair, a cup, a quiet room or mourners from
  behind.
- A battle is shown by ships, smoke on the horizon, banners, dust and
  silhouettes at a distance.
- No nudity. Greek statues and vase figures are shown draped, or shown only
  from a distance in soft focus.
- Avoid swastikas and similar hate symbols entirely, even historically.

### Palettes by Era

| Era | Palette to name in the prompt |
|---|---|
| Myth time and Bronze Age Crete | Terracotta red, ochre, lapis blue, cream plaster, olive green |
| Classical Greece (500-300 BCE) | Marble white, Aegean blue, olive green, honey gold, bronze |
| Hellenistic and Roman (300 BCE-300 CE) | Warm limestone, sea-green, deep red, bronze, evening gold |
| Byzantine (300-1453 CE) | Gold leaf, deep blue, imperial purple, candle amber, cream marble |
| Medieval Rhodes and Venetian Crete | Sandstone, steel gray, Mediterranean blue, banner crimson |
| Ottoman (1453-1922) | Iznik turquoise, cobalt, tomato red, brass, saffron, white plaster |
| Modern Turkey and Greece | Natural daylight, whitewashed walls, sea blue, terracotta, olive |

## Paste-In Blocks: The Recurring Cast

### Glaux the Little Owl (every story)

Glaux appears in **every** story. In historical scenes Glaux is an
**observer**: an ordinary owl-sized little owl perched on a ledge, column,
mast, gate or statue, never speaking to or touching the people of the past,
and drawn small enough that a reader must hunt for the owl (the series'
"Find Glaux" game). Only in myth-time scenes (Story 1) does Glaux act as a
character. Glaux has no gender; write "Glaux" or "they."

```text
Glaux the Little Owl: a true little owl (Athene noctua), small, round and compact, with a flat rounded head and no ear tufts, warm earth-brown plumage with cream spots, bright lemon-yellow eyes under pale cream eyebrows, a cream-white throat patch and a short pale greenish-yellow beak. Glaux wears a small Aegean-blue scarf and a tan canvas satchel across the body with a small leather-bound travel notebook peeking out, and a sprig of three olive leaves tucked into the satchel strap. Alert, curious and warm expression.
```

For "Find Glaux" panels, add: *Glaux is drawn small, perched at the edge of
the scene, noticeable on a second look.*

### The Travelers (the "Then and Now" panels)

Each story's final panel returns to the same place today. Two anonymous
adult visitors stand in it, always **seen from behind or at a distance**,
never in close-up, so no face needs to stay consistent.

```text
Two adult travelers seen from behind or in distant three-quarter view, dressed for cool November weather: one in a dark green rain jacket, the other in a charcoal wool coat with a rust-colored scarf, both with small daypacks, standing close together and looking at the view. Faces are never shown in detail.
```

### Athena (Stories 1, 17, 18)

Goddess of wisdom and craft, patron of Athens. Calm, strong, not
aggressive; weapons are shown at rest. Her owl is always Glaux-sized, and
there should be only **one** owl in a scene.

```text
Athena, goddess of wisdom: a tall, composed woman with dark wavy hair and calm gray eyes, wearing a bronze Corinthian-style helmet pushed up on her forehead with a tall crest, a long white wool peplos with a deep Aegean-blue border, and a scaled bronze-gold aegis cloak over the shoulders. She carries a tall spear held upright at rest and a round shield with a plain olive-wood face. Her expression is thoughtful and steady.
```

### The Olympians: Zeus, Poseidon and Apollo (Stories 1, 13, 20)

```text
Zeus, king of the gods: a broad, powerfully built older man with a full curled silver-white beard and thick white hair, wearing a gold-edged crimson himation draped over one shoulder, holding a short gilded scepter topped with an eagle; a faint storm-cloud glow behind him. Poseidon, god of the sea: a muscular man with a windswept sea-green beard and hair, a deep teal himation, holding a three-pronged bronze trident. Apollo, god of light and prophecy: a graceful, beardless young man with shoulder-length golden-brown hair crowned with a laurel wreath, a saffron-yellow chiton, holding a small laurel branch and a gold lyre.
```

### The Pythia, Apollo's Priestess at Delphi (Stories 17 and 20)

```text
The Pythia, Apollo's priestess at Delphi: a dignified woman of about fifty with gray-streaked dark hair under a simple white veil, wearing a plain long white linen gown with a wreath of laurel leaves in her hair, holding a laurel branch in one hand and a shallow bronze offering bowl in the other. Her expression is calm, inward and serious.
```

### Themistocles (Stories 17 and 19)

```text
Themistocles, Athenian statesman and admiral: a stocky, energetic man of about forty-five with a short dark curly beard, sharp dark eyes and a weathered, tanned face, wearing a plain cream chiton and a rust-brown himation draped over one shoulder, a bronze signet ring on his right hand; confident, restless, always mid-gesture.
```

### Pericles (Story 18, cameo in Story 19)

```text
Pericles, Athenian leader: a dignified man of about fifty-five with an unusually tall, long head, usually shown wearing a crested bronze helmet pushed back on his head, a trimmed gray-brown beard and a calm, commanding expression, dressed in a white himation with a dark-blue border draped over a cream chiton.
```

### Socrates (Story 19)

```text
Socrates, Athenian philosopher: a short, stocky man of about sixty with a bald, broad forehead, a wide flat nose, a thick gray beard and bright, amused eyes, barefoot, wearing a plain, worn, undyed wool himation and no jewelry; a curious, teasing expression.
```

### Francesco Morosini (Stories 15 and 18)

Venetian commander. In both stories he is seen in the same dress and age.

```text
Francesco Morosini, Venetian commander: a lean man of about sixty with a long gray beard, a high forehead and a stern, tired expression, wearing a dark crimson velvet coat with gold braid over a steel breastplate, a wide white lace collar, a black cap with a small gold badge, and the red-and-gold sash of a Venetian captain-general.
```

### Mustafa Kemal Atatürk (Stories 6 and 8)

Shown only as a **young Ottoman officer in 1915** (Story 8) and as the
**mid-career head of state in 1928** (Story 6), never as an old man. Use
the matching block.

```text
Mustafa Kemal as a young Ottoman officer in 1915: a lean man of about thirty-four with light blue-gray eyes, light brown hair and a thin mustache, wearing a khaki Ottoman army field uniform with a peaked cap, binoculars at his chest and a calm, watchful expression.
```

```text
Mustafa Kemal Atatürk in 1928: a man of forty-seven with penetrating light blue-gray eyes, short light-brown hair combed back and a thin mustache, wearing a well-cut dark Western suit with a white collar and tie, standing at a large portable blackboard with a piece of white chalk in his hand, a teacherly, patient expression.
```

### Arthur Evans (Stories 13 and 14)

```text
Sir Arthur Evans, British archaeologist: a short, energetic man in his fifties with a neat white beard, round wire glasses, a weathered face, wearing a rumpled cream linen jacket, a wide-brimmed straw hat and carrying a walking stick; he often carries a small ancient clay fragment in one hand and gestures eagerly.
```

## Paste-In Blocks: Recurring Places and Objects

### The Parthenon and the Acropolis (Stories 1, 17, 18, 19, 21 and the Then-and-Now panels)

```text
The Acropolis of Athens: a steep, flat-topped, pale limestone rock rising above the city, crowned by the Parthenon, a long Doric temple of honey-colored marble with eight columns across the front, a low triangular pediment and a long carved frieze under the roof; to its left stands the smaller Erechtheion with its porch of six marble maidens. The sky behind is clear blue.
```

### Hagia Sophia (Stories 2 and 3)

```text
Hagia Sophia in Constantinople: a vast cream-and-ochre brick church crowned by one enormous shallow central dome ringed with a band of forty small arched windows, with a half-dome on either side and four tall minarets (add the minarets only in scenes after 1453); gold mosaics glowing inside.
```

### The Temple of Apollo and Sacred Way at Delphi (Stories 17 and 20)

```text
Delphi, the sanctuary of Apollo: a steep rocky terrace on the slope of Mount Parnassus with a paved winding Sacred Way lined with small treasuries and statues, leading up to the large Doric Temple of Apollo with six columns across the front; behind it steep gray limestone cliffs, below it a deep valley of silver-green olive trees stretching to a distant sea.
```

### The Owl Coin (Stories 1, 17, 18, 19)

```text
An ancient Athenian silver tetradrachm coin: a thick round silver coin showing the head of Athena in a crested helmet on one side and, on the other, a standing little owl beside an olive sprig and a crescent moon, with a rough, hand-struck edge.
```

### The Serpent Column (Stories 17 and 3)

```text
The Serpent Column: a tall bronze column made of three snakes twisted together in a spiral, which once held a golden bowl, now with the serpents' heads missing; weathered dark green-bronze, with a worn stone base.
```

### The Knossos Palace and the Giant Jar (Stories 13, 14, 16)

```text
The Palace of Knossos on Crete: a sprawl of low, flat-roofed, honey-colored stone buildings around an open central court, with distinctive red-painted, downward-tapering wooden columns (wider at the top than the bottom) with black capitals, and colorful frescoes; storerooms hold giant human-tall clay jars (pithoi) with rope-like ridged bands.
```

## Quick Reference: Who Appears Where

| Character, place or object | Stories |
|---|---|
| Glaux | All 22 |
| The Travelers | All 22 (final "Then and Now" panel) |
| Athena | 1, 17, 18 |
| Zeus, Poseidon, Apollo | 1, 13, 20 |
| The Pythia | 17, 20 |
| Themistocles | 17, 19 |
| Pericles | 18, 19 |
| Socrates | 19 |
| Francesco Morosini | 15, 18 |
| Mustafa Kemal Atatürk | 6, 8 |
| Arthur Evans | 13, 14 |
| The Parthenon and Acropolis | 1, 17, 18, 19, 21 |
| Hagia Sophia | 2, 3 |
| Delphi | 17, 20 |
| The owl coin | 1, 17, 18, 19 |
| The Serpent Column | 3, 17 |
| Knossos and the giant jars | 13, 14, 16 |
