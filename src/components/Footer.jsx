import styles from './Footer.module.css';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
    { name: 'Instagram', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z' },
    { name: 'YouTube', icon: 'M23 11a11.89 11.89 0 0 1-3.48 8.46A11.77 11.77 0 0 1 12 23 11.89 11.89 0 0 1 1 11a11.77 11.77 0 0 1 3.48-8.46A11.89 11.89 0 0 1 12 1a11.77 11.77 0 0 1 8.52 3.54A11.89 11.89 0 0 1 23 11zM9 8l8 4.5L9 17V8z' },
  ];

  const footerLinks = [
    {
      title: '关于我们',
      links: ['公司简介', '联系我们', '招贤纳士', '媒体中心'],
    },
    {
      title: '帮助中心',
      links: ['使用帮助', '账户安全', '隐私政策', 'Cookie政策'],
    },
    {
      title: '条款与隐私',
      links: ['使用条款', '隐私声明', 'Cookie声明', '法律声明'],
    },
    {
      title: '联系我们',
      links: ['客服中心', '合作伙伴', '广告合作', '内容合作'],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socialSection}>
          <div className={styles.socialIcons}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href="#"
                className={styles.socialIcon}
                aria-label={social.name}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
          <p className={styles.socialText}>关注我们，获取最新动漫资讯</p>
        </div>

        <div className={styles.linksSection}>
          {footerLinks.map((column) => (
            <div key={column.title} className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={styles.link}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <p>© 2026 ANIME. 保留所有权利。</p>
            <p>本网站为演示项目，所有内容均为虚拟展示。</p>
          </div>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>隐私声明</a>
            <span className={styles.separator}>|</span>
            <a href="#" className={styles.legalLink}>使用条款</a>
            <span className={styles.separator}>|</span>
            <a href="#" className={styles.legalLink}>Cookie政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;