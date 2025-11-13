import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMascot } from '../components/BrandMascot';
import { Button, IconButton } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const ElegantAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { speak, fontSize, highContrast } = useAccessibility();
  const { isDarkMode } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '您好！我是您的智能助手，有什麼我可以幫助您的嗎？',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // 模拟语音识别
  const startListening = () => {
    setIsListening(true);
    speak('請說話');
    
    // 模拟语音识别过程
    setTimeout(() => {
      setIsListening(false);
      const mockMessages = [
        '今日天氣如何？',
        '提醒我食藥',
        '打電話給女兒',
        '今日身體狀況如何？',
        '附近有什麼活動？'
      ];
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      setInputMessage(randomMessage);
    }, 3000);
  };

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const responses = {
        '今日天氣如何？': '今日天氣晴朗，氣溫22-28度，適合外出活動。記得做好防曬措施喔！',
        '提醒我食藥': '好的，我會在下午3點提醒您食降血壓藥。請確保飯後服用！',
        '打電話給女兒': '正在為您撥打女兒陳小姐的電話...',
        '今日身體狀況如何？': '根據您的健康數據，今日血壓和心跳都在正常範圍內，繼續保持！',
        '附近有什麼活動？': '社區中心今日下午有太極班，明日早上有歌唱活動，您有興趣參加嗎？'
      };

      const botResponse = responses[inputMessage] || '我明白了，讓我為您查詢相關信息。';
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (soundEnabled) {
        speak(botResponse);
      }
    }, 1000);
  };

  // 切换声音
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    speak(soundEnabled ? '聲音已關閉' : '聲音已開啟');
  };

  // 快速回复选项
  const quickReplies = [
    { text: '天氣查詢', icon: 'Sun' },
    { text: '用藥提醒', icon: 'Pill' },
    { text: '聯絡家人', icon: 'Phone' },
    { text: '健康狀況', icon: 'Heart' },
    { text: '社區活動', icon: 'Users' },
    { text: '緊急求助', icon: 'Phone' }
  ];

  const handleQuickReply = (reply: any) => {
    setInputMessage(`我想了解${reply.text}`);
    if (soundEnabled) {
      speak(`我想了解${reply.text}`);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* 顶部导航 */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <IconButton
              icon="ArrowLeft"
              onClick={() => navigate('/home')}
              variant="ghost"
              shape="rounded"
              size="md"
              tooltip="返回主頁"
              className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-blue-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 shadow-md hover:shadow-lg"
              aria-label="返回主頁"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">智能助手</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">語音對話，貼心陪伴</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle size="md" />
            <BrandMascot type="bird" size="sm" mood="happy" animated={true} />
          </div>
        </div>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 px-6 pb-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm h-96 overflow-hidden">
          {/* 消息列表 */}
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* 头像 */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <Icon name="User" size="sm" />
                    ) : (
                      <Icon name="Bot" size="sm" />
                    )}
                  </div>
                  
                  {/* 消息内容 */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                  }`}>
                    <p className="text-base">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快速回复按钮 */}
      <div className="px-6 pb-4">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">快速回復</p>
          <div className="grid grid-cols-3 gap-3">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                onClick={() => handleQuickReply(reply)}
                variant="soft"
                size="sm"
                rounded="lg"
                className="flex flex-col items-center justify-center h-16"
              >
                <Icon name={reply.icon as any} size="md" />
                <span className="text-xs mt-1 font-medium">{reply.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="px-6 pb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm p-4">
          <div className="flex items-center space-x-3">
            {/* 语音输入按钮 */}
            <IconButton
              icon={isListening ? "MicOff" : "Mic"}
              onClick={startListening}
              variant={isListening ? 'danger' : 'secondary'}
              shape="circle"
              size="md"
              animation={isListening ? 'pulse' : 'none'}
              tooltip={isListening ? '停止錄音' : '開始語音'}
              aria-label={isListening ? '停止語音錄音' : '開始語音輸入'}
              aria-pressed={isListening}
            />
            
            {/* 文本输入 */}
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? '正在聆聽...' : '輸入您的問題...'}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                disabled={isListening}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
            </div>
            
            {/* 声音开关 */}
            <IconButton
              icon={soundEnabled ? "Volume2" : "VolumeX"}
              onClick={toggleSound}
              variant="ghost"
              shape="circle"
              size="md"
              tooltip={soundEnabled ? '關閉聲音' : '開啟聲音'}
            />
            
            {/* 发送按钮 */}
            <IconButton
              icon="Send"
              onClick={sendMessage}
              variant="primary"
              shape="circle"
              size="md"
              disabled={!inputMessage.trim() || isListening}
              tooltip="發送消息"
              aria-label="發送消息"
            />
          </div>
        </div>
      </div>

      {/* 状态指示器 */}
      {isListening && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50">
          <div className="flex items-center space-x-3">
            <Icon name="Mic" size="lg" animation="pulse" />
            <span className="text-lg font-medium">正在聆聽...</span>
          </div>
        </div>
      )}

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 dark:from-gray-900/50 to-transparent pointer-events-none" />
      
      {/* 品牌吉祥物 */}
      <div className="fixed bottom-24 left-8 opacity-40 pointer-events-none">
        <BrandMascot type="cat" size="sm" mood="caring" animated={true} />
      </div>
    </div>
  );
};

export default ElegantAIAssistant;