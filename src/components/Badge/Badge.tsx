import styles from './Badge.module.scss';

interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span className={styles.badge} aria-label={`${count} items in cart`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
