import { parseBannerSize } from "../../../../utils/templateUtils";
import "./SizeSelector.css";

function SizeSelector({ availableSizes, selectedSize, onChange }) {
  return (
    <div className="size-selector">
      {availableSizes.map((sizeId) => {
        const size = parseBannerSize(sizeId);

        return (
          <button
            className={selectedSize === size.id ? "size-selector__option is-active" : "size-selector__option"}
            key={size.id}
            onClick={() => onChange(size.id)}
            type="button"
          >
            <strong>{size.id}</strong>
            <span>{size.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SizeSelector;
