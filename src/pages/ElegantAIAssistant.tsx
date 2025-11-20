import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Bot,
  CalendarDays,
  CheckCircle,
  Droplets,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import useAIStore from '../store/ai';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useTheme } from '../contexts/ThemeContext';
import { BrandMascot } from '../components/BrandMascot';
import { IconButton } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const quickReplies = [
  { text: 'Weather Query' },
  { text: 'Medication Reminder' },
  { text: 'Contact Family' },
  { text: 'Health Status' },
  { text: 'Community Activities' },
  { text: 'Emergency Help' }
] as const;

type QuickReply = (typeof quickReplies)[number];

type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

const ElegantAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { aiInput?: string } };
  const { speak } = useAccessibility();
  const { isDarkMode } = useTheme();
  const { setAdvice } = useAIStore();

  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    type: 'bot',
    content: 'Hello! I am your intelligent assistant. How can I help you today?',
    timestamp: new Date()
  }]);

  const idSeqRef = useRef(1);
  const initRef = useRef(false);

  const nextId = () => {
    idSeqRef.current += 1;
    return idSeqRef.current;
  };

  const startListening = () => {
    setIsListening(true);
    speak('Please speak');
    setTimeout(() => {
      setIsListening(false);
      const mockMessages = [
        'How is the weather today?',
        'Remind me to take medicine',
        'Call my daughter',
        'How is my health condition today?',
        'What activities are nearby?'
      ];
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      setInputMessage(randomMessage);
    }, 3000);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: nextId(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const responses: Record<string, string> = {
        'How is the weather today?': 'The weather today is sunny, with temperatures between 22-28°C, perfect for outdoor activities. Remember to use sunscreen!',
        'Remind me to take medicine': 'Okay, I will remind you to take your blood pressure medication at 3 PM. Please make sure to take it after meals!',
        'Call my daughter': 'Calling your daughter Miss Chan...',
        'How is my health condition today?': 'According to your health data, your blood pressure and heart rate are within normal ranges today. Keep it up!',
        'What activities are nearby?': 'The community center has a Tai Chi class this afternoon, and there is a singing activity tomorrow morning. Would you like to join?'
      };

      const botResponse = responses[newMessage.content] || 'I understand. Let me look up the relevant information for you.';

      const botMessage: Message = {
        id: nextId(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);

      if (soundEnabled) {
        speak(botResponse);
      }
    }, 1000);
  };

  const analyzeWithModel = async (prompt: string): Promise<{ text: string; source: 'deepseek' | 'openrouter' | 'local' | 'error' }> => {
    const apiUrl = import.meta.env.VITE_DEEPSEEK_API_URL;
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

    try {
      if (!apiUrl || !apiKey) {
        const fallback = `(Development environment: Model API not configured. The following are local rule-based suggestions)\n- Maintain regular schedule and moderate exercise\n- Monitor blood pressure and heart rate, contact doctor if abnormal\n- Take medication on time and stay hydrated\n- LDL slightly high, improve diet (low oil, low salt)`;
        return { text: fallback, source: 'local' };
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a health care assistant. Please provide clear, actionable advice and risk warnings based on the provided data.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!res.ok) {
        if (res.status === 402) {
          const orUrl = import.meta.env.VITE_OPENROUTER_API_URL;
          const orKey = import.meta.env.VITE_OPENROUTER_API_KEY;
          if (orUrl && orKey) {
            const fallbackRes = await fetch(orUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${orKey}`
              },
              body: JSON.stringify({
                model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
                messages: [
                  { role: 'system', content: 'You are a health care assistant. Please provide clear, actionable advice and risk warnings based on the provided data.' },
                  { role: 'user', content: prompt }
                ]
              })
            });
            if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
            const fallbackData = await fallbackRes.json();
            const text = fallbackData?.choices?.[0]?.message?.content || JSON.stringify(fallbackData);
            return { text, source: 'openrouter' };
          }
          throw new Error('HTTP 402');
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      return { text, source: 'deepseek' };
    } catch (error: any) {
      return { text: `An error occurred during analysis: ${error.message || error}`, source: 'error' };
    }
  };

  useEffect(() => {
    const aiInput = location?.state?.aiInput;
    if (initRef.current || !aiInput) return;
    initRef.current = true;

    const intro: Message = {
      id: nextId(),
      type: 'user',
      content: aiInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, intro]);
    setAnalyzing(true);

    (async () => {
      const result = await analyzeWithModel(aiInput);
      const reply: Message = {
        id: nextId(),
        type: 'bot',
        content: result.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, reply]);
      setAdvice(result.text, result.source);
      setAnalyzing(false);
      if (soundEnabled) speak(result.text);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.aiInput]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('userSettings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.soundEffects === 'boolean') {
          setSoundEnabled(parsed.soundEffects);
        }
      }
    } catch {
      /* no-op */
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    speak(soundEnabled ? 'Sound disabled' : 'Sound enabled');
  };

  const handleQuickReply = (reply: QuickReply) => {
    const content = `I want to know about ${reply.text}`;
    setInputMessage(content);
    if (soundEnabled) {
      speak(content);
    }
  };

  const lastReplyTime = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last) return '--:--';
    try {
      return last.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  }, [messages]);

  const heroHighlights = useMemo(() => [
    { label: 'Voice mode', value: isListening ? 'Listening live' : 'Tap mic to start', Icon: isListening ? Mic : MicOff },
    { label: 'Audio reply', value: soundEnabled ? 'Sound on' : 'Muted', Icon: soundEnabled ? Volume2 : VolumeX },
    { label: 'Last reply', value: lastReplyTime, Icon: MessageCircle }
  ], [isListening, soundEnabled, lastReplyTime]);

  const statusSnapshot = useMemo(() => [
    { label: 'Voice capture', state: isListening ? 'Listening now' : 'Standby', Icon: Mic, active: isListening },
    { label: 'AI reasoning', state: analyzing ? 'Analyzing request' : 'Ready for next question', Icon: Sparkles, active: analyzing },
    { label: 'Audio feedback', state: soundEnabled ? 'Voice guidance enabled' : 'Muted for quiet mode', Icon: soundEnabled ? Volume2 : VolumeX, active: soundEnabled }
  ], [isListening, analyzing, soundEnabled]);

  const wellnessHighlights = useMemo(() => [
    { title: 'Medication adherence', value: 'On track', detail: 'Morning pill confirmed at 09:00', Icon: CheckCircle },
    { title: 'Vital signs', value: 'Stable today', detail: 'BP 128/82 · HR 72 bpm', Icon: Activity },
    { title: 'Next reminder', value: lastReplyTime !== '--:--' ? lastReplyTime : 'Set a schedule', detail: 'AI keeps you informed', Icon: CalendarDays }
  ], [lastReplyTime]);

  const careTips = [
    { title: 'Hydration check', detail: 'Sip a cup of warm water after medication.', Icon: Droplets },
    { title: 'Protect joints', detail: 'Stretch wrists and ankles for 2 minutes.', Icon: ShieldCheck },
    { title: 'Call for support', detail: 'Family hotline is ready if you feel unwell.', Icon: Phone }
  ];

  const supportContacts = [
    { name: 'Daughter Anna', relation: 'Family caregiver', status: 'Online now · can respond quickly.' },
    { name: 'Nurse Lam', relation: 'Community nurse', status: 'Weekday coverage · replies < 30 min.' }
  ];

  const liveToast = isListening
    ? { Icon: Mic, message: 'Listening...', detail: 'Capturing your question with clarity.' }
    : { Icon: Sparkles, message: 'AI is analyzing...', detail: 'Preparing thoughtful guidance for you.' };
  const ToastIcon = liveToast.Icon;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <header>
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <IconButton
                    icon="ArrowLeft"
                    onClick={() => navigate('/home')}
                    variant="ghost"
                    shape="rounded"
                    size="md"
                    tooltip="Back to Home"
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    aria-label="Back to Home"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">ActiveAge companion</p>
                    <h1 className="text-3xl font-bold mt-2">AI Assistant</h1>
                    <p className="text-white/80 mt-2 max-w-xl">
                      Voice conversation, caring companion, and daily wellness coaching designed for seniors and families.
                    </p>
                  </div>
                </div>
                <BrandMascot type="bird" size="md" mood="happy" animated={true} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroHighlights.map((stat) => {
                  const StatIcon = stat.Icon;
                  return (
                    <div key={stat.label} className="bg-white/15 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur">
                      <div className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center">
                        <StatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[2.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            <section className="bg-white/90 dark:bg-gray-900/70 rounded-3xl border border-white/60 dark:border-gray-800 shadow-xl">
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversation</p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your caring assistant</h2>
                </div>
                {analyzing && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
                    Analyzing
                  </span>
                )}
              </div>
              <div className="h-[28rem] overflow-y-auto px-6 pt-4 pb-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-3 max-w-lg ${message.type === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        }`}
                      >
                        {message.type === 'user' ? <Icon name="User" size="sm" /> : <Icon name="Bot" size="sm" />}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 text-left ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white rounded-br-xl'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-xl'
                        }`}
                      >
                        <p className="text-base leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white/80 dark:bg-gray-900/60 rounded-3xl border border-white/60 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Suggested prompts</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">Tap to auto-fill</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickReplies.map((reply) => (
                  <button
                    type="button"
                    key={reply.text}
                    onClick={() => handleQuickReply(reply)}
                    className="px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/70 rounded-3xl border border-white/60 dark:border-gray-800 shadow-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Compose message</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{soundEnabled ? 'Voice feedback on' : 'Muted mode'}</span>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex items-center gap-3 flex-1">
                  <IconButton
                    icon={isListening ? 'MicOff' : 'Mic'}
                    onClick={startListening}
                    variant={isListening ? 'danger' : 'secondary'}
                    shape="circle"
                    size="md"
                    animation={isListening ? 'pulse' : 'none'}
                    tooltip={isListening ? 'Stop Recording' : 'Start Voice'}
                    aria-label={isListening ? 'Stop voice recording' : 'Start voice input'}
                    aria-pressed={isListening}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isListening ? 'Listening...' : 'Enter your question...'}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-100"
                      disabled={isListening}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IconButton
                    icon={soundEnabled ? 'Volume2' : 'VolumeX'}
                    onClick={toggleSound}
                    variant="ghost"
                    shape="circle"
                    size="md"
                    tooltip={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                  />
                  <IconButton
                    icon="Send"
                    onClick={sendMessage}
                    variant="primary"
                    shape="circle"
                    size="md"
                    disabled={!inputMessage.trim() || isListening}
                    tooltip="Send Message"
                    aria-label="Send Message"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white/90 dark:bg-gray-900/70 rounded-3xl border border-white/60 dark:border-gray-800 shadow-xl p-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Assistant status</p>
              <div className="space-y-4">
                {statusSnapshot.map((entry) => {
                  const StatusIcon = entry.Icon;
                  return (
                    <div key={entry.label} className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 px-3 py-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            entry.active
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{entry.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{entry.state}</p>
                        </div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${entry.active ? 'bg-blue-500' : 'bg-gray-400'}`} />
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-violet-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border border-white/50 dark:border-gray-800 shadow-xl p-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Daily insights</p>
              <div className="space-y-4">
                {wellnessHighlights.map((item) => {
                  const InsightIcon = item.Icon;
                  return (
                    <div key={item.title} className="flex items-start space-x-3 rounded-2xl bg-white/70 dark:bg-gray-900/60 px-4 py-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-100 flex items-center justify-center">
                        <InsightIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/70 rounded-3xl border border-white/60 dark:border-gray-800 shadow-xl p-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Care tips & contacts</p>
              <div className="space-y-4">
                {careTips.map((tip) => {
                  const TipIcon = tip.Icon;
                  return (
                    <div key={tip.title} className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-100 flex items-center justify-center">
                        <TipIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tip.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tip.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                {supportContacts.map((contact) => (
                  <div key={contact.name} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{contact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.relation}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 text-right max-w-[9rem]">{contact.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {(isListening || analyzing) && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50">
          <ToastIcon className="w-6 h-6" />
          <div>
            <p className="text-sm font-semibold">{liveToast.message}</p>
            <p className="text-xs text-white/80">{liveToast.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantAIAssistant;
