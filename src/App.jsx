import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ExternalLink, Trophy, Info, Users, GraduationCap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from './data/events.json';
import './App.css';

const Navbar = () => (
  <nav className="navbar glass">
    <div className="nav-content">
      <div className="logo">
        <Trophy className="logo-icon" />
        <span>JIU-JITSU KOREA HUB</span>
      </div>
      <div className="nav-links">
        <a href="#schedule">일정 확인</a>
        <a href="#guide">가이드</a>
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
      <h1>검증된 주짓수 일정 <br /><span>신뢰할 수 있는 정보만</span></h1>
      <p>공식 소스를 바탕으로 교차 검증된 대회, 세미나 정보를 제공합니다.</p>
      
      <div className="search-container glass">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="이벤트명, 강사, 장소를 검색해보세요" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </motion.div>
  </header>
);

const EventCard = ({ event }) => {
  const getBadgeColor = () => {
    switch(event.type) {
      case 'competition': return 'official';
      case 'seminar': return 'seminar';
      case 'openmat': return 'openmat';
      default: return '';
    }
  };

  const getTypeText = () => {
    switch(event.type) {
      case 'competition': return event.category === 'Official' ? '공인 대회' : '오픈 대회';
      case 'seminar': return '기술 세미나';
      case 'openmat': return '합동 훈련';
      default: return '이벤트';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="schedule-card glass"
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
    >
      <div className="card-header">
        <div className="badge-group">
          <span className={`badge ${getBadgeColor()}`}>
            {getTypeText()}
          </span>
          {event.verified && (
            <span className="verified-badge" title="공식 소스 확인됨">
              <CheckCircle size={12} /> 검증됨
            </span>
          )}
        </div>
        <span className="region-badge">{event.region}</span>
      </div>
      <h3>{event.title}</h3>
      
      <div className="card-info">
        {event.instructor && (
          <div className="info-item instructor-info">
            <GraduationCap className="icon" size={16} />
            <span className="instructor-name">{event.instructor}</span>
            <span className={`belt-badge ${event.belt.toLowerCase()}`}>{event.belt} Belt</span>
          </div>
        )}
        {event.host && (
          <div className="info-item">
            <Users className="icon" size={16} />
            <span>Host: {event.host}</span>
          </div>
        )}
        <div className="info-item">
          <Calendar className="icon" size={16} />
          <span>{event.date}</span>
        </div>
        <div className="info-item">
          <MapPin className="icon" size={16} />
          <span>{event.location}</span>
        </div>
        <div className="info-item">
          <Trophy className="icon" size={16} />
          <span>{event.organization}</span>
        </div>
      </div>
      
      <div className="card-actions">
        <a href={event.link} target="_blank" rel="noopener noreferrer" className={`apply-btn ${getBadgeColor()}`}>
          {event.type === 'competition' ? '참가 신청하기' : '공지 확인하기'} <ExternalLink size={14} />
        </a>
        {event.sourceUrl && (
          <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
            공식 공고 보기
          </a>
        )}
      </div>
    </motion.div>
  );
};

const GuideSection = () => (
  <section id="guide" className="guide-section">
    <div className="section-header">
      <Info className="header-icon" />
      <h2>주짓수 이용 가이드</h2>
    </div>
    <div className="guide-grid">
      <div className="guide-card glass">
        <div className="step-num">01</div>
        <h4>정보 검증 원칙</h4>
        <p>본 사이트는 공식 협회 및 단체의 공고를 바탕으로 교차 검증된 정보만 제공합니다.</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">02</div>
        <h4>대회 및 세미나</h4>
        <p>확정된 일정만 수록하며, 변경 사항 발생 시 공식 출처 링크를 통해 재확인을 권장합니다.</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">03</div>
        <h4>데이터 신뢰성</h4>
        <p>불분명한 정보는 과감히 제외하며, 수시로 데이터를 업데이트하여 정확성을 유지합니다.</p>
      </div>
    </div>
  </section>
);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('competition');
  const [activeRegion, setActiveRegion] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const categories = [
    { id: 'competition', label: '대회', icon: Trophy },
    { id: 'seminar', label: '세미나', icon: GraduationCap },
    { id: 'openmat', label: '합동훈련', icon: Users }
  ];

  const regions = ['All', 'Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daejeon'];

  useEffect(() => {
    const results = eventsData.filter(event => {
      const matchesCategory = event.type === activeCategory;
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.instructor && event.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = activeRegion === 'All' || event.region === activeRegion;
      
      return matchesCategory && matchesSearch && matchesRegion;
    });
    setFilteredEvents(results);
  }, [searchTerm, activeCategory, activeRegion]);

  return (
    <div className="app">
      <Navbar />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="container">
        <section id="schedule" className="schedule-section">
          <div className="category-tabs glass">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={activeCategory === cat.id ? 'active' : ''}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveRegion('All');
                }}
              >
                <cat.icon size={18} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

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
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="no-results"
                >
                  현재 검증된 일정이 없습니다.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <GuideSection />
      </main>

      <footer className="footer">
        <p>© 2026 JIU-JITSU KOREA HUB | 데이터 최종 검증일: 2026-04-16</p>
      </footer>
    </div>
  );
}

export default App;
