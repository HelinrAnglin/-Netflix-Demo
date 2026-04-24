import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieRow.module.css';

const MovieRow = ({ title, items, aspectRatio = '16:9', seeAllLink }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const itemRef = useRef(null);

  const itemsPerView = 5;
  const totalItems = items.length;

  useEffect(() => {
    updateScrollButtons();
  }, [currentIndex]);

  const updateScrollButtons = () => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < Math.ceil(totalItems / itemsPerView) - 1);
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < Math.ceil(totalItems / itemsPerView) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const translateX = -currentIndex * 100;

  return (
    <section className={styles.movieRow}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className={styles.seeAllLink}>
            浏览全部
            <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
        <div className={styles.navButtons}>
          <button
            className={`${styles.navButton} ${styles.navButtonPrev} ${!canScrollLeft ? styles.disabled : ''}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="上一组"
          >
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className={`${styles.navButton} ${styles.navButtonNext} ${!canScrollRight ? styles.disabled : ''}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="下一组"
          >
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.container} ref={containerRef}>
        <div
          className={styles.itemsWrapper}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.item}
              ref={itemRef}
              data-aspect={aspectRatio}
            >
              <Link to={`/anime/${item.id}`} className={styles.itemLink}>
                <div className={styles.placeholderContainer}>
                  <div className={styles.placeholder}>
                    <span className={styles.placeholderText}>{aspectRatio} Poster</span>
                    <div className={styles.placeholderAccent}></div>
                  </div>
                </div>
                <div className={styles.itemOverlay}>
                  <button className={styles.playButton} aria-label={`播放 ${item.title}`}>
                    <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemMeta}>{item.meta}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;