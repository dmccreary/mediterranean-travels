# Text to Image Prompt

Your task is to generate images for 22 graphic novel stories.  The graphic novel stories are all stored in @docs/stories.  Each story has it's own directory.  Within the story directory you will find the main index.md for that story.  Within the index.md file there are between 8 and 16 image descriptions including the cover image.  Your task is to generate the images for each story from the image descriptions.

One important aspect is character consistency.  There are many characters that appear in multiple panels and multiple stories.  These characters must be consistent.  To enable this you must read the character sheet @docs/stories/characters.md into the context window before you generate any story.  This describes the house style and gives detailed descriptions of the shared houses and characters.

Things to know before you hand the prompts to the image model

- Prompt length: the prompts are long, with a median of about 295 words and a maximum of about 510. The pasted character blocks make them long, but each prompt works on its own.
- Images: the image links in each story are commented out, as the skill describes. Once the PNGs exist, run uncomment-images.sh on each story. The panel images contain no lettering because image models misspell text, so only the covers carry a title.
- Safety: battles, the trial of Socrates and the 1687 Parthenon explosion are shown by smoke, silhouettes, empty chairs and objects. There is no gore, which should avoid the safety-filter refusals the skill warns about.

- Facts the writers changed from my sketch:

  - They followed the chapters over the sketch where the two disagreed.
  - Story 19 says "about 500" jurors rather than 501.
  - Story 20 has Croesus's envoys, not Croesus himself, at Delphi.
  - The Colossus lay fallen for nearly nine centuries, not eight.
  - The Başöğretmen title dates from after the park scene.

- Chapter gaps: the Mehmetçik statue story and the 1915 truce are not in Chapter 8, so those are sourced from web search and labelled as tradition. Story 4's coffee beat (arrival in the 1550s, closures about 1633) is from general history and hedged. The Greek Tselementes dating is left out.

- Unverified links: every Wikipedia link returns 200, and I replaced one dead Wikipedia link. 32 Britannica and UNESCO links return 403 to automated requests, and one Metropolitan Museum link returns 429 (rate-limited), so I couldn't confirm them. Click through before publishing.

- Anonymous travelers: the "Then and Now" panels show the travelers only from behind. I left out your names and faces, because the prompts go to an outside service.

Ask me any questions if the instructions are not clear to you.