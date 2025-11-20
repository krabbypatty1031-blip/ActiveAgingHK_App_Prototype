import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Pill, Phone, Mic, Settings, Sparkles, TrendingUp, Square, XCircle, Users, ChevronLeft, ChevronRight, Bell, Calendar, Stethoscope, Sun, Moon, CloudSun, Coffee, Book, Dumbbell, Music, Utensils } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useTheme } from '../contexts/ThemeContext';
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
  const [userName] = useState('Mrs. Chan');
  const [weather] = useState({ temp: 24, condition: 'Sunny', icon: '☀️' }); // Weather state
  const [encouragement, setEncouragement] = useState('');
  const [isMorning, setIsMorning] = useState(true);
  const [isVoicePanelVisible, setIsVoicePanelVisible] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceCountdown, setVoiceCountdown] = useState(10);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState('Please speak...');
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState('');
  const [voiceWaveHeights, setVoiceWaveHeights] = useState<number[]>([36, 52, 44, 58, 40, 47, 55]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
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
    
    // Set a daily encouragement message to keep morale high.
    const encouragements = [
      'Feeling great today! Keep smiling 😊',
      'Well done! Keep up the healthy lifestyle 💪',
      'Health comes first! Remember to rest 🌸',
      'Your persistence is inspiring! Keep it up 👏'
    ];
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [currentTime]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    // Morning: Warm Amber/Gold
    if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-12 h-12 text-amber-500" />, color: 'bg-amber-50 border-amber-100' }; 
    // Afternoon: Cozy Orange/Terracotta
    if (hour < 18) return { text: 'Good Afternoon', icon: <CloudSun className="w-12 h-12 text-orange-500" />, color: 'bg-orange-50 border-orange-100' }; 
    // Evening: Soft Stone/Mauve
    return { text: 'Good Evening', icon: <Moon className="w-12 h-12 text-stone-500" />, color: 'bg-stone-100 border-stone-200' }; 
  };

  const greeting = getGreeting();

  const dailyActivities = [
    { title: 'Morning Walk', time: '08:00 AM', location: 'Victoria Park', icon: Sun, color: 'text-amber-700', bg: 'bg-[#FFF8E1]', border: 'border-amber-200' },
    { title: 'Tea Time', time: '10:00 AM', location: 'Community Café', icon: Coffee, color: 'text-orange-700', bg: 'bg-[#FFF3E0]', border: 'border-orange-200' },
    { title: 'Lunch with Family', time: '12:30 PM', location: 'Dim Sum Restaurant', icon: Utensils, color: 'text-rose-700', bg: 'bg-[#FFEBEE]', border: 'border-rose-200' },
    { title: 'Reading Club', time: '02:00 PM', location: 'Library Room 3', icon: Book, color: 'text-stone-700', bg: 'bg-[#EFEBE9]', border: 'border-stone-200' },
    { title: 'Community Center', time: '03:00 PM', location: 'Activity Room B', icon: Sparkles, color: 'text-indigo-700', bg: 'bg-[#E8EAF6]', border: 'border-indigo-200' },
    { title: 'Gentle Exercise', time: '04:30 PM', location: 'Fitness Corner', icon: Dumbbell, color: 'text-emerald-700', bg: 'bg-[#E8F5E9]', border: 'border-emerald-200' },
    { title: 'Music Therapy', time: '06:00 PM', location: 'Wellness Center', icon: Music, color: 'text-purple-700', bg: 'bg-[#F3E5F5]', border: 'border-purple-200' },
  ];
  const totalSlides = dailyActivities.length;
  const extendedActivities = useMemo(() => {
    if (!totalSlides) return [];
    const first = dailyActivities[0];
    const last = dailyActivities[totalSlides - 1];
    return [last, ...dailyActivities, first];
  }, [dailyActivities, totalSlides]);

  useEffect(() => {
    if (totalSlides) {
      setCurrentSlide(1);
    }
  }, [totalSlides]);

  const todaySchedule = [
    { name: 'Vitamin D', time: '10:00 PM', note: '1 pill | Every 24 hours', status: 'missed' as const },
    { name: 'Blood Pressure Meds', time: '02:00 PM', note: '1 tsp | Every 4 hours', status: 'upcoming' as const },
    { name: 'Vitamin C', time: '05:00 PM', note: '2 pills | Every 6 hours', status: 'taken' as const },
  ];

  const healthStatus = [
    { 
      icon: Heart, 
      text: 'Heart Rate', 
      value: '72 bpm',
      color: 'text-rose-700', 
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      trend: 'stable',
      progress: 100,
      progressColor: 'bg-rose-400'
    },
    { 
      icon: Bed, 
      text: 'Sleep', 
      value: '7 Hours',
      color: 'text-indigo-700', 
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      trend: 'up',
      progress: 85,
      progressColor: 'bg-indigo-400'
    },
    { 
      icon: Pill, 
      text: 'Meds', 
      value: 'On Track',
      color: 'text-amber-700', 
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      trend: 'good',
      progress: 66,
      progressColor: 'bg-amber-400'
    }
  ];

  const mainButtons = [
    { 
      name: 'Health Status', 
      icon: Heart, 
      color: 'bg-[#E8F5E9] text-emerald-800 border-emerald-100', // Sage/Green
      path: '/health',
      description: 'View Health Data'
    },
    { 
      name: 'Voice Assistant', 
      icon: Mic, 
      color: 'bg-[#FFF3E0] text-orange-800 border-orange-100', // Warm Orange
      path: '/assistant',
      description: 'Smart Voice Helper'
    },
    { 
      name: 'Emergency SOS', 
      icon: Phone, 
      color: 'bg-[#FFEBEE] text-red-800 border-red-100', // Soft Red
      path: '/emergency',
      description: 'Emergency Support'
    },
    { 
      name: 'Family Contact', 
      icon: Settings, 
      color: 'bg-[#F3E5F5] text-purple-800 border-purple-100', // Soft Purple
      path: '/social',
      description: 'Stay connected'
    },
    { 
      name: 'Caregiver', 
      icon: Users, 
      color: 'bg-[#E0F7FA] text-cyan-800 border-cyan-100', // Soft Cyan
      path: '/family',
      description: 'Caregiver Info'
    },
    {
      name: 'Clinic & Doctor',
      icon: Stethoscope,
      color: 'bg-[#E1F5FE] text-sky-800 border-sky-100', // Soft Sky
      path: '/doctor',
      description: 'Appointments'
    }
  ];

  const handleNavigation = (path: string, name: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    speak(`Opening ${name}`);
    navigate(path);
  };

  const handleSOS = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    speak('Emergency SOS mode activated');
    navigate('/emergency');
  };

  const handleCardClick = (status: any) => {
    speak(`${status.text}, ${status.value}`);
  };

  const normalizedSlide = totalSlides ? (currentSlide - 1 + totalSlides) % totalSlides : 0;

  const pauseAutoPlay = () => {
    if (!totalSlides) return;
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = window.setTimeout(() => setIsPaused(false), 8000);
  };

  const handlePrevSlide = () => {
    if (!totalSlides) return;
    pauseAutoPlay();
    if (navigator.vibrate) navigator.vibrate(30);
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };

  const handleNextSlide = () => {
    if (!totalSlides) return;
    pauseAutoPlay();
    if (navigator.vibrate) navigator.vibrate(30);
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const handleDotNavigation = (index: number) => {
    if (!totalSlides) return;
    pauseAutoPlay();
    setIsTransitioning(true);
    setCurrentSlide(index + 1);
  };

  useEffect(() => {
    if (!totalSlides || isPaused) {
      return () => undefined;
    }

    autoPlayRef.current = window.setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev + 1);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isPaused, totalSlides]);

  const handleTransitionEnd = () => {
    if (!totalSlides) return;
    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(totalSlides);
    } else if (currentSlide === totalSlides + 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      return () => undefined;
    }
    let raf1: number;
    let raf2: number;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    });
    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [isTransitioning]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  /** playStartTone - Soft indicator sound when recording starts */
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

  /** stopVoiceRecognition - Release resources and update visuals when recognition ends */
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

  /** handleVoiceSuccess - Provide feedback when recognition succeeds */
  const handleVoiceSuccess = (transcript: string) => {
    setRecognizedSpeech(transcript);
    setLastVoiceTranscript(transcript);
    setVoiceStatusMessage('Recognition Complete');
    if (navigator.vibrate) {
      navigator.vibrate([40, 40, 40]);
    }
    speak(`Voice recognition result: ${transcript}`);
    /** Offer quick navigation for common keywords */
    const normalized = transcript.toLowerCase();
    if (normalized.includes('health') || normalized.includes('健康')) {
      setVoiceStatusMessage('Opening Health Page...');
      setTimeout(() => {
        speak('Opening Health Page');
        navigate('/health');
      }, 800);
    } else if (normalized.includes('assistant') || normalized.includes('助手')) {
      setVoiceStatusMessage('Opening Smart Assistant...');
      setTimeout(() => {
        speak('Opening Smart Assistant');
        navigate('/assistant');
      }, 800);
    } else if (normalized.includes('family') || normalized.includes('social') || normalized.includes('家人')) {
      setVoiceStatusMessage('Opening Family Page...');
      setTimeout(() => {
        speak('Opening Family Page');
        navigate('/social');
      }, 800);
    } else if (normalized.includes('emergency') || normalized.includes('help') || normalized.includes('救命') || normalized.includes('緊急')) {
      setVoiceStatusMessage('Opening Emergency Support...');
      setTimeout(() => {
        speak('Opening Emergency Support');
        navigate('/emergency');
      }, 800);
    }
    stopVoiceRecognition({ reason: 'success', keepPanel: false });
  };

  /** handleVoiceError - Provide consistent reminders when recognition fails */
  const handleVoiceError = (message: string) => {
    setVoiceStatusMessage(message);
    speak('I didn\'t catch that, please try again');
    stopVoiceRecognition({ reason: 'error', keepPanel: false, message });
  };

  /** startVoiceRecognition - Set up recognition and refresh visual/audio cues */
  const startVoiceRecognition = () => {
    if (isVoiceListening) {
      return;
    }
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      setVoiceStatusMessage('Voice recognition not supported');
      setIsVoicePanelVisible(true);
      speak('Sorry, your device does not support voice recognition');
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
    setVoiceStatusMessage('Please speak...');
    setRecognizedSpeech('');
    recognizedSpeechRef.current = '';

    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = window.setInterval(() => {
      setVoiceCountdown(prev => {
        if (prev <= 1) {
          handleVoiceError('I didn\'t catch that, please try again');
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
      recognition.lang = 'en-US'; // Changed to English
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
          setVoiceStatusMessage(`Recognizing: ${interimTranscript}`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event);
        handleVoiceError('I didn\'t catch that, please try again');
      };

      recognition.onend = () => {
        if (isVoiceListeningRef.current && !recognizedSpeechRef.current) {
          handleVoiceError('I didn\'t catch that, please try again');
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition', error);
      handleVoiceError('Unable to start voice recognition');
    }
  };

  /** handleVoiceCancel - User manually cancels recording */
  const handleVoiceCancel = () => {
    setVoiceStatusMessage('Recording cancelled');
    stopVoiceRecognition({ reason: 'cancelled', keepPanel: false, message: 'Recording cancelled' });
  };

  /** handleVoiceStop - Allow immediate stop via the stop button */
  const handleVoiceStop = () => {
    setVoiceStatusMessage('Recording stopped');
    stopVoiceRecognition({ reason: 'cancelled', keepPanel: false, message: 'Recording stopped' });
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
    <div className={`min-h-screen transition-all duration-700 bg-[#FFFBF5] ${isDarkMode ? 'dark:bg-stone-900' : ''} font-sans`}>
      
      {/* 1. Top Vitality Greeting Zone */}
      <div className={`relative px-6 pt-8 pb-6 rounded-b-[3rem] shadow-sm border-b transition-colors duration-500 ${greeting.color}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white/50">
            <BrandMascot type="cat" size="md" mood="happy" animated={true} />
            <span className="text-xl font-bold text-stone-700 tracking-wide">Your Best Friend</span>
          </div>
          {/* Weather Badge */}
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
            <span className="text-xl">{weather.icon}</span>
            <span className="text-lg font-bold text-stone-700">{weather.temp}°C</span>
          </div>
        </div>

        {/* Greeting Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="animate-fade-in-up">
            {greeting.icon}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 tracking-tight leading-tight">
            {greeting.text}, {userName}!
          </h1>
          
          <div className="flex flex-col items-center space-y-1">
            <p className="text-2xl text-stone-600 font-medium">
              {currentTime.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
            <p className="text-3xl font-light text-stone-500 tracking-widest">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {encouragement && (
            <div className="mt-4 bg-white/50 px-6 py-3 rounded-2xl border border-white/60 max-w-md w-full shadow-sm">
              <p className="text-lg text-stone-700 font-medium leading-relaxed">
                “{encouragement}”
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Wellness Snapshot */}
      <div className="px-6 py-8">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-sm"></div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wide">Today's Health</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {healthStatus.map((status, index) => {
            const IconComponent = status.icon;
            return (
              <div 
                key={index} 
                className={`relative overflow-hidden p-6 rounded-3xl border ${status.borderColor} ${status.bgColor} flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98]`}
                onClick={() => handleCardClick(status)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-white/50`}>
                    <IconComponent className={`w-8 h-8 ${status.color}`} />
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-white/60 text-sm font-bold ${status.color}`}>
                    {status.trend === 'stable' && 'Stable'}
                    {status.trend === 'up' && 'Improved'}
                    {status.trend === 'good' && 'Good'}
                  </div>
                </div>
                
                <div>
                  <p className="text-lg text-stone-600 font-medium mb-1">{status.text}</p>
                  <p className={`text-3xl font-bold ${status.color} tracking-tight`}>{status.value}</p>
                </div>

                {/* Subtle Progress Bar */}
                <div className="mt-4 w-full bg-white/40 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${status.progressColor} opacity-80`} 
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Today's Schedule Carousel (Warm Style) */}
      <div className="pb-6">
        <div className="px-6 flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-8 bg-orange-400 rounded-full shadow-sm"></div>
            <h2 className="text-2xl font-bold text-stone-800 tracking-wide">Today's Schedule</h2>
          </div>
          <div className="flex items-center space-x-2">
            {dailyActivities.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotNavigation(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === normalizedSlide ? 'bg-orange-400 w-6' : 'bg-stone-300 w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="relative px-6">
          <button
            onClick={handlePrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:bg-white hover:scale-110 transition-all active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="overflow-hidden pb-6">
            <div
              ref={carouselTrackRef}
              onTransitionEnd={handleTransitionEnd}
              className="flex"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
              }}
            >
              {extendedActivities.map((activity, index) => {
                const Icon = activity.icon;
                const logicalIndex = totalSlides ? (index - 1 + totalSlides) % totalSlides : 0;
                const isActive = logicalIndex === normalizedSlide;
                return (
                  <div key={`${activity.title}-${index}`} className="w-full shrink-0 flex justify-center px-2">
                    <div
                      className={`w-full sm:w-[420px] flex flex-col justify-between p-6 rounded-3xl border transition-all duration-500 ${
                        isActive ? 'scale-100 opacity-100 shadow-xl ring-2 ring-orange-100' : 'scale-95 opacity-60 shadow-sm'
                      } ${activity.border} ${activity.bg} min-h-[220px]`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md border border-stone-50 transition-transform duration-300 ${
                          isActive ? 'scale-110' : ''
                        }`}>
                          <Icon className={`w-9 h-9 ${activity.color}`} />
                        </div>
                        <div className="px-4 py-1.5 bg-white/80 rounded-full backdrop-blur-sm border border-white/60 shadow-sm">
                          <span className={`text-xl font-bold ${activity.color}`}>{activity.time}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-2xl font-bold text-stone-800 leading-tight mb-2">{activity.title}</h3>
                        <p className="text-lg text-stone-600 font-medium flex items-center">
                          <span className="mr-1.5">📍</span> {activity.location}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-stone-700 hover:bg-white hover:scale-110 transition-all active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 4. Medication Reminders (Warm Style) */}
      <div className="px-6 pb-8">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-1.5 h-8 bg-amber-400 rounded-full shadow-sm"></div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wide">Medication Reminders</h2>
        </div>

        <div className="space-y-4 relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-stone-200/50 rounded-full"></div>

          {todaySchedule.map((item, idx) => {
            let statusColor = '';
            let statusText = '';
            let statusBg = '';
            let statusBorder = '';
            
            if (item.status === 'missed') {
              statusColor = 'text-red-700';
              statusBg = 'bg-red-50';
              statusBorder = 'border-red-100';
              statusText = 'Missed';
            } else if (item.status === 'upcoming') {
              statusColor = 'text-amber-700';
              statusBg = 'bg-amber-50';
              statusBorder = 'border-amber-100';
              statusText = 'Upcoming';
            } else {
              statusColor = 'text-emerald-700';
              statusBg = 'bg-emerald-50';
              statusBorder = 'border-emerald-100';
              statusText = 'Taken';
            }

            return (
              <div key={idx} className={`relative flex items-center pl-2`}>
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${
                  item.status === 'taken' ? 'bg-emerald-400' : item.status === 'missed' ? 'bg-red-400' : 'bg-amber-400'
                }`}></div>

                <div className={`flex-1 ml-10 p-5 rounded-3xl border ${statusBorder} ${statusBg} shadow-sm flex items-center justify-between`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-white/50">
                      <Pill className={`w-6 h-6 ${statusColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800">{item.name}</h3>
                      <p className="text-base text-stone-600 font-medium">{item.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-stone-800 mb-1">{item.time}</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${statusColor} bg-white/60`}>
                      {statusText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Vitality Action Grid (Warm Style) */}
      <div className="px-6 pb-40">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-1.5 h-8 bg-blue-400 rounded-full shadow-sm"></div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wide">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {mainButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(button.path, button.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border ${button.color} shadow-sm hover:shadow-md transition-all active:scale-[0.98] h-40`}
              >
                <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-white/50">
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-lg font-bold text-stone-800">{button.name}</span>
                <span className="text-xs text-stone-500 mt-1">{button.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Navigation Bar (Vitality Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-2xl border-t border-white/30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] px-8 py-4 z-50 flex items-center justify-between safe-area-bottom rounded-t-[2rem]">
        
        {/* Settings Button */}
        <button 
          onClick={() => navigate('/settings')}
          className="flex flex-col items-center justify-center space-y-1 text-stone-400 hover:text-stone-600 active:scale-95 transition-all w-20 group"
        >
          <div className="p-2 rounded-2xl group-hover:bg-stone-50 transition-colors">
            <Settings className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold tracking-wide">Settings</span>
        </button>

        {/* Voice Assistant Button (Center, Floating) */}
        <div className="relative -top-10">
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <button 
            onClick={startVoiceRecognition}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-[6px] border-[#FFFBF5] transition-all transform active:scale-95 ${
              isVoiceListening 
                ? 'bg-gradient-to-br from-red-400 to-red-500 animate-pulse' 
                : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105'
            }`}
          >
            <Mic className="w-10 h-10 text-white" />
          </button>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-stone-500 whitespace-nowrap bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
            {isVoiceListening ? 'Listening...' : 'Voice Assistant'}
          </span>
        </div>

        {/* SOS Button */}
        <button 
          onClick={handleSOS}
          className="flex flex-col items-center justify-center space-y-1 text-red-400 hover:text-red-600 active:scale-95 transition-all w-20 group"
        >
          <div className="relative p-2 rounded-2xl group-hover:bg-red-50 transition-colors">
             <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-0 group-hover:opacity-50"></div>
             <Phone className="w-8 h-8 relative z-10" />
          </div>
          <span className="text-xs font-bold tracking-wide">Emergency SOS</span>
        </button>
      </div>

      {/* 6. Voice Recognition Overlay (Vitality Style) */}
      {isVoicePanelVisible && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-stone-900/60 backdrop-blur-md transition-opacity duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 text-center shadow-2xl transform transition-all scale-100">
            <h3 className="text-3xl font-bold text-stone-800 mb-4 tracking-tight">{voiceStatusMessage}</h3>
            <p className="text-xl text-stone-400 mb-10 font-medium">
              Time remaining: <span className="text-blue-500 font-bold">{voiceCountdown}</span> seconds
            </p>

            <div className="h-32 flex items-center justify-center space-x-3 mb-10">
              {voiceWaveHeights.map((height, index) => (
                <div
                  key={index}
                  className="w-4 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full transition-all duration-200 ease-in-out shadow-sm"
                  style={{ height: `${height}px`, opacity: isVoiceListening ? 1 : 0.4 }}
                />
              ))}
            </div>

            {recognizedSpeech && (
              <div className="mb-10 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <p className="text-2xl text-stone-800 font-bold leading-relaxed">
                  "{recognizedSpeech}"
                </p>
              </div>
            )}

            <button
              onClick={handleVoiceStop}
              className="w-full py-5 bg-stone-100 text-stone-600 rounded-3xl text-xl font-bold hover:bg-stone-200 transition-colors active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantHome;
