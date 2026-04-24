import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './Watch.module.css';

const Watch = () => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [userList, setUserList] = useState([]);
  const [inDefaultList, setInDefaultList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [related, setRelated] = useState([]);

  const { animeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const modalRef = useRef(null);

  // Fetch anime data
  useEffect(() => {
    setLoading(true);
    setError('');
    api.getAnime(animeId)
      .then((data) => {
        setAnime(data);
        setLikeCount(Math.floor(Math.random() * 500) + 50);
      })
      .catch((err) => setError(err.message || '获取信息失败'))
      .finally(() => setLoading(false));
  }, [animeId]);

  // Fetch related recommendations
  useEffect(() => {
    api.getAnimeSeries(1, 8)
      .then((data) => setRelated(data.data || []))
      .catch(() => {});
  }, []);

  // Fetch user list when modal opens
  useEffect(() => {
    if (!showModal || !user) return;
    api.getUserList()
      .then((data) => {
        const list = data.data || [];
        setUserList(list);
        setInDefaultList(list.some((item) => item.id === Number(animeId)));
      })
      .catch(() => {});
  }, [showModal, user, animeId]);

  // Close modal on outside click
  useEffect(() => {
    if (!showModal) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModal]);

  const episodes = anime?.episodes || [];
  const currentEpNumber = Number(searchParams.get('ep')) || 1;
  const currentEp = episodes.find((ep) => ep.episode_number === currentEpNumber) || episodes[0] || null;

  // Redirect invalid ep to 1
  useEffect(() => {
    if (episodes.length > 0 && !episodes.some((ep) => ep.episode_number === currentEpNumber)) {
      setSearchParams({ ep: 1 }, { replace: true });
    }
  }, [episodes, currentEpNumber, setSearchParams]);

  const handleEpisodeChange = (epNumber) => {
    setSearchParams({ ep: epNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    setDisliked((d) => !d);
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  const handleAddToList = () => {
    if (inDefaultList) return;
    api.addToList(animeId)
      .then(() => {
        setInDefaultList(true);
        setUserList((prev) => [...prev, { id: Number(animeId), title: anime?.title }]);
      })
      .catch(() => {});
  };

  const handleRemoveFromList = () => {
    api.removeFromList(animeId)
      .then(() => {
        setInDefaultList(false);
        setUserList((prev) => prev.filter((item) => item.id !== Number(animeId)));
      })
      .catch(() => {});
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    // For now, add to default list and show feedback
    handleAddToList();
    setNewListName('');
  };

  const hasPrev = currentEpNumber > 1;
  const hasNext = currentEpNumber < episodes.length;

  const getInitial = (name) => (name || 'U').charAt(0).toUpperCase();

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.watchPage}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>正在加载...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.watchPage}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.backButton} onClick={() => navigate(-1)}>返回</button>
        </div>
      </div>
    );
  }

  if (!anime) return null;

  return (
    <div className={styles.watchPage}>
      <div className={styles.watchContainer}>
        <div className={styles.playerLayout}>
          {/* ===== Left: Player Section ===== */}
          <div className={styles.playerSection}>
            {/* Video Player */}
            <div className={styles.playerWrapper}>
              <div className={styles.videoPlayer}>
                {currentEp?.video_url ? (
                  <video
                    key={currentEp.id}
                    className={styles.videoElement}
                    src={currentEp.video_url}
                    controls
                    autoPlay
                  >
                    您的浏览器不支持视频播放
                  </video>
                ) : (
                  <div className={styles.placeholderContainer}>
                    <div className={styles.placeholderGradient}></div>
                    <button className={styles.playButtonOverlay} aria-label="播放">
                      <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                    <span className={styles.placeholderText}>视频加载中</span>
                  </div>
                )}
              </div>
            </div>

            {/* Episode Navigation */}
            <div className={styles.episodeNav}>
              <button
                className={`${styles.navButton} ${!hasPrev ? styles.navButtonDisabled : ''}`}
                disabled={!hasPrev}
                onClick={() => handleEpisodeChange(currentEpNumber - 1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                上一集
              </button>
              <span className={styles.navEpisodeInfo}>
                {currentEp ? `第 ${currentEp.episode_number} 集` : ''}
              </span>
              <button
                className={`${styles.navButton} ${!hasNext ? styles.navButtonDisabled : ''}`}
                disabled={!hasNext}
                onClick={() => handleEpisodeChange(currentEpNumber + 1)}
              >
                下一集
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Action Bar: Like / Dislike / Add */}
            <div className={styles.actionBar}>
              <button
                className={`${styles.actionBtn} ${liked ? styles.actionBtnActive : ''}`}
                onClick={handleLike}
                aria-label="赞"
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              <button
                className={`${styles.actionBtn} ${disliked ? styles.actionBtnActive : ''}`}
                onClick={handleDislike}
                aria-label="踩"
              >
                <svg viewBox="0 0 24 24" fill={disliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                </svg>
              </button>

              <div className={styles.actionSeparator}></div>

              <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                添加
              </button>
            </div>

            {/* Anime Info */}
            <div className={styles.animeInfo}>
              <h1 className={styles.animeTitle}>{anime.title}</h1>
              <div className={styles.animeMeta}>
                <span>{anime.type === 'series' ? 'TV动画' : '剧场版'}</span>
                <span className={styles.metaDot}>·</span>
                <span>{anime.status === 'ongoing' ? '连载中' : anime.status === 'completed' ? '已完结' : '即将上映'}</span>
                <span className={styles.metaDot}>·</span>
                <span>{(anime.views || 0).toLocaleString()} 次播放</span>
              </div>
              {anime.synopsis && <p className={styles.animeSynopsis}>{anime.synopsis}</p>}
            </div>
          </div>

          {/* ===== Right: Episode Sidebar ===== */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>剧集列表</h3>
              <span className={styles.episodeCount}>{episodes.length} 集</span>
            </div>
            <div className={styles.episodeList}>
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  className={`${styles.episodeItem} ${ep.episode_number === currentEpNumber ? styles.episodeItemActive : ''}`}
                  onClick={() => handleEpisodeChange(ep.episode_number)}
                >
                  <div className={styles.episodeNumber}>
                    {String(ep.episode_number).padStart(2, '0')}
                  </div>
                  <div className={styles.episodeInfo}>
                    <span className={styles.episodeTitle}>{ep.title || `第 ${ep.episode_number} 集`}</span>
                    {ep.duration && <span className={styles.episodeDuration}>{formatDuration(ep.duration)}</span>}
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>

        {/* ===== Comments Section ===== */}
        <div className={styles.commentsSection}>
          <button className={styles.commentsToggle} onClick={() => setShowComments(!showComments)}>
            <span className={styles.commentsToggleLeft}>
              <svg
                className={`${styles.commentsToggleIcon} ${showComments ? styles.commentsToggleIconOpen : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              评论区
              <span className={styles.commentsCount}>3</span>
            </span>
          </button>
          <div className={`${styles.commentsBody} ${showComments ? styles.commentsBodyOpen : ''}`}>
            <div className={styles.commentInputWrapper}>
              {user ? (
                <>
                  <div className={styles.commentAvatar}>{getInitial(user.nickname || user.email)}</div>
                  <input
                    className={styles.commentInput}
                    type="text"
                    placeholder="发表你的评论..."
                  />
                </>
              ) : (
                <input
                  className={styles.commentInput}
                  type="text"
                  placeholder="登录后发表评论..."
                  readOnly
                  onClick={() => navigate('/login')}
                />
              )}
            </div>
            <div className={styles.commentList}>
              <div className={styles.commentItem}>
                <div className={styles.commentUserAvatar}>M</div>
                <div className={styles.commentBody}>
                  <div className={styles.commentUser}>漫迷小王</div>
                  <p className={styles.commentText}>这一集的打斗场面太精彩了！作画质量满分！</p>
                  <div className={styles.commentTime}>2天前</div>
                </div>
              </div>
              <div className={styles.commentItem}>
                <div className={styles.commentUserAvatar}>L</div>
                <div className={styles.commentBody}>
                  <div className={styles.commentUser}>动漫达人</div>
                  <p className={styles.commentText}>剧情越来越吸引人了，期待下一集更新！</p>
                  <div className={styles.commentTime}>5天前</div>
                </div>
              </div>
              <div className={styles.commentItem}>
                <div className={styles.commentUserAvatar}>Z</div>
                <div className={styles.commentBody}>
                  <div className={styles.commentUser}>追番小能手</div>
                  <p className={styles.commentText}>三刷了，每次看都有不一样的感受，神作。</p>
                  <div className={styles.commentTime}>1周前</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Related Section ===== */}
        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>相关推荐</h3>
            <div className={styles.relatedGrid}>
              {related.slice(0, 8).map((item) => (
                <Link
                  key={item.id}
                  to={`/watch/${item.id}`}
                  className={styles.relatedCard}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className={styles.relatedCardPlaceholder}>
                    <svg className={styles.playIconSmall} viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== Add to Collection Modal ===== */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>添加到收藏</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {user ? (
              <>
                <div className={styles.modalBody}>
                  <div
                    className={`${styles.collectionItem} ${inDefaultList ? styles.collectionItemActive : ''}`}
                    onClick={inDefaultList ? handleRemoveFromList : handleAddToList}
                  >
                    <div className={styles.collectionCheckbox}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className={styles.collectionName}>默认收藏列表</span>
                    <span className={styles.collectionCount}>{userList.length} 部</span>
                  </div>
                </div>
                <div className={styles.newCollectionSection}>
                  <input
                    className={styles.newCollectionInput}
                    type="text"
                    placeholder="新建收藏列表..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                  />
                  <button className={styles.newCollectionBtn} onClick={handleCreateList}>
                    新建
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.modalLoginHint}>
                <p>请先登录后使用收藏功能</p>
                <button className={styles.backButton} onClick={() => { setShowModal(false); navigate('/login'); }} style={{ marginTop: 16 }}>
                  去登录
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
