import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      await register(email, password, email.split('@')[0]);
      navigate('/');
    } catch (err) {
      setError(err.message || '注册失败');
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
          <h1 className={styles.title}>注册</h1>
          <p className={styles.subtitle}>加入动漫世界，发现更多精彩</p>
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
              placeholder="请输入密码（至少8位）"
              minLength="8"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              确认密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="请再次输入密码"
              required
            />
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={styles.checkbox}
                required
              />
              <span className={styles.checkboxText}>
                我已阅读并同意 <a href="#" className={styles.link}>使用条款</a> 和 <a href="#" className={styles.link}>隐私政策</a>
              </span>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            注册
          </button>

          <div className={styles.signupLink}>
            已有账号？ <Link to="/login" className={styles.link}>立即登录</Link>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            注册即表示您同意我们的 <a href="#" className={styles.footerLink}>使用条款</a> 和 <a href="#" className={styles.footerLink}>隐私政策</a>
          </p>
          <p className={styles.footerText}>
            本网站为演示项目，注册信息不会真实存储
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;