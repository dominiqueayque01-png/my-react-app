import { useState, useEffect } from 'react';
// NEW: Import the FiBell icon!
import { FiSun, FiMoon, FiCheckSquare, FiBell } from 'react-icons/fi';

// NEW: Accept testNotification as a prop
export default function Header({ isDarkMode, setIsDarkMode, testNotification }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); 
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <header className="site-header">
      <div className="logo-section">
        <FiCheckSquare size={28} className="logo-icon" />
        <span className="logo-text">SmartTask</span>
      </div>
      
      <div className="header-clock">
        <span className="clock-time">{formattedTime}</span>
        <span className="clock-date">{formattedDate}</span>
      </div>

      <nav className="header-nav">
        <a href="#dashboard" className="nav-link">Dashboard</a>
        {/* We deleted the "About" link here! */}
        
        {/* NEW: The Bell Icon Button */}
        <button 
          className="theme-toggle global-toggle" 
          onClick={testNotification}
          title="Test Notification"
        >
          <FiBell size={20} />
        </button>

        <button 
          className="theme-toggle global-toggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Theme"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </nav>
    </header>
  );
}