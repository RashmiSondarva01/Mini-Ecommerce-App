import styles from './QuantityPicker.module.scss';

interface QuantityPickerProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export function QuantityPicker({ quantity, maxQuantity, onChange, disabled = false }: QuantityPickerProps) {
  const isDisabled = disabled || maxQuantity <= 0;

  return (
    <div className={styles.picker} data-disabled={isDisabled || undefined}>
      <button
        type="button"
        className={styles.stepButton}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={isDisabled || quantity <= 1}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className={styles.value} aria-live="polite">
        {isDisabled ? 0 : quantity}
      </span>
      <button
        type="button"
        className={styles.stepButton}
        onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={isDisabled || quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
