import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LatestReleases from './pages/LatestReleases';
import RecentlyAdded from './pages/RecentlyAdded';
import AnimeSeries from './pages/AnimeSeries';
import Trending from './pages/Trending';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Watch from './pages/Watch';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/latest-releases" element={<LatestReleases />} />
            <Route path="/recently-added" element={<RecentlyAdded />} />
            <Route path="/anime-series" element={<AnimeSeries />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watch/:animeId" element={<Watch />} />
            <Route path="/anime/:animeId" element={<Watch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
