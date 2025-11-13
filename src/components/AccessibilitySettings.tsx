import React, { useState, useEffect, createContext, useContext } from 'react';
import { Settings, Volume2, Sun, Moon, Maximize2, Minimize2, Palette, Eye, Mic, XCircle } from 'lucide-react';

interface AccessibilityContextType {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  voiceNavigation: boolean;
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
  setHighContrast: (enabled: boolean) => void;
  setVoiceNavigation: (enabled: boolean) => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('large');
  const [highContrast, setHighContrast] = useState(false);
  const [voiceNavigation, setVoiceNavigation] = useState(true);

  const speak = (text: string) => {
    if ('speechSynthesis' in window && voiceNavigation) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-HK';
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // 应用字体大小和高对比度设置到根元素
    const root = document.documentElement;
    
    // 字体大小映射
    const fontSizeMap = {
      'small': '16px',
      'medium': '20px',
      'large': '24px',
      'extra-large': '28px'
    };
    
    root.style.fontSize = fontSizeMap[fontSize];
    
    // 高对比度模式
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // 保存设置到本地存储
    localStorage.setItem('accessibility-settings', JSON.stringify({
      fontSize,
      highContrast,
      voiceNavigation
    }));
  }, [fontSize, highContrast, voiceNavigation]);

  useEffect(() => {
    // 从本地存储加载设置
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.highContrast !== undefined) setHighContrast(settings.highContrast);
        if (settings.voiceNavigation !== undefined) setVoiceNavigation(settings.voiceNavigation);
      } catch (e) {
        console.log('無法加載無障礙設置');
      }
    }
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      highContrast,
      voiceNavigation,
      setFontSize,
      setHighContrast,
      setVoiceNavigation,
      speak
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

const AccessibilitySettings: React.FC = () => {
  const { fontSize, highContrast, voiceNavigation, setFontSize, setHighContrast, setVoiceNavigation, speak } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const fontSizeOptions = [
    { value: 'small', label: '小字體', description: '16px' },
    { value: 'medium', label: '中字體', description: '20px' },
    { value: 'large', label: '大字體', description: '24px' },
    { value: 'extra-large', label: '特大字體', description: '28px' }
  ];

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    setFontSize(size);
    speak(`字體大小已設置為${size === 'small' ? '小' : size === 'medium' ? '中' : size === 'large' ? '大' : '特大'}字體`);
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    speak(newValue ? '高對比度模式已開啟' : '高對比度模式已關閉');
  };

  const handleVoiceNavigationToggle = () => {
    const newValue = !voiceNavigation;
    setVoiceNavigation(newValue);
    speak(newValue ? '語音導航已開啟' : '語音導航已關閉');
  };

  const handleMouseEnter = (element: string) => {
    if (voiceNavigation) {
      speak(element);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-2xl flex flex-col items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95"
        onMouseEnter={() => handleMouseEnter('無障礙設置')}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* 设置面板 */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 bg-white rounded-3xl shadow-2xl p-6 w-80 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">無障礙設置</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* 字体大小设置 */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Maximize2 className="w-6 h-6 text-purple-600 mr-3" />
              <h4 className="text-xl font-semibold text-gray-800">字體大小</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value as any)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    fontSize === option.value
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  onMouseEnter={() => handleMouseEnter(`字體大小：${option.label}`)}
                >
                  <div className="text-lg font-semibold mb-1">{option.label}</div>
                  <div className="text-sm opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 高对比度设置 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Palette className="w-6 h-6 text-purple-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-800">高對比度</h4>
              </div>
              <button
                onClick={handleHighContrastToggle}
                className={`w-16 h-8 rounded-full transition-all duration-200 ${
                  highContrast ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-all duration-200 transform ${
                  highContrast ? 'translate-x-8' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <p className="text-base text-gray-600">
              {highContrast ? '已開啟高對比度模式' : '關閉高對比度模式'}
            </p>
          </div>

          {/* 语音导航设置 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Volume2 className="w-6 h-6 text-purple-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-800">語音導航</h4>
              </div>
              <button
                onClick={handleVoiceNavigationToggle}
                className={`w-16 h-8 rounded-full transition-all duration-200 ${
                  voiceNavigation ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-all duration-200 transform ${
                  voiceNavigation ? 'translate-x-8' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <p className="text-base text-gray-600">
              {voiceNavigation ? '已開啟語音導航' : '關閉語音導航'}
            </p>
          </div>

          {/* 快速测试 */}
          <button
            onClick={() => speak('這是語音測試，如果您能聽到這段話，表示語音功能正常運作。')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95"
            onMouseEnter={() => handleMouseEnter('語音測試')}
          >
            <Mic className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold">語音測試</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilitySettings;