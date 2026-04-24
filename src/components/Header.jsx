import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: '首页', exact: true },
    { path: '/latest-releases', label: '最新发布' },
    { path: '/recently-added', label: '最新上传' },
    { path: '/anime-series', label: '番剧专区' },
    { path: '/trending', label: '他们在看' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getInitial = () => {
    if (user?.nickname) return user.nickname.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getJoinDateText = () => {
    if (!user?.created_at) return '';
    const date = new Date(user.created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    if (diffYears >= 1) return `${diffYears}年前加入`;
    if (diffMonths >= 1) return `${diffMonths}个月前加入`;
    return '本月加入';
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>ANIME</span>
            <span className={styles.logoDot}>.</span>
          </Link>
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${isActive(link.path, link.exact) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.rightSection}>
          <button
            className={styles.iconButton}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="搜索"
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button className={styles.iconButton} aria-label="RSS订阅">
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

          {user ? (
            <div className={styles.userMenu} ref={menuRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="用户菜单"
              >
                <div className={styles.avatarSquare}>
                  <span className={styles.avatarInitial}>{getInitial()}</span>
                </div>
                <svg
                  className={`${styles.caretIcon} ${menuOpen ? styles.caretOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <div className={styles.dropdownAvatar}>
                      <span>{getInitial()}</span>
                    </div>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUsername}>
                        {user.nickname || user.email}
                      </span>
                      {user.created_at && (
                        <span className={styles.dropdownJoinDate}>
                          {getJoinDateText()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    个人中心
                  </Link>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    稍后观看
                  </Link>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    订阅内容
                  </Link>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                    账户资料
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    className={styles.logoutBtn}
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/profile" className={styles.avatarButton}>
              <div className={styles.avatar}>
                <svg className={styles.avatarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {searchOpen && (
          <div className={styles.searchOverlay}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="搜索动漫、剧集..."
                className={styles.searchInput}
                autoFocus
              />
              <button className={styles.searchClose} onClick={() => setSearchOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
