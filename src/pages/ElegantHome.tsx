import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Pill, Phone, Mic, Settings, Sun, Moon, Sparkles, TrendingUp, Square, XCircle, Users } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMascot } from '../components/BrandMascot';
import { Button, IconButton, FloatingActionButton } from '../components/ui/Button';
import { Icon, NavigationIcon } from '../components/ui/Icon';

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    webkitAudioContext?: typeof AudioContext;
  }
}

const ElegantHome: React.FC = () => {
  const navigate = useNavigate();
  const { speak, fontSize, highContrast } = useAccessibility();
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('陳太');
  const [encouragement, setEncouragement] = useState('');
  const [isMorning, setIsMorning] = useState(true);
  const [isVoicePanelVisible, setIsVoicePanelVisible] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceCountdown, setVoiceCountdown] = useState(10);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState('請說話…');
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState('');
  const [voiceWaveHeights, setVoiceWaveHeights] = useState<number[]>([36, 52, 44, 58, 40, 47, 55]);
  const speechRecognitionRef = useRef<any>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const waveAnimationRef = useRef<number | null>(null);
  const isVoiceListeningRef = useRef(false);
  const recognizedSpeechRef = useRef('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    setIsMorning(hour < 18);
    
    // 设置鼓励语
    const encouragements = [
      '今日精神好好！保持微笑 😊',
      '您今日做得好！繼續加油 💪',
      '身體健康最重要！記得多休息 🌸',
      '每日進步一點點，生活更美好 ✨',
      '您的堅持令人敬佩！繼續努力 👏'
    ];
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [currentTime]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: '早晨', icon: '🌅', color: 'from-orange-100 to-yellow-100' };
    if (hour < 18) return { text: '午安', icon: '☀️', color: 'from-blue-100 to-cyan-100' };
    return { text: '晚安', icon: '🌙', color: 'from-purple-100 to-indigo-100' };
  };

  const greeting = getGreeting();

  const healthStatus = [
    { 
      icon: Heart, 
      text: '心跳正常', 
      value: '72 bpm',
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      trend: 'stable',
      gradient: 'from-emerald-50 to-green-50'
    },
    { 
      icon: Bed, 
      text: '睡眠7小時', 
      value: '85% 質素',
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      gradient: 'from-blue-50 to-cyan-50'
    },
    { 
      icon: Pill, 
      text: '已服藥', 
      value: '準時9:00',
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'good',
      gradient: 'from-purple-50 to-violet-50'
    }
  ];

  const mainButtons = [
    { 
      name: '健康', 
      icon: Heart, 
      color: 'bg-gradient-to-br from-emerald-400 to-green-500', 
      hoverColor: 'hover:from-emerald-500 hover:to-green-600',
      path: '/health',
      description: '查看健康數據'
    },
    { 
      name: '助理', 
      icon: Mic, 
      color: 'bg-gradient-to-br from-blue-400 to-blue-600', 
      hoverColor: 'hover:from-blue-500 hover:to-blue-700',
      path: '/assistant',
      description: '語音助手'
    },
    { 
      name: '求助', 
      icon: Phone, 
      color: 'bg-gradient-to-br from-orange-400 to-orange-600', 
      hoverColor: 'hover:from-orange-500 hover:to-orange-700',
      path: '/emergency',
      description: '緊急支援'
    },
    { 
      name: '家人', 
      icon: Settings, 
      color: 'bg-gradient-to-br from-purple-400 to-purple-600', 
      hoverColor: 'hover:from-purple-500 hover:to-purple-700',
      path: '/social',
      description: '家庭聯繫'
    },
    { 
      name: '家屬', 
      icon: Users, 
      color: 'bg-gradient-to-br from-cyan-400 to-teal-600', 
      hoverColor: 'hover:from-cyan-500 hover:to-teal-700',
      path: '/family',
      description: '家屬面板'
    }
  ];

  const handleNavigation = (path: string, name: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    speak(`正在打開${name}`);
    navigate(path);
  };

  const handleSOS = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    speak('緊急求助模式');
    navigate('/emergency');
  };

  const handleCardClick = (status: any) => {
    speak(`${status.text}，${status.value}`);
  };

  /** playStartTone - 以柔和提示音告知錄音開始 */
  const playStartTone = () => {
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) {
        return;
      }
      const audioContext = new AudioContextCtor();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
      oscillator.stop(audioContext.currentTime + 0.4);
      oscillator.onended = () => {
        gainNode.disconnect();
        oscillator.disconnect();
        audioContext.close();
      };
    } catch (error) {
      console.warn('Audio context not available for start tone', error);
    }
  };

  /** stopVoiceRecognition - 統一處理語音識別結束時的資源釋放與視覺反饋 */
  const stopVoiceRecognition = (options?: { reason?: 'cancelled' | 'timeout' | 'error' | 'success'; message?: string; keepPanel?: boolean }) => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.stop();
      } catch (error) {
        console.warn('Failed to stop recognition gracefully', error);
      }
      speechRecognitionRef.current = null;
    }
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (waveAnimationRef.current) {
      window.clearInterval(waveAnimationRef.current);
      waveAnimationRef.current = null;
    }
    setIsVoiceListening(false);
    isVoiceListeningRef.current = false;
    if (options?.message) {
      setVoiceStatusMessage(options.message);
    }
    if (options?.reason === 'cancelled' || options?.reason === 'error' || options?.reason === 'timeout') {
      setRecognizedSpeech('');
    }
    if (!options?.keepPanel) {
      const hideDelay = options?.reason === 'success' ? 1200 : 600;
      setTimeout(() => {
        setIsVoicePanelVisible(false);
      }, hideDelay);
    }
  };

  /** handleVoiceSuccess - 封裝成功識別時的體驗回饋 */
  const handleVoiceSuccess = (transcript: string) => {
    setRecognizedSpeech(transcript);
    setLastVoiceTranscript(transcript);
    setVoiceStatusMessage('識別完成');
    if (navigator.vibrate) {
      navigator.vibrate([40, 40, 40]);
    }
    speak(`語音識別結果：${transcript}`);
    /** 針對常用關鍵詞提供快速跳轉各主要頁面的語音體驗 */
    const normalized = transcript.toLowerCase();
    if (transcript.includes('健康') || normalized.includes('health')) {
      setVoiceStatusMessage('正在為您開啟健康頁面…');
      setTimeout(() => {
        speak('正在打開健康頁面');
        navigate('/health');
      }, 800);
    } else if (transcript.includes('助手') || normalized.includes('assistant')) {
      setVoiceStatusMessage('正在為您開啟智能助理…');
      setTimeout(() => {
        speak('正在打開智能助理');
        navigate('/assistant');
      }, 800);
    } else if (transcript.includes('家人') || normalized.includes('social')) {
      setVoiceStatusMessage('正在為您開啟家人與社交…');
      setTimeout(() => {
        speak('正在打開家人與社交');
        navigate('/social');
      }, 800);
    } else if (transcript.includes('求助') || normalized.includes('emergency')) {
      setVoiceStatusMessage('正在為您開啟緊急支援…');
      setTimeout(() => {
        speak('正在打開緊急支援');
        navigate('/emergency');
      }, 800);
    }
    stopVoiceRecognition({ reason: 'success', keepPanel: false });
  };

  /** handleVoiceError - 為識別錯誤提供一致化的提醒 */
  const handleVoiceError = (message: string) => {
    setVoiceStatusMessage(message);
    speak('未聽清，請重試');
    stopVoiceRecognition({ reason: 'error', keepPanel: false, message });
  };

  /** startVoiceRecognition - 負責初始化語音識別並刷新視覺與聲音提示 */
  const startVoiceRecognition = () => {
    if (isVoiceListening) {
      return;
    }
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      setVoiceStatusMessage('暫不支援語音識別');
      setIsVoicePanelVisible(true);
      speak('抱歉，您的裝置暫不支援語音識別功能');
      return;
    }
    playStartTone();
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setIsVoicePanelVisible(true);
    setIsVoiceListening(true);
    isVoiceListeningRef.current = true;
    setVoiceCountdown(10);
    setVoiceStatusMessage('請說話…');
    setRecognizedSpeech('');
    recognizedSpeechRef.current = '';

    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = window.setInterval(() => {
      setVoiceCountdown(prev => {
        if (prev <= 1) {
          handleVoiceError('未聽清，請重試');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (waveAnimationRef.current) {
      window.clearInterval(waveAnimationRef.current);
    }
    waveAnimationRef.current = window.setInterval(() => {
      setVoiceWaveHeights(prev => prev.map(() => 28 + Math.floor(Math.random() * 40)));
    }, 180);

    try {
      const recognition = new SpeechRecognitionImpl();
      recognition.lang = 'zh-HK';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript.trim();
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          handleVoiceSuccess(finalTranscript);
        } else if (interimTranscript) {
          setVoiceStatusMessage(`正在識別：${interimTranscript}`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event);
        handleVoiceError('未聽清，請重試');
      };

      recognition.onend = () => {
        if (isVoiceListeningRef.current && !recognizedSpeechRef.current) {
          handleVoiceError('未聽清，請重試');
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition', error);
      handleVoiceError('無法啟動語音識別');
    }
  };

  /** handleVoiceCancel - 使用者主動取消錄音 */
  const handleVoiceCancel = () => {
    setVoiceStatusMessage('錄音已取消');
    stopVoiceRecognition({ reason: 'cancelled', keepPanel: false, message: '錄音已取消' });
  };

  /** handleVoiceStop - 允許使用者按下停止鍵立即結束錄音 */
  const handleVoiceStop = () => {
    setVoiceStatusMessage('錄音已停止');
    stopVoiceRecognition({ reason: 'cancelled', keepPanel: false, message: '錄音已停止' });
  };

  useEffect(() => {
    isVoiceListeningRef.current = isVoiceListening;
  }, [isVoiceListening]);

  useEffect(() => {
    recognizedSpeechRef.current = recognizedSpeech;
  }, [recognizedSpeech]);

  useEffect(() => {
    return () => {
      stopVoiceRecognition({ keepPanel: true });
    };
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isMorning 
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'
    } ${isDarkMode ? 'dark' : ''}`}>
      {/* 顶部导航和问候语区域 - 响应式间距优化 */}
      <div className="px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8">
        {/* 顶部导航栏 - 增强视觉平衡 */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4 group">
            <BrandMascot type="cat" size="lg" mood="happy" animated={true} />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">您的貼心伙伴</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-full p-2 shadow-lg border border-white/40">
              <ThemeToggle size="lg" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-full p-2 shadow-lg border border-white/40">
              <IconButton
                icon="Settings"
                onClick={() => navigate('/settings')}
                variant="soft"
                shape="rounded"
                size="lg"
                tooltip="設置"
              />
            </div>
          </div>
        </div>
        
        {/* 问候语卡片 - 响应式内边距和圆角 */}
        <div className={`bg-gradient-to-br ${greeting.color} rounded-[24px] sm:rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-12 shadow-2xl border border-white/70 backdrop-blur-xl relative overflow-hidden card-gradient-elegant`}>
          {/* 装饰性背景元素 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/15 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">{greeting.icon}</div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 tracking-wide">
              {greeting.text}，{userName}！
            </h1>
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                {currentTime.toLocaleDateString('zh-HK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
                {currentTime.toLocaleTimeString('zh-HK', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {encouragement && (
              <div className="mt-6 sm:mt-10 p-4 sm:p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] backdrop-blur-lg border border-white/50 shadow-lg">
                <p className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200 font-semibold flex items-center justify-center leading-relaxed">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 md:mr-4 text-yellow-500 flex-shrink-0 animate-pulse" />
                  <span className="flex-1">{encouragement}</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-2 sm:ml-3 md:ml-4 text-yellow-500 flex-shrink-0 animate-pulse animation-delay-500" />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 今日关键状态 - 响应式布局优化 */}
      <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-1 h-10 sm:h-12 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">今日狀態</h2>
          </div>
          <div className="flex items-center text-base sm:text-lg text-gray-600 dark:text-gray-300 bg-gradient-to-r from-white/70 to-white/40 dark:from-gray-800/70 dark:to-gray-800/40 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm border border-white/50 shadow-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-500" />
            <span className="font-semibold">整體良好</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {healthStatus.map((status, index) => {
            const IconComponent = status.icon;
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${status.gradient} border-2 ${status.borderColor} rounded-[20px] sm:rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer backdrop-blur-lg card-gradient-elegant group relative overflow-hidden`}
                onClick={() => handleCardClick(status)}
              >
                {/* 装饰性背景元素 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 ${status.bgColor} rounded-[18px] sm:rounded-[20px] md:rounded-[24px] flex items-center justify-center mb-4 sm:mb-5 md:mb-6 border-2 md:border-3 ${status.borderColor} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 ${status.color}`} />
                  </div>
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${status.color} mb-2 sm:mb-3 tracking-wide`}>{status.text}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold mb-3 sm:mb-4">{status.value}</p>
                  <div className="flex items-center space-x-2 sm:space-x-3 bg-white/60 dark:bg-gray-800/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    {status.trend === 'up' && <Icon name="TrendingUp" size="sm" color="success" />}
                    {status.trend === 'stable' && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full animate-pulse" />}
                    {status.trend === 'good' && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />}
                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {status.trend === 'up' && '改善中'}
                      {status.trend === 'stable' && '穩定'}
                      {status.trend === 'good' && '良好'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 主要功能按钮 - 响应式布局优化 */}
      <div className="px-4 sm:px-6 md:px-8 pb-8 sm:pb-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 tracking-wide">快速服務</h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">一鍵訪問常用功能，簡單便捷</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {mainButtons.map((button, index) => {
            const IconComponent = button.icon;
            const buttonVariants = [
              'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600',
              'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600',
              'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600',
              'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600',
              'bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600'
            ];
            
            return (
              <div key={index} className="group relative">
                {/* 背景光晕效果 */}
                <div className={`absolute inset-0 ${buttonVariants[index].split(' ')[0]} ${buttonVariants[index].split(' ')[1]} opacity-20 blur-xl rounded-3xl transform group-hover:scale-110 transition-transform duration-500`} />
                
                <Button
                  onClick={() => handleNavigation(button.path, button.name)}
                  variant={index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'warning'}
                  size="xl"
                  rounded="3xl"
                  shadow="2xl"
                  leftIcon={IconComponent}
                  className={`relative w-full h-32 sm:h-36 md:h-40 ${buttonVariants[index]} text-white border-0 shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
                >
                  {/* 光泽效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center px-2">
                    <div className="mb-2 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 tracking-wide">{button.name}</span>
                    <span className="text-xs sm:text-sm md:text-base opacity-95 font-medium text-center">{button.description}</span>
                  </div>
                  
                  {/* 装饰性粒子效果 */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-ping" />
                    <div className="absolute bottom-6 right-6 w-1 h-1 bg-white/30 rounded-full animate-ping animation-delay-200" />
                    <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping animation-delay-400" />
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOS紧急按钮 - 完美居中的自定义实现（恢复脉冲效果） */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-50 group">
        {/* 多层脉冲动画 - 调整为16x16尺寸 */}
        <div className="absolute -inset-1 bg-red-500 rounded-full opacity-30 animate-ping" />
        <div className="absolute -inset-0.5 bg-red-400 rounded-full opacity-20 animate-ping animation-delay-300" />
        <div className="absolute inset-0 bg-red-300 rounded-full opacity-10 animate-ping animation-delay-600" />
        
        <button
          onClick={handleSOS}
          className="relative w-16 h-16 bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-2xl group-hover:shadow-red-500/40 transition-all duration-300 transform group-hover:scale-110 border-2 border-white/30 rounded-full flex flex-col items-center justify-center group"
          aria-label="緊急求助按鈕"
          aria-pressed="false"
          role="button"
        >
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <Phone className="w-5 h-5 mb-0.5" aria-hidden="true" />
            <span className="text-sm font-bold tracking-wider leading-none" aria-hidden="true">SOS</span>
          </div>
          <span className="sr-only">按此按鈕啟動緊急求助</span>
          
          {/* 紧急闪烁粒子 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute top-2 left-2 w-1 h-1 bg-white/80 rounded-full animate-ping" />
            <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-white/60 rounded-full animate-ping animation-delay-200" />
            <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping animation-delay-400" />
          </div>
        </button>
        
        {/* 工具提示 */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          緊急求助
        </div>
      </div>

      {/* 智能語音助手啟動區域 - 底部中央麥克風 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center space-y-3">
        {lastVoiceTranscript && (
          <div className="px-4 py-2 bg-white/80 dark:bg-gray-900/80 border border-indigo-200 dark:border-indigo-500 text-indigo-800 dark:text-indigo-200 rounded-2xl shadow-lg backdrop-blur-sm text-sm font-medium max-w-xs text-center">
            語音識別結果：「{lastVoiceTranscript}」
          </div>
        )}
        <button
          type="button"
          onClick={startVoiceRecognition}
          disabled={isVoiceListening}
          aria-pressed={isVoiceListening}
          aria-label="啟動語音助手"
          role="button"
          className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_20px_35px_-15px_rgba(99,102,241,0.7)] transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center overflow-hidden ${
            isVoiceListening ? 'scale-105 animate-pulse' : 'hover:scale-105'
          }`}
        >
          <span className="absolute inset-0 bg-white/25 opacity-0 hover:opacity-20 transition-opacity duration-300" />
          <span className={`absolute inset-0 rounded-full bg-indigo-400/20 blur-2xl ${isVoiceListening ? 'animate-ping' : ''}`} />
          <Mic className="w-8 h-8 sm:w-10 sm:h-10 relative z-10" aria-hidden="true" />
          <span className="sr-only">點擊啟動語音助手識別</span>
        </button>
      </div>

      {/* 底部装饰 - 温暖渐变 */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/60 dark:from-gray-900/60 via-transparent to-transparent pointer-events-none" />
      {/* 品牌吉祥物 - 优化位置 */}
      <div className="fixed bottom-16 left-12 opacity-30 pointer-events-none group">
        {/* 对话泡泡 */}
        <div className="absolute -top-16 left-16 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-sm text-gray-700 dark:text-gray-300">需要幫忙嗎？</p>
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-200 dark:border-gray-600" />
        </div>
      </div>

      {/* 語音識別浮層 - 參照設計稿提供動態波形與控制 */}
      {isVoicePanelVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-slate-900/80 via-slate-800/75 to-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.7)] text-white">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold tracking-wide">{voiceStatusMessage}</p>
              <div className="text-sm font-medium text-sky-200">
                00:{voiceCountdown.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="mt-6 h-32 flex items-end justify-center space-x-2">
              {voiceWaveHeights.map((height, index) => (
                <div
                  key={index}
                  className={`w-2 sm:w-2.5 rounded-full bg-gradient-to-b from-cyan-200 via-blue-400 to-purple-500 transition-all duration-150 ${
                    isVoiceListening ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>

            {recognizedSpeech && (
              <p className="mt-6 text-base text-indigo-100 text-center leading-relaxed">
                「{recognizedSpeech}」
              </p>
            )}

            <div className="mt-8 flex items-center justify-center">
              <button
                type="button"
                onClick={handleVoiceStop}
                className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-[0_20px_40px_-18px_rgba(239,68,68,0.8)] text-white transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400/60"
                aria-label="停止語音識別"
                role="button"
              >
                <Square className="w-7 h-7" aria-hidden="true" />
                <span className="sr-only">停止錄音</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantHome;
