import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import "./BackgroundEditor.css";

function BackgroundEditor({
  description,
  imageName,
  onChange,
  onClose,
  showRotation = false,
  showVisibility = false,
  title = "Image Frame Controls",
  value,
}) {
  const handleChange = (key, nextValue) => {
    onChange({
      ...value,
      [key]: Number(nextValue),
    });
  };

  const handleVisibilityChange = () => {
    onChange({
      ...value,
      visible: value.visible === false,
    });
  };

  return (
    <section className="background-editor">
      <div className="background-editor__header">
        <div>
          <h2>{title}</h2>
          <p>{description || `${imageName} crop, scale, and frame position`}</p>
        </div>
        <Button onClick={onClose} size="sm" type="button" variant="ghost">
          Done
        </Button>
      </div>
      <div className="background-editor__grid">
        <Input
          id="background-x"
          label="X Position"
          onChange={(event) => handleChange("x", event.target.value)}
          type="number"
          value={value.x}
        />
        <Input
          id="background-y"
          label="Y Position"
          onChange={(event) => handleChange("y", event.target.value)}
          type="number"
          value={value.y}
        />
        <Input
          id="background-scale"
          label="Scale"
          onChange={(event) => handleChange("scale", event.target.value)}
          step="0.1"
          type="number"
          value={value.scale}
        />
        {showRotation && (
          <Input
            id="background-rotation"
            label="Rotation"
            onChange={(event) => handleChange("rotation", event.target.value)}
            type="number"
            value={value.rotation || 0}
          />
        )}
      </div>
      {showVisibility && (
        <Button onClick={handleVisibilityChange} size="sm" type="button" variant="secondary">
          {value.visible === false ? "Show" : "Hide"}
        </Button>
      )}
    </section>
  );
}

export default BackgroundEditor;
