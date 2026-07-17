import { useEffect, useState } from "react";

import { getProjectById } from "../services/projectService";

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!projectId) {
      return () => {
        isMounted = false;
      };
    }

    // Source: query string project id -> GET /api/projects/:id -> saved editor
    // state that is passed into EditorProvider.
    const loadProject = async () => {
      setIsLoading(true);
      setError("");

      try {
        const projectData = await getProjectById(projectId);

        if (isMounted) {
          setProject(projectData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load project.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { error, isLoading, project };
};
