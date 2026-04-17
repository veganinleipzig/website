# AGENTS

## General Agent Workflow

- Classify each task first: content, structure, styling, testing, or deployment.
- Stay close to the current 11ty poster-page architecture and avoid new abstractions unless they clearly simplify the site.
- Work mobile-first, verify UI changes with Playwright when relevant, and refresh `output/site` after site changes so preview and deployment stay aligned.

## Editing Conventions

### Repo And Files

- This is a static 11ty site with no backend or infrastructure layer.
- Use the existing build, preview, and CI workflows; do not introduce extra toolchains, frameworks, or backend-style abstractions.
- Treat `.nvmrc` as the source of truth for Node locally and in CI.

### 11ty Patterns And Content Model

- `src/index.md` stays a thin page shell.
- `src/index.11tydata.json` contains the live page content and should remain the primary structured content source.
- `src/_includes/` should render content, not store it.
- Model repeated content as arrays or objects, not HTML strings; only use freeform HTML in data when a structured alternative would be disproportionately complex.
- Move shared metadata into `src/_data/` only when it is genuinely reused.
- When editing, decide whether the change is content, structure, or styling first: prefer data edits, then templates, then CSS.
- Keep repeated content structured and editor-friendly in `.pages.yml` when it is expected to be CMS-managed.

### Pages CMS

- `.pages.yml` is the curated Pages CMS editing surface and should stay aligned with the live 11ty content model.
- Keep `.pages.yml` consistent with the current `src/index.11tydata.json` structure, but it does not need to expose every field one-to-one.

### Assets

- Prefer local fonts, images, and other assets over remote runtime dependencies.
- Use the existing asset locations: `src/images/`, `src/assets/sass/`, and `src/assets/fonts/`.
- Keep the primary stylesheet in `src/assets/sass/main.scss`.
- Let 11ty passthrough copy handle static assets instead of adding duplicate copy stages.
- Keep asset names clear and stable.
- Remove unused assets once they are clearly no longer referenced by the live page or CMS model.

### Playwright Verification

- Use Playwright for UI-affecting changes and check at least mobile and tablet; include desktop when full-width layout changes are involved.
- Confirm there is no normal-use horizontal overflow.
- If Playwright verification cannot be completed, record the blocker clearly.

### Build And Deployment

- Run the build after changes and review the generated site in `output/site/`.
- Keep deployment output rooted in `output/site` and use root-relative paths.
- Review responsive behavior at least on mobile and tablet before considering the work finished.

### GitHub CI

- Keep local verification aligned with `.github/workflows/ci.yaml`, which runs formatting, builds the site, and runs the Playwright suite.
- Deployment is handled separately via `.github/workflows/deploy.yaml`.
- After deploys, the same Playwright suite can be pointed at production when a live smoke check is needed.

## Frontend Conventions

### Design

- Preserve the existing editorial, poster-like visual language unless the task is an explicit redesign.
- Mobile-first layout decisions should scale deliberately to tablet and desktop.
- Keep desktop line lengths controlled, sections clearly separated without heavy dividers, and cards compact.
- Build hierarchy through typography, spacing, and restrained accents rather than saturated blocks.

### Accessibility

- Do not rely on color alone to communicate meaning.
- Keep link text descriptive and heading order clear.
- Only place text on images or colored surfaces when readability is stable.
- Keep touch targets comfortable on mobile.
- Keep decorative images hidden from assistive technology and use meaningful alt text for content images.
- Keep anchor targets unobscured.
- Prefer native semantics over ARIA, maintain a clear heading structure, and preserve visible focus states.
