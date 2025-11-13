import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, User, AlertTriangle, CheckCircle, Shield, Heart, MessageCircle } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { IconButton } from '../components/ui/Button';

interface Contact {
  name: string;
  phone: string;
  type: 'family' | 'medical' | 'emergency';
  avatar?: string;
  relation: string;
}

const ElegantEmergencySystem: React.FC = () => {
  const { speak } = useAccessibility();
  const navigate = useNavigate();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fallDetected, setFallDetected] = useState(false);
  const [emergencyContacts] = useState<Contact[]>([
    { name: '女兒 陳小玲', phone: '9123 4567', type: 'family', avatar: '👩‍💼', relation: '女兒' },
    { name: '兒子 陳大明', phone: '9234 5678', type: 'family', avatar: '👨‍💻', relation: '兒子' },
    { name: '24小時支援中心', phone: '2382 0000', type: 'emergency', avatar: '🚨', relation: '專業支援' },
    { name: '家庭醫生 王醫生', phone: '2525 2525', type: 'medical', avatar: '👨‍⚕️', relation: '主治醫生' }
  ]);

  const [recentActivity] = useState([
    { time: '09:30', event: '晨間散步 30 分鐘', status: 'good' },
    { time: '12:15', event: '午餐時間', status: 'good' },
    { time: '14:30', event: '用藥提醒', status: 'pending' }
  ]);

  useEffect(() => {
    // 获取当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('無法獲取位置信息');
        }
      );
    }

    // 模拟跌倒检测
    const fallDetectionTimer = setInterval(() => {
      if (Math.random() < 0.001 && !isEmergencyActive) {
        setFallDetected(true);
        startEmergencyCountdown();
      }
    }, 5000);

    return () => clearInterval(fallDetectionTimer);
  }, [isEmergencyActive]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    
    if (isEmergencyActive && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            sendEmergencyAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [isEmergencyActive, countdown]);

  const startEmergencyCountdown = () => {
    setIsEmergencyActive(true);
    setCountdown(30);
    
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
    
    speak('檢測到可能跌倒，30秒後將自動發送求助信號');
  };

  const handleSOS = () => {
    startEmergencyCountdown();
    speak('緊急求助模式已啟動');
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    speak('已取消緊急求助，請注意安全');
  };

  const sendEmergencyAlert = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    const alertMessage = `
      🚨 緊急求助警報 🚨
      
      用戶：陳太 (85歲)
      位置：香港九龍城區
      時間：${new Date().toLocaleString('zh-HK')}
      狀態：${fallDetected ? '跌倒檢測' : '手動求助'}
      
      ✅ 已通知所有緊急聯絡人！
      🚑 救援人員正在趕來
      📞 請保持電話暢通
      
      請保持冷靜，我們與您同在 ❤️
    `;
    
    speak('求助信號已發送，救援人員即將到達，請保持冷靜');
    alert(alertMessage);
    
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
  };

  const callContact = (contact: Contact) => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    speak(`正在為您撥打${contact.name}的電話`);
    alert(`正在撥打 ${contact.name}：${contact.phone}`);
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'medical': return '👨‍⚕️';
      case 'emergency': return '🚨';
      default: return '📞';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /** handleBackToHome - 在紧急场景下提供一致的返回主畫面体验 */
  const handleBackToHome = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    speak('返回主頁');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
      {/* 头部 - 温暖安全感设计 */}
      <div className="mb-8">
        {/* 返回按钮 - 与助手页面保持一致的图标按钮体验 */}
        <div className="flex items-center justify-start mb-4">
          <IconButton
            icon="ArrowLeft"
            onClick={handleBackToHome}
            variant="ghost"
            shape="rounded"
            size="md"
            tooltip="返回主頁"
            className="bg-white/80 hover:bg-white border border-rose-200 text-rose-600 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="返回主頁"
          />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">安全守護</h1>
          <p className="text-xl text-gray-600">24小時陪伴，讓您安心</p>
        </div>

        {/* 状态指示器 */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-emerald-500 mr-3" />
              <div>
                <p className="text-lg font-semibold text-gray-800">系統狀態</p>
                <p className="text-emerald-600">正常守護中</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">最後檢測</p>
              <p className="text-lg font-medium text-gray-700">剛剛</p>
            </div>
          </div>
        </div>
      </div>

      {/* SOS主按钮 - 温暖而有力 */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          {/* 脉冲动画背景 */}
          {isEmergencyActive && (
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
          )}
          
          <button
            onClick={handleSOS}
            disabled={isEmergencyActive}
            className={`relative w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-300 ${
              isEmergencyActive 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:scale-105 active:scale-95'
            }`}
            aria-label="緊急求助按鈕"
            aria-pressed={isEmergencyActive}
            aria-live="polite"
            role="button"
          >
            <div className="text-center text-white relative z-10">
              <Phone className="w-16 h-16 mx-auto mb-3" />
              <span className="text-3xl font-bold block mb-1">SOS</span>
              <span className="text-lg opacity-90 block">緊急求助</span>
              {isEmergencyActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold animate-pulse">發送中...</div>
                </div>
              )}
            </div>
            
            {/* 光泽效果 */}
            {!isEmergencyActive && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
        
        <p className="text-gray-600 mt-4 text-lg">按下按鈕，立即獲得幫助</p>
      </div>

      {/* 紧急状态显示 - 温暖而安心 */}
      {isEmergencyActive && (
        <div className="bg-gradient-to-r from-rose-100 to-red-100 border-2 border-rose-300 rounded-3xl p-8 mb-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-800 mb-2">
              {fallDetected ? '跌倒檢測警報' : '緊急求助啟動'}
            </h2>
            <p className="text-xl text-red-700 mb-6">
              {fallDetected ? '檢測到您可能跌倒，正在確認您的安全' : '求助信號已準備發送'}
            </p>
          </div>
          
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-red-600 mb-2 font-mono">{countdown}</div>
            <p className="text-xl text-red-700">秒後自動發送求助信號</p>
            <p className="text-base text-red-600 mt-2">您還有時間取消</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={cancelEmergency}
              className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl p-6 flex items-center justify-center transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="取消緊急求助"
              role="button"
            >
              <CheckCircle className="w-8 h-8 mr-3" />
              <div className="text-center">
                <div className="text-lg font-bold">我沒事</div>
                <div className="text-sm opacity-90">取消求助</div>
              </div>
            </button>
            
            <button
              onClick={sendEmergencyAlert}
              className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl p-6 flex items-center justify-center transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="立即發送緊急求助"
              role="button"
            >
              <Phone className="w-8 h-8 mr-3" />
              <div className="text-center">
                <div className="text-lg font-bold">立即求助</div>
                <div className="text-sm opacity-90">現在發送</div>
              </div>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
            <p className="text-center text-red-700 font-medium">
              🔔 保持冷靜，我們與您同在。專業救援團隊已準備就緒
            </p>
          </div>
        </div>
      )}

      {/* 位置信息 - 温暖卡片 */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">當前位置</h3>
              <p className="text-gray-600">自動定位，確保安全</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
        
        {location ? (
          <div className="space-y-3">
            <div className="flex items-center p-4 bg-blue-50 rounded-2xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold text-blue-800">📍 香港九龍城區</p>
                <p className="text-sm text-blue-600">定位準確度：高</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500">緯度</span>
                <p className="font-mono text-gray-700">{location.lat.toFixed(4)}°</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500">經度</span>
                <p className="font-mono text-gray-700">{location.lng.toFixed(4)}°</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
            <p className="text-gray-500">正在獲取位置信息...</p>
          </div>
        )}
      </div>

      {/* 紧急联系人 - 温暖设计 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">緊急聯絡人</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Heart className="w-4 h-4 mr-1 text-rose-500" />
            <span>24小時待命</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{contact.avatar}</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{contact.name}</h4>
                    <p className="text-gray-600">{contact.relation}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => callContact(contact)}
                  className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl p-4 flex items-center transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 今日活动记录 - 温暖关怀 */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">今日活動</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>安全記錄</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className={`p-4 rounded-2xl border-2 ${getStatusColor(activity.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    activity.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.event}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'good' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {activity.status === 'good' ? '✅ 完成' : '⏰ 待辦'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部安慰语 */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200">
          <Heart className="w-5 h-5 text-rose-500 mr-2" />
          <p className="text-blue-800 font-medium">您並不孤單，我們時刻守護 💙</p>
        </div>
      </div>
    </div>
  );
};

export default ElegantEmergencySystem;