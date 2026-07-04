import type { SizeOption } from '../../types';
import styles from './VariantSelector.module.scss';

interface SizeButtonsProps {
  sizes: SizeOption[];
  selected: string;
  onSelect: (size: string) => void;
}

const STATUS_LABEL: Record<SizeOption['status'], string> = {
  'in-stock': '',
  'low-stock': 'Low stock',
  'sold-out': 'Sold out',
};

export function SizeButtons({ sizes, selected, onSelect }: SizeButtonsProps) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>Size</span>
      <div className={styles.sizeRow} role="radiogroup" aria-label="Size">
        {sizes.map((size) => {
          const soldOut = size.status === 'sold-out';
          return (
            <button
              key={size.label}
              type="button"
              role="radio"
              aria-checked={size.label === selected}
              className={styles.sizeButton}
              data-selected={size.label === selected || undefined}
              data-status={size.status}
              disabled={soldOut}
              onClick={() => onSelect(size.label)}
              title={STATUS_LABEL[size.status] || undefined}
            >
              <span>{size.label}</span>
              {STATUS_LABEL[size.status] && <span className={styles.sizeStatus}>{STATUS_LABEL[size.status]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
