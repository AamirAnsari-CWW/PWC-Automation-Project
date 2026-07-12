import Input from "../../../../components/Input/Input";
import "./TextEditor.css";

const fieldLabels = {
  d2: "Upper Text - 1",
  d3: "Upper Text - 2",
  d5: "Lower Text -1",
  d7: "Lower Text -2",
  d190: "bottom disclaimer",
};

function TextEditor({ fields, onChange, values }) {
  return (
    <section className="text-editor">
      <h2>Editable Text</h2>
      <div className="text-editor__fields">
        {fields.map((field) => (
          <Input
            id={`text-${field}`}
            key={field}
            label={fieldLabels[field] || field}
            onChange={(event) => onChange(field, event.target.value)}
            placeholder={`Enter ${fieldLabels[field] || field}`}
            type="text"
            value={values[field] || ""}
          />
        ))}
      </div>
    </section>
  );
}

export default TextEditor;