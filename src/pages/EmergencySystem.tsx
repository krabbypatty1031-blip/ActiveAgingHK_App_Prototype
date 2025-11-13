import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, User, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/ui/Button';

interface Contact {
  name: string;
  phone: string;
  type: 'family' | 'medical' | 'emergency';
  avatar?: string;
}

const EmergencySystem: React.FC = () => {
  const navigate = useNavigate();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fallDetected, setFallDetected] = useState(false);
  const [emergencyContacts] = useState<Contact[]>([
    { name: '女兒 陳小玲', phone: '9123 4567', type: 'family' },
    { name: '兒子 陳大明', phone: '9234 5678', type: 'family' },
    { name: '24小時支援中心', phone: '2382 0000', type: 'emergency' },
    { name: '家庭醫生 王醫生', phone: '2525 2525', type: 'medical' }
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

    // 模拟跌倒检测（实际应用中需要连接传感器）
    const fallDetectionTimer = setInterval(() => {
      // 随机模拟跌倒检测（仅用于演示）
      if (Math.random() < 0.001 && !isEmergencyActive) { // 0.1% 概率
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
            // 倒计时结束，自动发送求助
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
    
    // 震动提醒
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
  };

  const handleSOS = () => {
    startEmergencyCountdown();
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const sendEmergencyAlert = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    // 模拟发送紧急求助
    const alertMessage = `
      🚨 緊急求助警報 🚨
      
      用戶：陳太 (85歲)
      位置：${location ? `緯度 ${location.lat.toFixed(6)}, 經度 ${location.lng.toFixed(6)}` : '位置獲取中'}
      時間：${new Date().toLocaleString('zh-HK')}
      狀態：${fallDetected ? '跌倒檢測' : '手動求助'}
      
      已通知所有緊急聯絡人！
    `;
    
    alert(alertMessage);
    
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
  };

  const callContact = (contact: Contact) => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      {/* 头部 */}
      <div className="flex items-center justify-center mb-8 relative">
        <IconButton
          icon="ArrowLeft"
          onClick={() => navigate('/home')}
          variant="ghost"
          shape="rounded"
          size="md"
          tooltip="返回主頁"
          className="absolute left-0 bg-white/80 hover:bg-white border border-orange-200 text-orange-600 shadow-md hover:shadow-lg"
          aria-label="返回主頁"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">緊急求助</h1>
          <p className="text-xl text-gray-600">您的安全，我們的關心</p>
        </div>
      </div>

      {/* SOS主按钮 */}
      <div className="text-center mb-8">
        <button
          onClick={handleSOS}
          disabled={isEmergencyActive}
          className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 ${
            isEmergencyActive 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95'
          }`}
          aria-label="緊急求助按鈕"
          aria-pressed={isEmergencyActive}
          role="button"
        >
          <div className="text-center">
            <Phone className="w-16 h-16 text-white mx-auto mb-2" />
            <span className="text-3xl font-bold text-white block">SOS</span>
            <span className="text-lg text-white block">緊急求助</span>
          </div>
        </button>
      </div>

      {/* 紧急状态显示 */}
      {isEmergencyActive && (
        <div className="bg-red-100 border-4 border-red-300 rounded-3xl p-6 mb-6">
          <div className="text-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3 animate-bounce" />
            <h2 className="text-3xl font-bold text-red-800 mb-2">
              {fallDetected ? '跌倒檢測！' : '緊急求助啟動！'}
            </h2>
            <p className="text-xl text-red-700 mb-4">
              {fallDetected ? '檢測到您可能跌倒' : '求助信號已準備發送'}
            </p>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-red-600 mb-2">{countdown}</div>
            <p className="text-xl text-red-700">秒後自動發送求助</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={cancelEmergency}
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-4 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              <span className="text-lg font-semibold">我沒事</span>
            </button>
            
            <button
              onClick={sendEmergencyAlert}
              className="bg-red-500 hover:bg-red-600 text-white rounded-2xl p-4 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Phone className="w-6 h-6 mr-2" />
              <span className="text-lg font-semibold">立即求助</span>
            </button>
          </div>
        </div>
      )}

      {/* 位置信息 */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-8 h-8 text-blue-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">當前位置</h3>
        </div>
        
        {location ? (
          <div>
            <p className="text-xl text-gray-700 mb-2">📍 香港九龍城區</p>
            <p className="text-lg text-gray-600">
              緯度: {location.lat.toFixed(4)}°
            </p>
            <p className="text-lg text-gray-600">
              經度: {location.lng.toFixed(4)}°
            </p>
          </div>
        ) : (
          <p className="text-xl text-gray-500">正在獲取位置信息...</p>
        )}
      </div>

      {/* 紧急联系人 */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">緊急聯絡人</h3>
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getContactIcon(contact.type)}</span>
                <div>
                  <p className="text-xl font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-lg text-gray-600">{contact.phone}</p>
                </div>
              </div>
              <button
                onClick={() => callContact(contact)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 跌倒检测状态 */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              fallDetected ? 'bg-red-500 animate-pulse' : 'bg-green-500'
            }`}></div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {fallDetected ? '跌倒檢測啟動' : '跌倒檢測正常'}
              </p>
              <p className="text-base text-gray-600">
                {fallDetected ? '檢測到異常活動' : '持續監測中'}
              </p>
            </div>
          </div>
          <Clock className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default EmergencySystem;