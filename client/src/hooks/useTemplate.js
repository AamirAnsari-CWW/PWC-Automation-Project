import { useEffect, useState } from "react";

import { getTemplateById } from "../services/templateService";

export const useTemplate = (templateId) => {
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(templateId));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!templateId) {
      return () => {
        isMounted = false;
      };
    }

    const loadTemplate = async () => {
      setIsLoading(true);
      setError("");

      try {
        const templateData = await getTemplateById(templateId);

        if (isMounted) {
          setTemplate(templateData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load template.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTemplate();

    return () => {
      isMounted = false;
    };
  }, [templateId]);

  return { template, isLoading, error };
};
