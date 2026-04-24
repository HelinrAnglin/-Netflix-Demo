import { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './ListPage.module.css';

const RecentlyAdded = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    api.getRecentlyAdded(page, limit)
      .then((data) => {
        setItems(data.data || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch((err) => console.error('Failed to load:', err))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.listPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>最新上传</h1>
        <p className={styles.subtitle}>最近添加的动漫剧集和电影</p>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <>
            <div className={styles.grid}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={styles.gridItem}
                  data-aspect={item.aspectRatio}
                >
                  <div className={styles.placeholderContainer}>
                    <div className={styles.placeholder}>
                      <span className={styles.placeholderText}>{item.aspectRatio} Poster</span>
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
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </button>
              <span className={styles.pageInfo}>
                第 {page} / {totalPages} 页（共 {total} 部）
              </span>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.footerInfo}>
        <p>共 {total} 部作品</p>
      </div>
    </div>
  );
};

export default RecentlyAdded;