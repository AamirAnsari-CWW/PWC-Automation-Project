import { useEffect, useState } from "react";

import { getProjects } from "../services/projectService";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Source: client service -> GET /api/projects -> server/data/projects.json.
    // This powers Dashboard counts and the saved Projects view.
    const loadProjects = async () => {
      try {
        const projectList = await getProjects();

        if (isMounted) {
          setProjects(projectList);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load projects.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { error, isLoading, projects };
};
