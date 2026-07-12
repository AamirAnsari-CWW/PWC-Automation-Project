export const ROUTES = Object.freeze({
  dashboard: "/",
  templates: "/templates",
  editor: "/editor/:templateId?/:size?",
  projects: "/projects",
  exports: "/exports",
  settings: "/settings",
});

export const routeToEditor = (templateId, size) => {
  const encodedTemplateId = encodeURIComponent(templateId);
  const encodedSize = encodeURIComponent(size);

  return `/editor/${encodedTemplateId}/${encodedSize}`;
};
