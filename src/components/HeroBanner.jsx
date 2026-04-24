import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    api.getHome()
      .then((data) => {
        if (data.heroBanner && data.heroBanner.length > 0) {
          setSlides(data.heroBanner);
        }
      })
      .catch((err) => console.error('Failed to load banners:', err));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [nextSlide, isPaused, slides.length]);

  if (slides.length === 0) {
    return <section className={styles.heroBanner}></section>;
  }

  const current = slides[currentSlide];

  return (
    <section
      className={styles.heroBanner}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.slidesContainer}>
        <div
          className={styles.slidesWrapper}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className={styles.slide}>
              <div className={styles.placeholderContainer}>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderContent}>
                    <span className={styles.placeholderText}>{slide.placeholderAspect} Banner</span>
                    <div className={styles.placeholderAccent}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contentOverlay}>
        <div className={styles.container}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>{current.title}</h1>
            <p className={styles.description}>{current.description}</p>
            <div className={styles.buttons}>
              <button className={styles.playButton}>
                <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                立即播放
              </button>
              <button className={styles.moreInfoButton}>
                <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                更多信息
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className={styles.navButtonPrev}
        onClick={prevSlide}
        aria-label="上一张"
      >
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className={styles.navButtonNext}
        onClick={nextSlide}
        aria-label="下一张"
      >
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>

      <div className={styles.gradientOverlay}></div>
    </section>
  );
};

export default HeroBanner;