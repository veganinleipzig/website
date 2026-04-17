# Vegan in Leipzig

This repository contains the static 11ty landing page for Vegan in Leipzig.

- Repository: <https://github.com/veganinleipzig/website>
- Production site: <https://vegan-in-leipzig.de/>

## Development

Start the local preview:

```bash
npm run dev
```

The preview is then available at `http://127.0.0.1:4000/`.

Run the local CI-style check before pushing:

```bash
npm run check:ci
```

If you want that check to run automatically before every commit:

```bash
npm run hooks:install
```

## Build

Build the site into `output/site/`:

```bash
npm run build
```

## Content Management

The site is a single poster-style one-pager. Its main content lives in `src/index.11tydata.json`, and the editor-facing CMS surface lives in `.pages.yml`.

## Deployment

Deployment runs through GitHub Pages via `.github/workflows/deploy.yaml` and publishes `output/site`.

## License

Unless a file states otherwise, project-authored code, configuration, templates, styles, and documentation in this repository are available under the permissive [0BSD](LICENSE) license.

No trademark rights are granted in the names or logos of Vegan in Leipzig or third parties. Media under `src/images/` and bundled font files under `src/assets/fonts/` may be subject to separate rights and should be treated as excluded unless you have permission from the respective rights holder or the upstream font license.
