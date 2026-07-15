import Button from "../../../../components/Button/Button";
import "./SiloFineAdjustment.css";

const MIN_OFFSET = -50;
const MAX_OFFSET = 50;
const STEP = 0.1;

// Round to 1 decimal place and treat tiny values as zero
const roundToStep = (value) => {
  const rounded = Number(value.toFixed(1));
  return Math.abs(rounded) < 0.05 ? 0 : rounded;
};

// Clamp and round values
const clampOffset = (value) => {
  const number = roundToStep(Number(value) || 0);

  return Math.min(
    MAX_OFFSET,
    Math.max(MIN_OFFSET, number)
  );
};

function SiloFineAdjustment({ onChange, onClose, value }) {
  const offset = {
    x: clampOffset(value?.x),
    y: clampOffset(value?.y),
  };

  const updateOffset = (nextOffset) => {
    onChange({
      x: clampOffset(nextOffset.x),
      y: clampOffset(nextOffset.y),
    });
  };

  const moveSilo = (xDirection, yDirection, event) => {
    const step = event?.shiftKey ? 10 : STEP;

    updateOffset({
      x: roundToStep(offset.x + xDirection * step),
      y: roundToStep(offset.y + yDirection * step),
    });
  };

  return (
    <div
      className="silo-fine-adjustment"
      aria-label="Silo fine adjustment controls"
    >
      <div className="silo-fine-adjustment__header">
        <div>
          <strong>Silo Offset</strong>
          <span>X: {offset.x.toFixed(1)}px</span>
          <span>Y: {offset.y.toFixed(1)}px</span>
        </div>

        {onClose && (
          <Button
            onClick={onClose}
            size="sm"
            type="button"
            variant="ghost"
          >
            Done
          </Button>
        )}
      </div>

      <div className="silo-fine-adjustment__pad">
        <button
          aria-label="Move silo up"
          className="silo-fine-adjustment__button silo-fine-adjustment__button--up"
          disabled={offset.y <= MIN_OFFSET}
          onClick={(event) => moveSilo(0, -1, event)}
          title="Move silo up. Hold Shift for 10px."
          type="button"
        >
          ↑
        </button>

        <button
          aria-label="Move silo left"
          className="silo-fine-adjustment__button silo-fine-adjustment__button--left"
          disabled={offset.x <= MIN_OFFSET}
          onClick={(event) => moveSilo(-1, 0, event)}
          title="Move silo left. Hold Shift for 10px."
          type="button"
        >
          ←
        </button>

        <span
          className="silo-fine-adjustment__center"
          aria-hidden="true"
        />

        <button
          aria-label="Move silo right"
          className="silo-fine-adjustment__button silo-fine-adjustment__button--right"
          disabled={offset.x >= MAX_OFFSET}
          onClick={(event) => moveSilo(1, 0, event)}
          title="Move silo right. Hold Shift for 10px."
          type="button"
        >
          →
        </button>

        <button
          aria-label="Move silo down"
          className="silo-fine-adjustment__button silo-fine-adjustment__button--down"
          disabled={offset.y >= MAX_OFFSET}
          onClick={(event) => moveSilo(0, 1, event)}
          title="Move silo down. Hold Shift for 10px."
          type="button"
        >
          ↓
        </button>
      </div>

      <Button
        onClick={() => updateOffset({ x: 0, y: 0 })}
        size="sm"
        type="button"
        variant="secondary"
      >
        Reset Alignment
      </Button>
    </div>
  );
}

export default SiloFineAdjustment;