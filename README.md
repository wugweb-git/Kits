
  # wugweb kits

  This is a code bundle for wugweb kits. The original project is available at https://www.figma.com/design/ttIty8LUIsRsU4AJFlX8To/wugweb-kits.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Figma export post-processing

If code is regenerated from Figma or an export tool, normalize imports before committing:

1. Export the components into `src/` as usual.
2. Rewrite version-pinned package specifiers to bare npm package names, for example `sonner@2.0.3` → `sonner` and `@radix-ui/react-dialog@1.1.6` → `@radix-ui/react-dialog`.
3. Keep Figma asset specifiers only where the repo still depends on `figma:asset/...` aliases.
4. Run `npm run check:imports` to confirm no `@<version>` package imports remain in checked source files.

If your exporter supports import mapping, configure it to emit bare package names directly so this rewrite step is unnecessary for future exports.

