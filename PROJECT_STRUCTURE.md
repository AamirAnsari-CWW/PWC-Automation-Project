# Project Structure

The project is split into a React frontend and an Express backend. Generated folders such as `node_modules/`, `dist/`, `exports/`, and runtime uploads are listed in the notes section instead of being expanded.

```text
PWC Automation Project/
├── README.md
├── PROJECT_STRUCTURE.md
├── client/
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx                         # React entry point
│       ├── App.jsx                          # Route definitions
│       ├── components/                      # Shared UI primitives
│       │   ├── Button/
│       │   ├── Card/
│       │   ├── Input/
│       │   ├── Layout/
│       │   ├── Loader/
│       │   ├── Navbar/
│       │   └── Sidebar/
│       ├── constants/
│       │   ├── api.js                       # API base URL
│       │   └── routes.js                    # Frontend route constants
│       ├── hooks/                           # Shared API-backed React hooks
│       │   ├── useProject.js
│       │   ├── useProjects.js
│       │   ├── useTemplate.js
│       │   └── useTemplates.js
│       ├── modules/
│       │   ├── BannerEditor/
│       │   │   ├── BannerEditor.jsx         # Editor orchestration, save/export flow
│       │   │   ├── BannerEditor.css
│       │   │   ├── components/
│       │   │   │   ├── BackgroundEditor/    # Numeric transform controls
│       │   │   │   ├── BannerPreview/       # Preview iframe and edit overlays
│       │   │   │   ├── ImageEditor/         # Drag, resize, rotate, zoom interactions
│       │   │   │   ├── PropertyPanel/       # Text, image, and shape controls
│       │   │   │   ├── SiloFineAdjustment/  # Fine position controls for silo layer
│       │   │   │   ├── TextEditor/          # Editable text fields
│       │   │   │   └── Toolbar/             # Save/export/status actions
│       │   │   ├── context/
│       │   │   │   └── EditorContext.jsx    # Central editor reducer/state
│       │   │   ├── hooks/
│       │   │   │   └── useAutosave.js       # Debounced project persistence
│       │   │   ├── services/
│       │   │   │   ├── bannerBridge.js      # postMessage bridge to preview iframe
│       │   │   │   └── previewService.js    # Preview URL helpers
│       │   │   └── utils/
│       │   │       └── imageTransform.js    # Fit, clamp, zoom, normalize helpers
│       │   ├── Dashboard/
│       │   │   ├── Dashboard.jsx            # Workspace landing page
│       │   │   ├── Dashboard.css
│       │   │   └── components/
│       │   │       ├── RecentProjects/
│       │   │       ├── RecentTemplates/
│       │   │       └── StatsCard/
│       │   ├── Projects/
│       │   ├── Settings/
│       │   └── TemplateLibrary/
│       │       ├── TemplateLibrary.jsx       # Template and size selection
│       │       ├── TemplateLibrary.css
│       │       └── components/
│       │           ├── SizeSelector/
│       │           └── TemplateCard/
│       ├── services/                         # Frontend API wrappers
│       │   ├── exportService.js
│       │   ├── projectService.js
│       │   ├── templateService.js
│       │   └── uploadService.js
│       ├── styles/
│       │   ├── global.css
│       │   └── variables.css
│       └── utils/
│           └── templateUtils.js
└── server/
    ├── package.json
    ├── package-lock.json
    ├── server.js                         # Express app entry point
    ├── config/
    │   ├── storagePaths.js                # Upload/export paths
    │   └── templatePaths.js               # Template root paths
    ├── controllers/                       # HTTP request handlers
    │   ├── exportController.js
    │   ├── previewController.js
    │   ├── projectController.js
    │   ├── templateController.js
    │   └── uploadController.js
    ├── data/
    │   └── projects.json                  # JSON project metadata store
    ├── middleware/
    │   └── errorHandler.js
    ├── routes/                            # API and preview routes
    │   ├── exportRoutes.js
    │   ├── previewRoutes.js
    │   ├── projectRoutes.js
    │   ├── templateRoutes.js
    │   └── uploadRoutes.js
    ├── services/                          # Backend business logic
    │   ├── exportService.js               # Export package generation
    │   ├── imageService.js                # Image upload/file helpers
    │   ├── previewRuntimeService.js       # Injected DOM update runtime
    │   ├── previewService.js              # Preview HTML generation
    │   ├── projectService.js              # Project CRUD behavior
    │   ├── projectStoreService.js         # JSON store reads/writes
    │   ├── templateService.js             # Template metadata and lookup
    │   ├── textService.js                 # Text replacement helpers
    │   └── zipService.js                  # Zip archive creation
    ├── templates/
    │   ├── template.json                  # Template catalog and edit metadata
    │   ├── 160x600/
    │   ├── 300x250/
    │   ├── 300x600/
    │   ├── 728x90/
    │   └── 970x250/
    ├── uploads/
    │   └── projects/                      # Uploaded project assets
    ├── exports/                           # Generated export folders and zip files
    └── utils/
        └── httpError.js
```

## Banner Template Folder Pattern

Each size folder under `server/templates/` follows this general layout:

```text
server/templates/<size>/
├── README.md
├── env.json
├── gulpfile.js
├── package.json
├── package-lock.json
├── <size>.jpg
├── <size>.zip
├── dist/                 # Generated template build
├── sass/
├── src/
│   ├── index.html
│   ├── config.js
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   └── overlays/
└── tests/
```

Current sizes:

- `160x600`
- `300x250`
- `300x600`
- `728x90`
- `970x250`

## Runtime And Generated Folders

- `client/node_modules/` - installed frontend dependencies.
- `client/dist/` - generated frontend production build.
- `server/node_modules/` - installed backend dependencies.
- `server/templates/*/node_modules/` - template-specific dependencies, present in some template folders.
- `server/templates/*/dist/` - generated build output for individual banner templates.
- `server/uploads/projects/` - uploaded user/project images.
- `server/exports/` - generated export package folders and zip files.

## Responsibility Map

- Frontend pages and feature modules live in `client/src/modules/`.
- Shared frontend components live in `client/src/components/`.
- Frontend API calls live in `client/src/services/`.
- Backend route definitions live in `server/routes/`.
- Backend controllers translate HTTP requests into service calls.
- Backend services own template lookup, preview generation, project storage, uploads, exports, and zip creation.
- Template editability is configured in `server/templates/template.json`.
