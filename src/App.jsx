import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ExternalLink, Trophy, Info, Users, GraduationCap, CheckCircle, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from './data/events.json';
import techniquesData from './data/techniques.json';
import './App.css';

const Navbar = ({ activeView, setActiveView }) => (
  <nav className="navbar glass">
    <div className="nav-content">
      <div className="logo" onClick={() => setActiveView('schedule')} style={{ cursor: 'pointer' }}>
        <Trophy className="logo-icon" />
        <span>JIU-JITSU KOREA HUB</span>
      </div>
      <div className="nav-links">
        <button className={activeView === 'schedule' ? 'active' : ''} onClick={() => setActiveView('schedule')}>대회/세미나</button>
        <button className={activeView === 'techniques' ? 'active' : ''} onClick={() => setActiveView('techniques')}>기술 영상</button>
        <a href="#guide">가이드</a>
      </div>
    </div>
  </nav>
);

const Hero = ({ activeView, searchTerm, setSearchTerm }) => (
  <header className="hero">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-content"
    >
      <h1>{activeView === 'schedule' ? '검증된 주짓수 일정' : '주짓수 기술 도서관'}<br /><span>{activeView === 'schedule' ? '신뢰할 수 있는 정보만' : '언제 어디서나 학습하세요'}</span></h1>
      <p>{activeView === 'schedule' ? '공식 소스를 바탕으로 교차 검증된 대회, 세미나 정보를 제공합니다.' : '서브미션부터 가드까지, 카테고리별 전문 교육 영상을 만나보세요.'}</p>
      
      <div className="search-container glass">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder={activeView === 'schedule' ? "이벤트명, 장소를 검색해보세요" : "기술명이나 강사를 검색해보세요"}
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

const TechniqueCard = ({ tech, onPlay }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="tech-card glass"
    whileHover={{ y: -5 }}
  >
    <div className="tech-thumb" onClick={() => onPlay(tech)}>
      <img src={tech.thumb} alt={tech.title} />
      <div className="play-overlay">
        <Play fill="white" size={48} />
      </div>
    </div>
    <div className="tech-info">
      <h3>{tech.title}</h3>
      <div className="tech-meta">
        <span className="instructor">{tech.instructor} 인스트럭터</span>
        <span className="tech-category-badge">{tech.category}</span>
      </div>
      <p>{tech.description}</p>
    </div>
  </motion.div>
);

const VideoModal = ({ video, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="video-modal-overlay"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="video-modal-content glass"
      onClick={e => e.stopPropagation()}
    >
      <button className="close-btn" onClick={onClose}><X /></button>
      <div className="video-wrapper">
        <iframe 
          src={video.url} 
          title={video.title}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-details">
        <h2>{video.title}</h2>
        <p className="instructor">{video.instructor} 인스트럭터</p>
        <p className="description">{video.description}</p>
      </div>
    </motion.div>
  </motion.div>
);

function App() {
  const [activeView, setActiveView] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Schedule States
  const [activeEventCategory, setActiveEventCategory] = useState('competition');
  const [activeRegion, setActiveRegion] = useState('All');
  
  // Technique States
  const [activeTechCategory, setActiveTechCategory] = useState('Submission');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const eventCategories = [
    { id: 'competition', label: '대회', icon: Trophy },
    { id: 'seminar', label: '세미나', icon: GraduationCap },
    { id: 'openmat', label: '합동훈련', icon: Users }
  ];

  const techCategories = ['Submission', 'Guard Pass', 'Guard'];
  const regions = ['All', 'Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daejeon'];

  const filteredEvents = eventsData.filter(event => {
    const matchesCategory = event.type === activeEventCategory;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = activeRegion === 'All' || event.region === activeRegion;
    return matchesCategory && matchesSearch && matchesRegion;
  });

  const filteredTechs = techniquesData.filter(tech => {
    const matchesCategory = tech.category === activeTechCategory;
    const matchesSearch = 
      tech.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tech.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      <Hero activeView={activeView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="container">
        {activeView === 'schedule' ? (
          <section id="schedule" className="schedule-section">
            <div className="category-tabs glass">
              {eventCategories.map(cat => (
                <button 
                  key={cat.id}
                  className={activeEventCategory === cat.id ? 'active' : ''}
                  onClick={() => setActiveEventCategory(cat.id)}
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-results">검증된 일정이 없습니다.</motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        ) : (
          <section id="techniques" className="tech-section">
            <div className="tech-category-tabs glass">
              {techCategories.map(cat => (
                <button 
                  key={cat}
                  className={activeTechCategory === cat ? 'active' : ''}
                  onClick={() => setActiveTechCategory(cat)}
                >
                  {cat === 'Submission' ? '서브미션' : cat === 'Guard Pass' ? '가드패스' : '가드'}
                </button>
              ))}
            </div>
            
            <div className="tech-grid">
              <AnimatePresence mode='popLayout'>
                {filteredTechs.length > 0 ? (
                  filteredTechs.map(tech => (
                    <TechniqueCard key={tech.id} tech={tech} onPlay={setSelectedVideo} />
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-results">관련 기술 영상이 없습니다.</motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}

        <GuideSection />
      </main>

      <AnimatePresence>
        {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>

      <footer className="footer">
        <p>© 2026 JIU-JITSU KOREA HUB | 데이터 최종 검증일: 2026-04-16</p>
      </footer>
    </div>
  );
}

export default App;
