import { useEffect, useState } from "react";

import { getTemplates } from "../services/templateService";

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Source: client service -> GET /api/templates -> backend scans server/templates/.
    // Consumers get UI-ready metadata such as supportedSizes and sizeDetails.
    const loadTemplates = async () => {
      try {
        const templateList = await getTemplates();

        if (isMounted) {
          setTemplates(templateList);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load templates.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  return { templates, isLoading, error };
};
