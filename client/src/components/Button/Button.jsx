import "./Button.css";

function Button({ children, className = "", size = "md", variant = "primary", ...props }) {
  return (
    <button className={`button button--${variant} button--${size} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
