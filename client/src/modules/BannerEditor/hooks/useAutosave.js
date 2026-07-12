import { useEffect } from "react";

import { createProject, updateProject } from "../../../services/projectService";

export const useAutosave = ({ dispatch, payload, projectId, shouldSave }) => {
  useEffect(() => {
    if (!shouldSave) {
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      dispatch({ type: "SET_SAVE_STATUS", payload: "saving" });

      try {
        const project = projectId
          ? await updateProject(projectId, payload)
          : await createProject(payload);

        dispatch({ type: "MARK_SAVED", payload: project });
      } catch {
        dispatch({ type: "SET_SAVE_STATUS", payload: "failed" });
      }
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, payload, projectId, shouldSave]);
};
