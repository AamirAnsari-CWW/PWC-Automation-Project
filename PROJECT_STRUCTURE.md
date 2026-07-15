# Project Folder Structure

This project is split into two main applications:

- `client/` - React + Vite frontend.
- `server/` - Express backend, template storage, uploads, previews, and exports.

Generated folders such as `node_modules/`, `dist/`, `exports/`, and runtime uploads are noted but not expanded fully.

```text
Automation Project/
├── PROJECT_STRUCTURE.md
├── client/
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── dist/                         # Generated Vite production build
│   ├── node_modules/                 # Installed frontend dependencies
│   └── src/
│       ├── App.jsx                   # Main app component and routing shell
│       ├── main.jsx                  # React entry point
│       ├── components/               # Reusable UI components
│       │   ├── Button/
│       │   │   ├── Button.jsx
│       │   │   └── Button.css
│       │   ├── Card/
│       │   │   ├── Card.jsx
│       │   │   └── Card.css
│       │   ├── Input/
│       │   │   ├── Input.jsx
│       │   │   └── Input.css
│       │   ├── Layout/
│       │   │   ├── Layout.jsx
│       │   │   └── Layout.css
│       │   ├── Loader/
│       │   │   ├── Loader.jsx
│       │   │   └── Loader.css
│       │   ├── Navbar/
│       │   │   ├── Navbar.jsx
│       │   │   └── Navbar.css
│       │   └── Sidebar/
│       │       ├── Sidebar.jsx
│       │       └── Sidebar.css
│       ├── constants/                # Shared frontend constants
│       │   ├── api.js
│       │   └── routes.js
│       ├── hooks/                    # Shared React data hooks
│       │   ├── useProject.js
│       │   ├── useProjects.js
│       │   ├── useTemplate.js
│       │   └── useTemplates.js
│       ├── modules/                  # Feature-level frontend modules
│       │   ├── BannerEditor/
│       │   │   ├── BannerEditor.jsx
│       │   │   ├── BannerEditor.css
│       │   │   ├── components/
│       │   │   │   ├── BackgroundEditor/
│       │   │   │   │   ├── BackgroundEditor.jsx
│       │   │   │   │   └── BackgroundEditor.css
│       │   │   │   ├── BannerPreview/
│       │   │   │   │   ├── BannerPreview.jsx
│       │   │   │   │   └── BannerPreview.css
│       │   │   │   ├── PropertyPanel/
│       │   │   │   │   ├── PropertyPanel.jsx
│       │   │   │   │   └── PropertyPanel.css
│       │   │   │   ├── TextEditor/
│       │   │   │   │   ├── TextEditor.jsx
│       │   │   │   │   └── TextEditor.css
│       │   │   │   └── Toolbar/
│       │   │   │       ├── Toolbar.jsx
│       │   │   │       └── Toolbar.css
│       │   │   ├── context/
│       │   │   │   └── EditorContext.jsx
│       │   │   ├── hooks/
│       │   │   │   └── useAutosave.js
│       │   │   └── services/
│       │   │       ├── bannerBridge.js
│       │   │       └── previewService.js
│       │   ├── Dashboard/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Dashboard.css
│       │   │   └── components/
│       │   │       ├── RecentProjects/
│       │   │       │   ├── RecentProjects.jsx
│       │   │       │   └── RecentProjects.css
│       │   │       ├── RecentTemplates/
│       │   │       │   ├── RecentTemplates.jsx
│       │   │       │   └── RecentTemplates.css
│       │   │       └── StatsCard/
│       │   │           ├── StatsCard.jsx
│       │   │           └── StatsCard.css
│       │   ├── Projects/
│       │   │   └── Projects.jsx
│       │   ├── Settings/
│       │   │   └── Settings.jsx
│       │   └── TemplateLibrary/
│       │       ├── TemplateLibrary.jsx
│       │       ├── TemplateLibrary.css
│       │       └── components/
│       │           ├── SizeSelector/
│       │           │   ├── SizeSelector.jsx
│       │           │   └── SizeSelector.css
│       │           └── TemplateCard/
│       │               ├── TemplateCard.jsx
│       │               └── TemplateCard.css
│  
│       ├── services/                 # API client services
│       │   ├── exportService.js
│       │   ├── projectService.js
│       │   ├── templateService.js
│       │   └── uploadService.js
│       ├── styles/                   # Global styles and design variables
│       │   ├── global.css
│       │   └── variables.css
│       └── utils/
│           └── templateUtils.js
└── server/
    ├── package.json
    ├── package-lock.json
    ├── server.js                    # Backend entry point
    ├── node_modules/                # Installed backend dependencies
    ├── config/                      # Backend path/config helpers
    │   ├── storagePaths.js
    │   └── templatePaths.js
    ├── controllers/                 # Request handlers
    │   ├── exportController.js
    │   ├── previewController.js
    │   ├── projectController.js
    │   ├── templateController.js
    │   └── uploadController.js
    ├── data/
    │   └── projects.json            # Project metadata store
    ├── exports/                     # Generated banner export output
    │   ├── Untitled-Banner-Project-1783319763412/
    │   ├── Untitled-Banner-Project-1783321676484/
    │   └── Untitled-Banner-Project-1783323717195/
    │       ├── Untitled-Banner-Project.zip
    │       └── package/
    │           ├── index.html
    │           ├── config.js
    │           ├── mainbg.jpg
    │           ├── silo.png
    │           ├── cta.png
    │           ├── logo_white.svg
    │           └── ITCCharterCom-Bold.woff2
    ├── middleware/
    │   └── errorHandler.js
    ├── routes/                      # Express route definitions
    │   ├── exportRoutes.js
    │   ├── previewRoutes.js
    │   ├── projectRoutes.js
    │   ├── templateRoutes.js
    │   └── uploadRoutes.js
    ├── services/                    # Backend business logic
    │   ├── exportService.js
    │   ├── imageService.js
    │   ├── previewRuntimeService.js
    │   ├── previewService.js
    │   ├── projectService.js
    │   ├── projectStoreService.js
    │   ├── templateService.js
    │   ├── textService.js
    │   └── zipService.js
    ├── templates/                   # Banner template source files
    │   ├── template.json            # Template index/metadata
    │   ├── 160x600/
    │   ├── 300x250/
    │   ├── 300x600/
    │   ├── 728x90/
    │   └── 970x250/
    │       ├── README.md
    │       ├── env.json
    │       ├── gulpfile.js
    │       ├── package.json
    │       ├── package-lock.json
    │       ├── 970x250.jpg
    │       ├── 970x250.zip
    │       ├── dist/                # Generated template build output
    │       ├── sass/
    │       │   ├── reset.scss
    │       │   └── styles.scss
    │       ├── src/
    │       │   ├── index.html
    │       │   ├── config.js
    │       │   ├── css/
    │       │   │   ├── reset.css
    │       │   │   └── styles.css
    │       │   ├── fonts/
    │       │   │   └── ITCCharterCom-Bold.woff2
    │       │   ├── img/
    │       │   │   ├── cta.png
    │       │   │   ├── logo_white.svg
    │       │   │   ├── mainbg.jpg
    │       │   │   └── silo.png
    │       │   ├── js/
    │       │   │   ├── DrawSVGPlugin.min.js
    │       │   │   ├── banners.js
    │       │   │   ├── dynamic_data.js
    │       │   │   ├── frame_modules.js
    │       │   │   └── index.js
    │       │   └── overlays/
    │       │       ├── 1.jpg
    │       │       ├── 1-1.jpg
    │       │       └── 2.jpg
    │       └── tests/
    │           └── test.js
    ├── uploads/
    │   └── projects/                # Runtime uploaded project assets
    │       └── 133b0cc8-c5a9-4f24-a120-869e9adfa0e2.png
    └── utils/
        └── httpError.js
```

## Template Folder Pattern

Each banner size folder under `server/templates/` follows the same general shape:

```text
server/templates/<size>/
├── README.md
├── env.json
├── gulpfile.js
├── package.json
├── package-lock.json
├── <size>.jpg
├── <size>.zip
├── dist/
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

Available template sizes currently found:

- `160x600`
- `300x250`
- `300x600`
- `728x90`
- `970x250`

## Runtime / Generated Folders

- `client/node_modules/` - frontend dependencies installed by npm.
- `client/dist/` - generated frontend production build.
- `server/node_modules/` - backend dependencies installed by npm.
- `server/templates/*/dist/` - generated build output for individual banner templates.
- `server/templates/*/node_modules/` - template-specific dependencies, present in some template folders.
- `server/exports/` - generated banner export packages and zip files.
- `server/uploads/projects/` - uploaded project assets.

## High-Level Responsibilities

- Frontend pages and feature modules live under `client/src/modules/`.
- Shared frontend UI components live under `client/src/components/`.
- Frontend API wrappers live under `client/src/services/`.
- Backend HTTP routing starts in `server/routes/`.
- Backend request handling lives in `server/controllers/`.
- Backend business logic lives in `server/services/`.
- Banner template source and assets live in `server/templates/`.
- Exported banner packages are written to `server/exports/`.
