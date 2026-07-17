# PWC Banner Automation Project

This project is a full-stack banner automation workspace for creating editable HTML5 banner variants from approved templates. The React frontend lets users choose a template, edit copy and images, adjust visual placement, save projects, and export production-ready banner packages. The Express backend serves template assets, stores project metadata, handles uploads, generates previews, and creates downloadable zip exports.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, React Icons
- Backend: Node.js, Express, Multer, fs-extra, Archiver
- Template runtime: static HTML/CSS/JS banner templates with an injected preview runtime
- Storage: JSON project metadata plus local upload/export folders

## Repository Layout

```text
client/                 React + Vite frontend
server/                 Express API, template storage, preview/export services
server/templates/       Source banner templates by size
server/uploads/         Runtime uploaded project images
server/exports/         Generated export packages
PROJECT_STRUCTURE.md    Detailed directory map
```

## Getting Started

Install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

By default, the API runs at `http://localhost:5001/api`. The frontend reads `VITE_API_BASE_URL` and falls back to that URL when no environment variable is provided.



## How The App Works

1. The frontend loads template metadata from the backend.
2. A user selects a template and banner size from the template library.
3. `BannerEditor` loads the project/template state and wraps the workspace in `EditorProvider`.
4. Text, image, shape, background, and silo adjustments are stored in editor state.
5. The preview iframe receives live updates through the banner bridge and the injected preview runtime.
6. Saving creates or updates a project in `server/data/projects.json`.
7. Exporting copies the selected template, applies project changes, and writes a zip package under `server/exports/`.

## Data Flow For New Features

- Template metadata comes from `server/templates/template.json` and size folders under `server/templates/`.
- Saved project data comes from `server/data/projects.json`.
- Uploaded images are written to `server/uploads/projects/` and referenced by URL in saved project data.
- Frontend hooks in `client/src/hooks/` call API wrappers in `client/src/services/`.
- Backend routes in `server/routes/` call controllers, and controllers call `server/services/`.
- Editor-only state lives in `client/src/modules/BannerEditor/context/EditorContext.jsx`.
- Save/export state is assembled in `client/src/modules/BannerEditor/BannerEditor.jsx` as `projectPayload`.
- Live preview data is sent through `client/src/modules/BannerEditor/services/bannerBridge.js` and applied inside the iframe by `server/services/previewRuntimeService.js`.

When adding a new editable feature, update the editor reducer, include the field in `projectPayload`, normalize it in `server/services/projectService.js`, and add a preview message/runtime handler if the iframe needs to change live.

## Important Files

- `client/src/modules/BannerEditor/BannerEditor.jsx` - editor orchestration, save/export payloads, upload handling, and mode switching.
- `client/src/modules/BannerEditor/context/EditorContext.jsx` - central reducer and editor state defaults.
- `client/src/modules/BannerEditor/components/PropertyPanel/PropertyPanel.jsx` - side-panel controls for text, images, shapes, and fine adjustments.
- `client/src/modules/BannerEditor/components/BannerPreview/BannerPreview.jsx` - preview iframe and editing overlays.
- `server/services/previewRuntimeService.js` - injects the browser runtime that updates static banner DOM nodes during preview.
- `server/services/exportService.js` - creates final downloadable banner packages.
- `server/templates/template.json` - template catalog and editable field configuration.

## Template Notes

Each banner size lives under `server/templates/<size>/`. Template metadata defines which text IDs, images, and shape selectors the editor may change. Keep animation and locked creative behavior inside the template files; expose only controlled edit points through metadata.

When adding a new size:

1. Add the template folder under `server/templates/`.
2. Match the existing folder pattern with `src/`, `dist/`, `sass/`, and template assets.
3. Register the size in `server/templates/template.json`.
4. Add editable text/image/shape metadata if the defaults do not apply.

## Development Notes

- Do not commit generated dependency folders or one-off export packages unless there is a deliberate reason.
- Keep frontend API access inside `client/src/services/`.
- Keep backend route handlers thin and put file/template/export logic in `server/services/`.
- Comments in source files should explain workflow boundaries and non-obvious DOM/runtime behavior.
