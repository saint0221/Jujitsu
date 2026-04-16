import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ExternalLink, Trophy, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import competitionsData from './data/competitions.json';
import './App.css';

const Navbar = () => (
  <nav className="navbar glass">
    <div className="nav-content">
      <div className="logo">
        <Trophy className="logo-icon" />
        <span>JIU-JITSU KOREA HUB</span>
      </div>
      <div className="nav-links">
        <a href="#schedule">대회 일정</a>
        <a href="#guide">참가 신청 가이드</a>
      </div>
    </div>
  </nav>
);

const Hero = ({ searchTerm, setSearchTerm }) => (
  <header className="hero">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-content"
    >
      <h1>국내 주짓수 대회 정보를 <br /><span>한눈에 확인하세요</span></h1>
      <p>전국의 모든 주짓수 대회 일정과 신청 방법을 정리해 드립니다.</p>
      
      <div className="search-container glass">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="대회명, 장소, 혹은 단체를 검색해보세요" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </motion.div>
  </header>
);

const ScheduleCard = ({ competition }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="schedule-card glass"
    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
  >
    <div className="card-header">
      <span className={`badge ${competition.category.toLowerCase()}`}>
        {competition.category === 'Official' ? '공인 대회' : '오픈 대회'}
      </span>
      <span className="region-badge">{competition.region}</span>
    </div>
    <h3>{competition.title}</h3>
    <div className="card-info">
      <div className="info-item">
        <Calendar className="icon" size={16} />
        <span>{competition.date}</span>
      </div>
      <div className="info-item">
        <MapPin className="icon" size={16} />
        <span>{competition.location}</span>
      </div>
      <div className="info-item">
        <Trophy className="icon" size={16} />
        <span>{competition.organization}</span>
      </div>
    </div>
    <a href={competition.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
      참가 신청하기 <ExternalLink size={14} />
    </a>
  </motion.div>
);

const GuideSection = () => (
  <section id="guide" className="guide-section">
    <div className="section-header">
      <Info className="header-icon" />
      <h2>참가 신청 가이드</h2>
    </div>
    <div className="guide-grid">
      <div className="guide-card glass">
        <div className="step-num">01</div>
        <h4>대회 요강 확인</h4>
        <p>각 대회의 체급 규정 및 도복(Gi)/노기(No-Gi) 규칙을 반드시 확인하세요.</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">02</div>
        <h4>선수 등록</h4>
        <p>대한주짓수회 대회는 사전에 ID 등록이 필요할 수 있습니다.</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">03</div>
        <h4>참가비 납부</h4>
        <p>얼리버드 기간에 신청하면 참가비를 할인받을 수 있습니다.</p>
      </div>
    </div>
  </section>
);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompetitions, setFilteredCompetitions] = useState(competitionsData);
  const [activeRegion, setActiveRegion] = useState('All');

  const regions = ['All', 'Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daejeon'];

  useEffect(() => {
    const results = competitionsData.filter(comp => {
      const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           comp.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = activeRegion === 'All' || comp.region === activeRegion;
      return matchesSearch && matchesRegion;
    });
    setFilteredCompetitions(results);
  }, [searchTerm, activeRegion]);

  return (
    <div className="app">
      <Navbar />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="container">
        <section id="schedule" className="schedule-section">
          <div className="filter-bar">
            {regions.map(region => (
              <button 
                key={region}
                className={activeRegion === region ? 'active' : ''}
                onClick={() => setActiveRegion(region)}
              >
                {region === 'All' ? '전체 지역' : region}
              </button>
            ))}
          </div>
          
          <div className="schedule-grid">
            <AnimatePresence mode='popLayout'>
              {filteredCompetitions.length > 0 ? (
                filteredCompetitions.map(comp => (
                  <ScheduleCard key={comp.id} competition={comp} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="no-results"
                >
                  검색 결과가 없습니다.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <GuideSection />
      </main>

      <footer className="footer">
        <p>© 2026 JIU-JITSU KOREA HUB. 모든 대회 정보는 주최측의 사정에 따라 변경될 수 있습니다.</p>
      </footer>
    </div>
  );
}

export default App;
