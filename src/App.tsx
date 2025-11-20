import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AccessibilityProvider } from './components/AccessibilitySettings';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';

// Original page components removed

import FamilyDashboard from './pages/FamilyDashboard';

// Refined UI page components
import ElegantHome from './pages/ElegantHome';
import ElegantHealthDashboard from './pages/ElegantHealthDashboard';
import ElegantAIAssistant from './pages/ElegantAIAssistant';
import ElegantEmergencySystem from './pages/ElegantEmergencySystem';
import ElegantSocialFamily from './pages/ElegantSocialFamily';
import ElegantSettings from './pages/ElegantSettings';
import ElegantLogin from './pages/ElegantLogin';
import AddReminder from './pages/AddReminder';
import FallAlert from './pages/FallAlert';
import Doctor from './pages/Doctor';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Login page - default landing */}
              <Route path="/" element={<ElegantLogin />} />
              
              {/* Refined UI routes - primary flow */}
              <Route path="/home" element={<ElegantHome />} />
              <Route path="/health" element={<ElegantHealthDashboard />} />
              <Route path="/assistant" element={<ElegantAIAssistant />} />
              <Route path="/emergency" element={<ElegantEmergencySystem />} />
              <Route path="/social" element={<ElegantSocialFamily />} />
              <Route path="/settings" element={<ElegantSettings onBack={() => window.history.back()} />} />
              <Route path="/add" element={<AddReminder />} />
              <Route path="/fall" element={<FallAlert />} />
              <Route path="/doctor" element={<Doctor />} />
              
              {/* Legacy page routes - removed */}

              
              {/* Web-based family dashboard */}
              <Route path="/family" element={<FamilyDashboard />} />
            </Routes>
            
            {/* Global Accessibility Settings Button - Removed as per request */}
          </div>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

export default App;