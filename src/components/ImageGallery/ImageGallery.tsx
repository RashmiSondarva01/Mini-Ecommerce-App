import { useState } from 'react';
import styles from './ImageGallery.module.scss';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrap}>
        <img src={activeImage} alt={alt} className={styles.mainImage} />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              className={styles.thumbButton}
              data-selected={index === activeIndex || undefined}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={src} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
