import { useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";
import { ROUTES } from "../../constants/routes";
import { useProject } from "../../hooks/useProject";
import { useTemplate } from "../../hooks/useTemplate";
import { createProject, updateProject } from "../../services/projectService";
import { uploadProjectImage } from "../../services/uploadService";
import { exportBannerPackage } from "../../services/exportService";
import { findBannerSizeById, getTemplateDefaultSize } from "../../utils/templateUtils";
import BannerPreview from "./components/BannerPreview/BannerPreview";
import PropertyPanel from "./components/PropertyPanel/PropertyPanel";
import Toolbar from "./components/Toolbar/Toolbar";
import { EditorProvider, useEditor } from "./context/EditorContext";
import { useAutosave } from "./hooks/useAutosave";
import { buildBackendUrl } from "./services/previewService";
import { getFitImageTransform } from "./utils/imageTransform";
import "./BannerEditor.css";

const MAIN_BACKGROUND_NAME = "mainbg.jpg";
const SILO_IMAGE_NAME = "silo.png";

// Used after uploads so the editor can initialize scale/position from the real
// asset dimensions rather than guessing from the file name or banner size.
const loadImageDimensions = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve({ height: image.naturalHeight, width: image.naturalWidth });
    image.onerror = reject;
    image.src = src;
  });

function BannerEditor() {
  const { size, templateId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const projectState = useProject(projectId);
  const { error, isLoading, template } = useTemplate(templateId);

  if (!templateId) {
    return <Navigate replace to={ROUTES.templates} />;
  }

  if (isLoading || projectState.isLoading) {
    return (
      <Layout>
        <Loader label="Loading real banner template" />
      </Layout>
    );
  }

  if (error || projectState.error || !template) {
    return <Navigate replace to={ROUTES.templates} />;
  }

  const bannerSize = findBannerSizeById(template, size) || getTemplateDefaultSize(template);

  return (
    <Layout>
      {/* Keying the provider resets editor state when switching template, size, or loaded project. */}
      <EditorProvider
        key={`${template.id}-${bannerSize.id}-${projectId || "new"}`}
        project={projectState.project}
        templateBackgroundDefaults={bannerSize.backgroundDefaults}
      >
        <BannerEditorWorkspace bannerSize={bannerSize} template={template} />
      </EditorProvider>
    </Layout>
  );
}

function BannerEditorWorkspace({ bannerSize, template }) {
  const { dispatch, state } = useEditor();
  const [isImageAdjustmentMode, setIsImageAdjustmentMode] = useState(false);
  const [backgroundAdjustmentMode, setBackgroundAdjustmentMode] = useState("final");
  const [isSiloFineAdjustmentMode, setIsSiloFineAdjustmentMode] = useState(false);
  const [selectedEditableImage, setSelectedEditableImage] = useState(null);
  const editableTexts = bannerSize.editableTexts || template.editableTexts;
  const bannerOrientation =
    bannerSize.height > bannerSize.width ? "portrait" : bannerSize.width > bannerSize.height ? "landscape" : "square";

  // This is the canonical save/export shape shared by autosave, manual save,
  // and backend export generation. Add new editable fields here first.
  const projectPayload = useMemo(
    () => ({
      background: state.background,
      compositionTransform: state.compositionTransform,
      frame1BackgroundTransform: state.frame1BackgroundTransform,
      hiddenImages: state.hiddenImages,
      imageAdjustments: state.imageAdjustments,
      images: state.images,
      name: state.projectName,
      shapeAdjustments: state.shapeAdjustments,
      shapeDefinitions: template.shapeDefinitions || {},
      size: bannerSize.id,
      siloOffset: state.siloOffset,
      templateId: template.id,
      templateName: template.name,
      texts: state.texts,
    }),
    [
      bannerSize.id,
      state.background,
      state.compositionTransform,
      state.frame1BackgroundTransform,
      state.hiddenImages,
      state.imageAdjustments,
      state.images,
      state.projectName,
      state.shapeAdjustments,
      state.siloOffset,
      state.texts,
      template.id,
      template.name,
      template.shapeDefinitions,
    ]
  );

  useAutosave({
    dispatch,
    payload: projectPayload,
    projectId: state.projectId,
    shouldSave: state.isDirty,
  });

  const handleTextChange = (field, value) => {
    dispatch({ type: "SET_TEXT", payload: { field, value } });
  };

  const handleImageChange = async (imageName, file) => {
    if (!file) {
      return;
    }

    const uploadedImage = await uploadProjectImage(file);
    const previewUrl = buildBackendUrl(uploadedImage.publicUrl);

    dispatch({
      type: "SET_IMAGE",
      payload: {
        imageName,
        previewUrl,
        serverUrl: uploadedImage.publicUrl,
      },
    });

    // Background and silo are adjusted as one composition layer so the original
    // animation can stay locked while the uploaded artwork is repositioned.
    if (imageName === MAIN_BACKGROUND_NAME) {
      const imageSize = await loadImageDimensions(previewUrl);
      const transform = getFitImageTransform({
        bannerHeight: bannerSize.height,
        bannerWidth: bannerSize.width,
        imageHeight: imageSize.height,
        imageWidth: imageSize.width,
      });

      dispatch({
        type: "SET_BACKGROUND",
        payload: transform,
      });
      return;
    }

    // Other editable images keep their own transform so the preview runtime can
    // patch only that DOM layer inside the static banner template.
    if ((template.editableImages || []).includes(imageName) && imageName !== SILO_IMAGE_NAME) {
      const imageSize = await loadImageDimensions(previewUrl);

      dispatch({
        type: "SET_IMAGE_ADJUSTMENT",
        payload: {
          imageName,
          adjustment: getFitImageTransform({
            bannerHeight: bannerSize.height,
            bannerWidth: bannerSize.width,
            imageHeight: imageSize.height,
            imageWidth: imageSize.width,
          }),
        },
      });
    }
  };

  const handleSave = async () => {
    dispatch({ type: "SET_SAVE_STATUS", payload: "saving" });

    try {
      const project = state.projectId
        ? await updateProject(state.projectId, projectPayload)
        : await createProject(projectPayload);

      dispatch({ type: "MARK_SAVED", payload: project });
    } catch {
      dispatch({ type: "SET_SAVE_STATUS", payload: "failed" });
    }
  };

  const handleExport = async () => {
    await exportBannerPackage(projectPayload);
  };

  return (
    <div className="banner-editor">
      <Toolbar
        onExport={handleExport}
        onSave={handleSave}
        saveStatus={state.saveStatus}
        sizeLabel={bannerSize.id}
        templateName={template.name}
      />
      <div className={`banner-editor__workspace banner-editor__workspace--${bannerOrientation}`}>
        <PropertyPanel
          backgroundAdjustmentMode={backgroundAdjustmentMode}
          backgroundState={state.compositionTransform}
          frame1BackgroundState={state.frame1BackgroundTransform}
          hiddenImages={state.hiddenImages}
          imageValues={state.imagePreviewUrls}
          imageAdjustments={state.imageAdjustments}
          isImageAdjustmentMode={isImageAdjustmentMode}
          onBackgroundChange={(background) => dispatch({ type: "SET_COMPOSITION_TRANSFORM", payload: background })}
          onFrame1BackgroundChange={(background) =>
            dispatch({ type: "SET_FRAME1_BACKGROUND_TRANSFORM", payload: background })
          }
          onImageAdjustmentChange={(imageName, adjustment) =>
            dispatch({ type: "SET_IMAGE_ADJUSTMENT", payload: { imageName, adjustment } })
          }
          onImageChange={handleImageChange}
          onImageAdjustmentModeStart={() => {
            setBackgroundAdjustmentMode("final");
            setIsSiloFineAdjustmentMode(false);
            setIsImageAdjustmentMode(true);
            setSelectedEditableImage(MAIN_BACKGROUND_NAME);
          }}
          onFrame1BackgroundAdjustmentModeStart={() => {
            setBackgroundAdjustmentMode("frame1");
            setIsSiloFineAdjustmentMode(false);
            setIsImageAdjustmentMode(true);
            setSelectedEditableImage(MAIN_BACKGROUND_NAME);
          }}
          onShapeAdjustmentChange={(shapeName, adjustment) =>
            dispatch({ type: "SET_SHAPE_ADJUSTMENT", payload: { shapeName, adjustment } })
          }
          onSiloFineAdjustmentModeStart={() => {
            setIsImageAdjustmentMode(false);
            setIsSiloFineAdjustmentMode(true);
          }}
          onTextChange={handleTextChange}
          shapeAdjustments={state.shapeAdjustments}
          template={{ ...template, editableTexts }}
          textValues={state.texts}
        />
        <BannerPreview
          backgroundState={backgroundAdjustmentMode === "frame1" ? state.frame1BackgroundTransform : state.compositionTransform}
          hiddenImages={state.hiddenImages}
          imageAdjustments={state.imageAdjustments}
          imageValues={state.imagePreviewUrls}
          isImageAdjustmentMode={isImageAdjustmentMode}
          isSiloFineAdjustmentMode={isSiloFineAdjustmentMode}
          onBackgroundChange={(background) =>
            dispatch({
              type:
                backgroundAdjustmentMode === "frame1"
                  ? "SET_FRAME1_BACKGROUND_TRANSFORM"
                  : "SET_COMPOSITION_TRANSFORM",
              payload: background,
            })
          }
          onImageAdjustmentCancel={() => setIsImageAdjustmentMode(false)}
          onImageAdjustmentDone={() => setIsImageAdjustmentMode(false)}
          onImageAdjustmentChange={(imageName, adjustment) =>
            dispatch({ type: "SET_IMAGE_ADJUSTMENT", payload: { imageName, adjustment } })
          }
          onSelectedImageChange={setSelectedEditableImage}
          onSiloFineAdjustmentDone={() => setIsSiloFineAdjustmentMode(false)}
          onSiloOffsetChange={(siloOffset) => dispatch({ type: "SET_SILO_OFFSET", payload: siloOffset })}
          selectedImageName={selectedEditableImage}
          shapeAdjustments={state.shapeAdjustments}
          shapeDefinitions={template.shapeDefinitions || {}}
          size={bannerSize}
          siloOffset={state.siloOffset}
          template={template}
          textValues={state.texts}
        />
      </div>
      {/* <section className="banner-editor__timeline">
        <strong>Timeline</strong>
        <span>Future GSAP timeline inspector will appear here.</span>
      </section> */}
    </div>
  );
}

export default BannerEditor;
