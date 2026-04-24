import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>ANIME</span>
            <span className={styles.logoDot}>.</span>
          </Link>
          <h1 className={styles.title}>登录</h1>
          <p className={styles.subtitle}>欢迎回到动漫世界</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="请输入邮箱地址"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="请输入密码"
              required
            />
          </div>

          <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>记住我</span>
            </label>
            <a href="#" className={styles.forgotLink}>忘记密码？</a>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            登录
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>或</span>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
              </svg>
              使用 Google 登录
            </button>
          </div>

          <div className={styles.signupLink}>
            还没有账号？ <Link to="/signup" className={styles.link}>立即注册</Link>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            登录即表示您同意我们的 <a href="#" className={styles.footerLink}>使用条款</a> 和 <a href="#" className={styles.footerLink}>隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;