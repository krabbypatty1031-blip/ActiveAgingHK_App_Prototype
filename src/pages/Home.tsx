import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Pill, Phone, Mic, Settings } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('陳太');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '早晨';
    if (hour < 18) return '午安';
    return '晚安';
  };

  const healthStatus = [
    { icon: Heart, text: '心跳正常', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Bed, text: '睡眠7小時', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: Pill, text: '已服藥', color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ];

  const mainButtons = [
    { name: '健康', icon: Heart, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', path: '/health' },
    { name: '助理', icon: Mic, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', path: '/assistant' },
    { name: '求助', icon: Phone, color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600', path: '/emergency' },
    { name: '家人', icon: Settings, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', path: '/social' }
  ];

  const handleSOS = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    navigate('/emergency');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {/* 顶部问候语 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {getGreeting()}，{userName}！
        </h1>
        <p className="text-2xl text-gray-600">
          {currentTime.toLocaleDateString('zh-HK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 今日关键状态 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">今日狀態</h2>
        <div className="grid grid-cols-1 gap-4">
          {healthStatus.map((status, index) => {
            const IconComponent = status.icon;
            return (
              <div key={index} className={`${status.bgColor} rounded-2xl p-6 flex items-center justify-center`}>
                <IconComponent className={`w-8 h-8 ${status.color} mr-4`} />
                <span className={`text-2xl font-semibold ${status.color}`}>{status.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 主要功能按钮 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {mainButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(button.path)}
              className={`${button.color} ${button.hoverColor} text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <IconComponent className="w-12 h-12 mb-3" />
              <span className="text-2xl font-bold">{button.name}</span>
            </button>
          );
        })}
      </div>

      {/* SOS紧急按钮 */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleSOS}
          className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <span className="text-lg font-bold">SOS</span>
        </button>
      </div>
    </div>
  );
};

export default Home;