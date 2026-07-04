import type { ColorOption } from '../../types';
import styles from './VariantSelector.module.scss';

interface ColorSwatchesProps {
  colors: ColorOption[];
  selected: string;
  onSelect: (colorName: string) => void;
}

export function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>Colour: {selected}</span>
      <div className={styles.swatchRow} role="radiogroup" aria-label="Colour">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={color.name === selected}
            aria-label={color.name}
            title={color.name}
            className={styles.swatch}
            data-selected={color.name === selected || undefined}
            style={{ backgroundColor: color.hex }}
            onClick={() => onSelect(color.name)}
          />
        ))}
      </div>
    </div>
  );
}
