import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Settings, MessageCircle, Phone, CloudRain, Calendar, Pill, Newspaper } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [emergencyKeyword, setEmergencyKeyword] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const emergencyKeywords = [
    '頭暈', '胸痛', '胸悶', '呼吸困難', '跌倒', '暈倒', 
    '不舒服', '痛', '暈', '救命', '緊急', '危險'
  ];

  const quickActions = [
    { name: '查天氣', icon: CloudRain, command: '今日天氣點樣？' },
    { name: '設提醒', icon: Calendar, command: '提醒我食藥' },
    { name: '問用藥', icon: Pill, command: '我幾時要食藥？' },
    { name: '叫女兒', icon: Phone, command: '打電話俾女兒' },
    { name: '聽新聞', icon: Newspaper, command: '播放今日新聞' }
  ];

  useEffect(() => {
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-HK';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        setTranscript(finalTranscript);
        
        // 检测紧急关键词
        const detectedKeyword = emergencyKeywords.find(keyword => 
          finalTranscript.includes(keyword)
        );
        
        if (detectedKeyword) {
          setEmergencyKeyword(detectedKeyword);
          setShowEmergencyConfirm(true);
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript && !showEmergencyConfirm) {
          processCommand(transcript);
        }
      };
    }

    // 初始化语音合成
    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [transcript, showEmergencyConfirm]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current) {
      setResponse(text);
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-HK';
      utterance.rate = 0.8; // 较慢的语速
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  const processCommand = (command: string) => {
    let responseText = '';
    
    if (command.includes('天氣') || command.includes('溫度')) {
      responseText = '今日天氣晴朗，氣溫22至28度，濕度65%，適合外出活動。記得帶遮陽帽。';
    } else if (command.includes('提醒') || command.includes('食藥')) {
      responseText = '已為您設定用藥提醒：每日上午8時、下午2時、晚上8時。我會準時提醒您。';
    } else if (command.includes('女兒') || command.includes('打電話')) {
      responseText = '正在為您撥打女兒陳小玲的電話，請稍候。';
    } else if (command.includes('新聞')) {
      responseText = '今日要聞：香港天氣持續晴朗，長者中心有太極班活動，歡迎參加。';
    } else if (command.includes('幾時') && command.includes('藥')) {
      responseText = '您下一次用藥時間是下午2時，還有1小時30分鐘。記得飯後服用。';
    } else {
      responseText = '我明白了，讓我為您處理。如有需要，我可以聯絡您的家人或醫護人員。';
    }
    
    speak(responseText);
  };

  const handleQuickAction = (command: string) => {
    processCommand(command);
  };

  const confirmEmergency = () => {
    setShowEmergencyConfirm(false);
    speak('正在為您聯絡醫護人員，同時通知您的家人。請保持冷靜，救援即將到達。');
    // 这里可以添加实际的紧急联系逻辑
  };

  const cancelEmergency = () => {
    setShowEmergencyConfirm(false);
    setEmergencyKeyword('');
    speak('已取消緊急求助。如果您仍然感到不適，請隨時告訴我。');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* 头部 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">AI 語音助理</h1>
        <p className="text-xl text-gray-600">我可以幫您查詢、提醒和聯絡家人</p>
      </div>

      {/* 主要语音界面 */}
      <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg">
        <div className="text-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>
          
          <p className="text-2xl font-semibold mt-4 text-gray-800">
            {isListening ? '正在聆聽...' : '點擊開始對話'}
          </p>
        </div>

        {/* 语音识别结果 */}
        {transcript && (
          <div className="bg-gray-100 rounded-2xl p-4 mb-4">
            <p className="text-xl text-gray-800">您說：{transcript}</p>
          </div>
        )}

        {/* AI回复 */}
        {response && (
          <div className="bg-blue-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <Volume2 className={`w-6 h-6 text-blue-600 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
              <span className="text-xl font-semibold text-blue-800">助理回覆：</span>
            </div>
            <p className="text-xl text-blue-800">{response}</p>
          </div>
        )}
      </div>

      {/* 快速操作按钮 */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">快速操作</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.command)}
                className="bg-white hover:bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <IconComponent className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-xl font-semibold text-gray-800">{action.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 紧急确认对话框 */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">檢測到緊急情況</h3>
              <p className="text-xl text-gray-600 mb-4">
                您提到「{emergencyKeyword}」，是否需要聯絡醫護人員？
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={confirmEmergency}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl p-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                是，聯絡醫護人員
              </button>
              <button
                onClick={cancelEmergency}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl p-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                否，取消求助
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className="bg-yellow-50 rounded-2xl p-4">
        <p className="text-lg text-yellow-800 text-center">
          💡 提示：我可以理解粵語，說話時請保持正常語速
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;