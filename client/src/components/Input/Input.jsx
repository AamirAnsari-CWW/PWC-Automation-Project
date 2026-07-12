import "./Input.css";

function Input({ label, id, className = "", ...props }) {
  return (
    <label className={`input-field ${className}`} htmlFor={id}>
      {label && <span>{label}</span>}
      <input id={id} {...props} />
    </label>
  );
}

export default Input;
