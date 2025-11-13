import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AccessibilityProvider } from './components/AccessibilitySettings';
import AccessibilitySettings from './components/AccessibilitySettings';
import { ThemeProvider } from './contexts/ThemeContext';

// 原始页面组件
import Home from './pages/Home';
import HealthDashboard from './pages/HealthDashboard';
import AIAssistant from './pages/AIAssistant';
import EmergencySystem from './pages/EmergencySystem';
import SocialFamily from './pages/SocialFamily';
import FamilyDashboard from './pages/FamilyDashboard';

// 精致UI页面组件
import ElegantHome from './pages/ElegantHome';
import ElegantHealthDashboard from './pages/ElegantHealthDashboard';
import ElegantAIAssistant from './pages/ElegantAIAssistant';
import ElegantEmergencySystem from './pages/ElegantEmergencySystem';
import ElegantSocialFamily from './pages/ElegantSocialFamily';
import ElegantSettings from './pages/ElegantSettings';
import ElegantLogin from './pages/ElegantLogin';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* 登录页 - 默认首页 */}
              <Route path="/" element={<ElegantLogin />} />
              
              {/* 精致UI路由 - 主要使用这些 */}
              <Route path="/home" element={<ElegantHome />} />
              <Route path="/health" element={<ElegantHealthDashboard />} />
              <Route path="/assistant" element={<ElegantAIAssistant />} />
              <Route path="/emergency" element={<ElegantEmergencySystem />} />
              <Route path="/social" element={<ElegantSocialFamily />} />
              <Route path="/settings" element={<ElegantSettings onBack={() => window.history.back()} />} />
              
              {/* 原始页面路由 - 作为备选 */}
              <Route path="/classic" element={<Home />} />
              <Route path="/classic/health" element={<HealthDashboard />} />
              <Route path="/classic/assistant" element={<AIAssistant />} />
              <Route path="/classic/emergency" element={<EmergencySystem />} />
              <Route path="/classic/social" element={<SocialFamily />} />
              
              {/* Web版家属仪表盘 */}
              <Route path="/family" element={<FamilyDashboard />} />
            </Routes>
            
            {/* 无障碍设置组件（全局可用） */}
            <AccessibilitySettings />
          </div>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

export default App;