/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from "react";

import { buildBackendUrl } from "../services/previewService";

const EditorContext = createContext(null);

const toPreviewImageUrls = (images = {}) => {
  // Projects store backend-relative image URLs. The preview/editor needs full
  // browser URLs so iframe messages and image dimension checks can load them.
  return Object.fromEntries(
    Object.entries(images).map(([key, value]) => [key, value.startsWith("blob:") ? value : buildBackendUrl(value)])
  );
};

const DEFAULT_ADJUSTMENT = { x: 0, y: 0, scale: 1, rotation: 0, visible: true };
const DEFAULT_SILO_OFFSET = { x: 0, y: 0 };

const normalizeAdjustment = (adjustment = DEFAULT_ADJUSTMENT) => ({
  ...DEFAULT_ADJUSTMENT,
  ...adjustment,
});

// Initial editor state is built from two sources:
// 1. template defaults discovered from the banner source files;
// 2. saved project data from server/data/projects.json when editing a project.
const createInitialState = ({ project, templateBackgroundDefaults } = {}) => ({
  background: normalizeAdjustment(templateBackgroundDefaults?.final),
  compositionTransform: normalizeAdjustment(templateBackgroundDefaults?.final),
  frame1BackgroundTransform: normalizeAdjustment(templateBackgroundDefaults?.frame1),
  hiddenImages: {},
  imageAdjustments: {},
  images: {},
  imagePreviewUrls: {},
  isDirty: false,
  projectId: project?.id || null,
  projectName: project?.name || "Untitled Banner Project",
  saveStatus: "idle",
  shapeAdjustments: {},
  siloOffset: DEFAULT_SILO_OFFSET,
  texts: {},
  ...(project
    ? {
        background: normalizeAdjustment(project.compositionTransform || project.background || templateBackgroundDefaults?.final),
        compositionTransform: normalizeAdjustment(project.compositionTransform || project.background || templateBackgroundDefaults?.final),
        frame1BackgroundTransform: normalizeAdjustment(
          project.frame1BackgroundTransform || templateBackgroundDefaults?.frame1
        ),
        hiddenImages: project.hiddenImages || {},
        imageAdjustments: project.imageAdjustments || {},
        images: project.images || {},
        imagePreviewUrls: toPreviewImageUrls(project.images),
        saveStatus: "saved",
        shapeAdjustments: project.shapeAdjustments || {},
        siloOffset: project.siloOffset || DEFAULT_SILO_OFFSET,
        texts: project.texts || {},
      }
    : {}),
});

const editorReducer = (state, action) => {
  // Each action updates the local editor state and marks it dirty when the
  // change should be saved/exported. Add new feature state here, then include it
  // in BannerEditor's projectPayload and backend normalization.
  if (action.type === "SET_TEXT") {
    return {
      ...state,
      isDirty: true,
      texts: {
        ...state.texts,
        [action.payload.field]: action.payload.value,
      },
    };
  }

  if (action.type === "SET_IMAGE") {
    return {
      ...state,
      images: {
        ...state.images,
        [action.payload.imageName]: action.payload.serverUrl,
      },
      imagePreviewUrls: {
        ...state.imagePreviewUrls,
        [action.payload.imageName]: action.payload.previewUrl,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_BACKGROUND") {
    return {
      ...state,
      background: action.payload,
      compositionTransform: action.payload,
      imageAdjustments: {
        ...state.imageAdjustments,
        "mainbg.jpg": action.payload,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_COMPOSITION_TRANSFORM") {
    return {
      ...state,
      background: action.payload,
      compositionTransform: action.payload,
      imageAdjustments: {
        ...state.imageAdjustments,
        "mainbg.jpg": action.payload,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_FRAME1_BACKGROUND_TRANSFORM") {
    return {
      ...state,
      frame1BackgroundTransform: action.payload,
      isDirty: true,
    };
  }

  if (action.type === "SET_IMAGE_ADJUSTMENT") {
    const nextAdjustment = action.payload.adjustment;

    return {
      ...state,
      background: action.payload.imageName === "mainbg.jpg" ? nextAdjustment : state.background,
      imageAdjustments: {
        ...state.imageAdjustments,
        [action.payload.imageName]: nextAdjustment,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_IMAGE_VISIBILITY") {
    return {
      ...state,
      hiddenImages: {
        ...state.hiddenImages,
        [action.payload.imageName]: !action.payload.isVisible,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_SHAPE_ADJUSTMENT") {
    return {
      ...state,
      shapeAdjustments: {
        ...state.shapeAdjustments,
        [action.payload.shapeName]: action.payload.adjustment,
      },
      isDirty: true,
    };
  }

  if (action.type === "SET_SILO_OFFSET") {
    return {
      ...state,
      siloOffset: action.payload,
      isDirty: true,
    };
  }

  if (action.type === "SET_SAVE_STATUS") {
    return {
      ...state,
      saveStatus: action.payload,
    };
  }

  if (action.type === "MARK_SAVED") {
    return {
      ...state,
      isDirty: false,
      projectId: action.payload.id,
      projectName: action.payload.name,
      saveStatus: "saved",
    };
  }

  if (action.type === "LOAD_PROJECT") {
    return {
      ...createInitialState(),
      ...action.payload,
      frame1BackgroundTransform: normalizeAdjustment(action.payload.frame1BackgroundTransform),
      imagePreviewUrls: action.payload.images || {},
      isDirty: false,
      saveStatus: "saved",
    };
  }

  return state;
};

export function EditorProvider({ children, project, templateBackgroundDefaults }) {
  const [state, dispatch] = useReducer(editorReducer, { project, templateBackgroundDefaults }, createInitialState);

  const value = useMemo(() => ({ dispatch, state }), [state]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export const useEditor = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor must be used inside EditorProvider.");
  }

  return context;
};
