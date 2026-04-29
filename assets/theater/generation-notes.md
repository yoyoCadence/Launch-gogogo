# Theater Asset Generation Notes

The generated theater pack uses a consistent runtime contract:

- 11 raster theater styles: anime, cyberpunk, gothic-lolita, pixel, arcade, retro-16bit, storybook, chibi, painted-fantasy, muted-jp-life, arcade-fighter-90s.
- 5 restaurant stages per style: bento, drink, noodle, fastFood, cafe.
- 6 character cutouts per style: runner, foodie, thinker, each with female and male variants.
- Current runtime uses female character assets first. Male variants are generated for the upcoming character gender selector.

Prompt principles:

- Use original designs only. Famous examples were treated as broad visual-language references, not as IP copies.
- Stages are 16:9, no foreground characters, no readable text, no logos, with a counter on the left, dining area on the right, and a readable center path.
- Character sheets are 3 columns by 2 rows on solid magenta, with columns ordered runner, foodie, thinker and rows ordered female, male.
- Character roles stay stable across styles: runner is energetic, foodie is expressive and meal-focused, thinker is calm and planning-focused.

Style references used for prompt wording:

- Anime: bold clean linework, energetic shonen-inspired silhouettes, bright lunch-app colors.
- Cyberpunk / sci-fi UI: neon rim light, holographic panels, graphite surfaces, cyan/magenta accents.
- Gothic lolita: lace, ribbons, burgundy velvet, black lacquer, gold trim, refined tea-room mood.
- Pixel: limited palette, chunky readable clusters, hard pixel edges, low-resolution game readability.
- Arcade: saturated coin-op energy, glossy floors, cabinet lighting, punchy color accents.
- Retro 16-bit RPG: SNES-era town/tavern language, tile-like floors, compact readable sprites.
- Storybook: watercolor wash, pencil linework, rounded furniture, warm picture-book staging.
- Chibi: big-head small-body proportions, rounded pastel props, toy-like softness.
- Painted fantasy RPG: thick brushwork, tavern/guild materials, warm magical lighting.
- Muted Japanese daily-life: low saturation, soft daylight, simple neighborhood lunch-shop mood.
- 90s arcade fighting: high-contrast rim light, wet pavement, dramatic stage composition, bold sprite-era silhouettes.
