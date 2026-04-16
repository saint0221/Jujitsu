import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ExternalLink, Trophy, Info, Users, GraduationCap, SwatchBook } from 'lucide-react';
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
      <h1>주짓수의 모든 일정 <br /><span>한곳에 모았습니다</span></h1>
      <p>대회, 세미나, 그리고 합동훈련 정보를 가장 빠르게 확인하세요.</p>
      
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
        <span className={`badge ${getBadgeColor()}`}>
          {getTypeText()}
        </span>
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
      
      <a href={event.link} target="_blank" rel="noopener noreferrer" className={`apply-btn ${getBadgeColor()}`}>
        {event.type === 'competition' ? '참가 신청하기' : '공지 확인하기'} <ExternalLink size={14} />
      </a>
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
        <h4>대회 준비</h4>
        <p>체급 계체 및 정해진 룰(IBJJF, ADCC 등)을 숙지하고 도복 상태를 점검하세요.</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">02</div>
        <h4>세미나 참여</h4>
        <p>유명 인스트럭터의 기술 정수를 배우고 질문할 기회를 놓치지 마세요. 필기도구 필수!</p>
      </div>
      <div className="guide-card glass">
        <div className="step-num">03</div>
        <h4>오픈매트 매너</h4>
        <p>상대방에 대한 존중과 청결한 도복 상태를 유지하며 다양한 파트너와 교류하세요.</p>
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
          {/* Main Category Tabs */}
          <div className="category-tabs glass">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={activeCategory === cat.id ? 'active' : ''}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveRegion('All'); // Reset region on category change
                }}
              >
                <cat.icon size={18} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Region Filters */}
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
                  해당 조건의 일정이 아직 없습니다.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <GuideSection />
      </main>

      <footer className="footer">
        <p>© 2026 JIU-JITSU KOREA HUB. 모든 행사 정보는 주최측에 의해 변경될 수 있습니다.</p>
      </footer>
    </div>
  );
}

export default App;
