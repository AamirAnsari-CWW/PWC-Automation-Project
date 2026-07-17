# PWC Banner Automation Frontend

This is the React + Vite frontend for the banner automation workspace. It provides the dashboard, template library, project list, and banner editor UI.

## Setup

```bash
npm install
npm run dev
```

The frontend calls the backend at `VITE_API_BASE_URL`. If the variable is not set, it uses `http://localhost:5001/api`.

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Create production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Key Areas

- `src/modules/Dashboard/` - landing workspace with template/project summaries.
- `src/modules/TemplateLibrary/` - template and size selection.
- `src/modules/BannerEditor/` - main editing experience, preview bridge, and editor state.
- `src/components/` - shared UI primitives.
- `src/services/` - API wrappers used by hooks and modules.
- `src/hooks/` - reusable project/template data loaders.
