# Reverse-engineering matrix (reference theme to Kits)

Status: **open**. The catalogue of all 50 pattern files, 9 templates, 2 parts and 7 variations exists in `docs/theme/` (rows classify by role). This matrix adds the functional and architectural comparison. Nothing from the reference theme is copied; every difference is recorded with its reason.

| Area | Reference behaviour | Kits implementation | Difference and reason | Evidence | Gap |
|---|---|---|---|---|---|
| `theme.json` fluid typography | on | off (`theme.json` `typography.fluid`) | not yet decided or recorded | to compare | open |
| `theme.json` drop caps, gradients, duotone | present | absent | not yet recorded | to compare | open |
| `theme.json` custom weight/line-height maps | present | line-height only | not yet recorded | to compare | open |
| Defaults off (palette, sizes, spacing, shadows) | off | not set | would hide core presets; recorded as excluded | plan notes | open |
| Block styles in `theme.json` | 25 blocks | 13 blocks; rest in `kit.css` | behavioural comparison not made | to compare | open |
| `style.css` forms, mark, th, focus | present | own rules in kit CSS | to compare in a browser | to compare | open |
| Navigation overlay and submenu | CSS rules | rules in `kit.css` | to compare in a browser | to compare | open |
| Responsive rules 600 and 782 px | present | own breakpoints | to compare | to compare | open |
| Patterns (50) | block structures | 47 patterns | block-level comparison not made | catalogue only | open |
| Templates (9), parts (2) | present | 10 templates, 4 parts | catalogued; not compared in a browser | catalogue | open |
| Variations (7) | colour only | dark, forest, slate + ink | excluded by decision; Kits Dark broken (G17) | runs | open |
