import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Profile.module.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('my-list');
  const [profileData, setProfileData] = useState(null);
  const [myAnimeList, setMyAnimeList] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProfile()
      .then((data) => setProfileData(data.user))
      .catch(() => navigate('/login'));

    api.getUserList()
      .then((data) => setMyAnimeList(data.data || []))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profile = {
    name: profileData?.nickname || user?.nickname || '用户',
    username: profileData?.email || user?.email || '',
    joinDate: profileData?.created_at
      ? new Date(profileData.created_at).getFullYear() + '年加入'
      : '新用户',
    avatarColor: '#E50914',
  };

  const settings = [
    { id: 1, title: '账户设置', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 2, title: '观看历史', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 3, title: '通知偏好', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 4, title: '隐私设置', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  const handleRemoveAnime = async (animeId) => {
    if (!confirm('确定要从列表中移除？')) return;
    try {
      await api.removeFromList(animeId);
      setMyAnimeList((prev) => prev.filter((item) => item.id !== animeId));
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div
                className={styles.avatar}
                style={{ backgroundColor: profile.avatarColor }}
              >
                <span className={styles.avatarInitial}>{profile.name.charAt(0)}</span>
              </div>
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{profile.name}</h1>
                <p className={styles.profileUsername}>{profile.username}</p>
                <p className={styles.profileMeta}>{profile.joinDate}</p>
              </div>
            </div>
            <Link to="/" className={styles.editButton}>
              <svg className={styles.editIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑资料
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'my-list' ? styles.active : ''}`}
              onClick={() => setActiveTab('my-list')}
            >
              我的列表
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              账户设置
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
            >
              安全与隐私
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'my-list' && (
              <div className={styles.myListGrid}>
                {myAnimeList.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#B3B3B3', padding: '40px' }}>
                    暂无收藏，去首页添加喜欢的动漫吧
                  </div>
                ) : (
                  myAnimeList.map((item) => (
                    <div key={item.id} className={styles.listCard}>
                      <div className={styles.listIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className={styles.listTitle}>{item.title}</h3>
                      <p className={styles.listCount}>{item.meta}</p>
                      <button className={styles.listButton} onClick={() => handleRemoveAnime(item.id)}>移除</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={styles.settingsGrid}>
                {settings.map((setting) => (
                  <div key={setting.id} className={styles.settingCard}>
                    <div className={styles.settingIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={setting.icon} />
                      </svg>
                    </div>
                    <h3 className={styles.settingTitle}>{setting.title}</h3>
                    <button className={styles.settingButton}>管理</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.securitySection}>
                <div className={styles.securityCard}>
                  <h3 className={styles.securityTitle}>账户安全</h3>
                  <p className={styles.securityText}>确保您的账户信息安全</p>
                  <div className={styles.securityActions}>
                    <button className={styles.securityButton}>更改密码</button>
                    <button className={styles.securityButton}>双重验证</button>
                  </div>
                </div>
                <div className={styles.securityCard}>
                  <h3 className={styles.securityTitle}>隐私设置</h3>
                  <p className={styles.securityText}>控制您的个人信息可见性</p>
                  <div className={styles.securityActions}>
                    <button className={styles.securityButton}>隐私选项</button>
                    <button className={styles.securityButton}>数据导出</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.logoutSection}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg className={styles.logoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;