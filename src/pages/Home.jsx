import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import api from '../services/api';
import styles from './Home.module.css';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHome()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load home data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.home}><div className={styles.loading}></div></div>;
  }

  return (
    <div className={styles.home}>
      <HeroBanner />

      <div className={styles.content}>
        <MovieRow
          title="最新发布"
          items={data?.latestReleases || []}
          aspectRatio="16:9"
          seeAllLink="/latest-releases"
        />

        <MovieRow
          title="最新上传"
          items={data?.recentlyAdded || []}
          aspectRatio="16:9"
          seeAllLink="/recently-added"
        />

        <MovieRow
          title="番剧专区"
          items={data?.animeSeries || []}
          aspectRatio="2:3"
          seeAllLink="/anime-series"
        />

        <MovieRow
          title="他们在看"
          items={data?.trending || []}
          aspectRatio="16:9"
          seeAllLink="/trending"
        />
      </div>
    </div>
  );
};

export default Home;