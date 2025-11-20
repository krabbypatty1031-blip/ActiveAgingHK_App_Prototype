import React, { useState } from 'react';
import { Settings, Volume2, Palette, Eye, Mic, XCircle, Heart, Bell, Shield, User } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMascot } from '../components/BrandMascot';

interface ElegantSettingsProps {
  onBack: () => void;
}

const ElegantSettings: React.FC<ElegantSettingsProps> = ({ onBack }) => {
  const { setFontSize, setHighContrast, setVoiceNavigation, speak } = useAccessibility();
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    largeText: true,
    highContrast: false,
    soundEffects: true,
    notifications: true,
    autoEmergency: true,
    fontSize: 'large',
    theme: 'auto',
    alertVolume: 70
  });
  const [openGeneral, setOpenGeneral] = useState(false);
  const [openCommunity, setOpenCommunity] = useState(false);

  const updateSetting = (key: string, value: any) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem('userSettings', JSON.stringify(next));
    if (key === 'fontSize') {
      const map: Record<string, 'small'|'medium'|'large'|'extra-large'> = {
        small: 'small',
        normal: 'medium',
        large: 'large',
        'extra-large': 'extra-large'
      };
      setFontSize(map[value] || 'medium');
    }
    if (key === 'highContrast') {
      setHighContrast(Boolean(value));
    }
    if (key === 'voiceEnabled') {
      setVoiceNavigation(Boolean(value));
    }
    if (key === 'soundEffects') {
      // Value consumed by voice assistant when it initialises
    }
    if (key === 'notifications') {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            try {
              new Notification('Notifications enabled', { body: 'You will now receive important alerts and updates.' });
            } catch {}
          }
        });
      }
    }
    if (key === 'theme') {
      // ThemeToggle remains the main entry point for appearance updates
    }
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small text', desc: '14px' },
    { value: 'normal', label: 'Standard text', desc: '18px' },
    { value: 'large', label: 'Large text', desc: '24px' },
    { value: 'extra-large', label: 'Extra-large text', desc: '30px' }
  ];

  interface SettingCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    description?: string;
  }

  const SettingCard: React.FC<SettingCardProps> = ({ title, icon, children, description }) => (
    <div className="card-elegant mb-6 bg-white/80 dark:bg-stone-900/70 backdrop-blur-md border border-white/60 dark:border-stone-700/60 shadow-xl">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-orange-200/60 via-rose-100/80 to-amber-100/60 dark:from-orange-900/40 dark:via-rose-900/40 dark:to-amber-900/40 p-3 rounded-2xl mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          {description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    accent?: 'sunset' | 'ocean' | 'forest';
  }

  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, description, accent = 'sunset' }) => {
    const accentMap: Record<string, string> = {
      sunset: 'from-orange-500 via-rose-400 to-amber-400',
      ocean: 'from-sky-500 via-cyan-400 to-teal-400',
      forest: 'from-emerald-500 via-lime-400 to-green-500'
    };

    return (
      <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex-1 pr-4">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{label}</p>
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative w-20 h-10 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-orange-200/70 dark:focus:ring-orange-800/60 ${
            checked ? `bg-gradient-to-r ${accentMap[accent]}` : 'bg-stone-200 dark:bg-stone-700'
          }`}
        >
          <span
            className={`absolute inset-y-0 flex items-center px-3 text-xs font-semibold tracking-wide transition-colors ${
              checked ? 'text-white/80' : 'text-stone-500'
            }`}
          >
            {checked ? 'ON' : 'OFF'}
          </span>
          <div
            className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-out ${
              checked ? 'translate-x-10 shadow-[0_8px_20px_rgba(249,115,22,0.35)]' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  };

  interface AccentSliderProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    description?: string;
    onChange: (value: number) => void;
  }

  const AccentSlider: React.FC<AccentSliderProps> = ({ label, value, min = 0, max = 100, description, onChange }) => {
    const safeRange = Math.max(max - min, 1);
    const fillPercent = Math.min(100, Math.max(0, ((value - min) / safeRange) * 100));

    return (
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-stone-800 dark:text-stone-100">{label}</p>
            {description && <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{description}</p>}
          </div>
          <span className="text-xl font-semibold text-orange-600 dark:text-orange-300">{value}%</span>
        </div>
        <div className="relative mt-4 select-none">
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-amber-300 transition-all duration-300"
            style={{ width: `${fillPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-stone-900 border-2 border-orange-300 dark:border-orange-600 shadow-[0_10px_25px_rgba(249,115,22,0.35)] pointer-events-none transition-transform"
            style={{ left: `calc(${fillPercent}% - 12px)` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            aria-label={label}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-900 p-6">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.35),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(244,114,182,0.25),_transparent_55%)] dark:opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative">
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors duration-200"
        >
          <XCircle className="w-8 h-8 mr-2" />
          <span className="text-xl font-medium">Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <BrandMascot type="cat" size="sm" mood="caring" animated={false} />
        </div>
      </div>

      {/* Heading area */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Settings className="w-12 h-12 text-orange-600 dark:text-orange-400 mr-4" />
          <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">Settings hub</h1>
        </div>
        <p className="text-xl text-stone-600 dark:text-stone-300">Personalise your experience</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-4">
          <button
            onClick={() => setOpenGeneral(!openGeneral)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-400 to-rose-400 text-white shadow-[0_20px_45px_rgba(249,115,22,0.35)]"
          >
            <span className="text-2xl font-bold">General tools</span>
            <span className="text-xl">{openGeneral ? '▾' : '▸'}</span>
          </button>
          {openGeneral && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-200/50">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-orange-700 mr-3" />
                  <span className="text-orange-900 font-semibold">Pair a new device</span>
                </div>
                <span className="text-orange-700">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-100 border border-orange-200/50">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-orange-700 mr-3" />
                  <span className="text-orange-900 font-semibold">Manage viewing access</span>
                </div>
                <span className="text-orange-700">›</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpenCommunity(!openCommunity)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-gradient-to-r from-rose-500 via-fuchsia-400 to-amber-400 text-white shadow-[0_20px_45px_rgba(244,114,182,0.35)]"
          >
            <span className="text-2xl font-bold">My community</span>
            <span className="text-xl">{openCommunity ? '▾' : '▸'}</span>
          </button>
          {openCommunity && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-100 border border-rose-200/50">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-rose-700 mr-3" />
                  <span className="text-rose-900 font-semibold">Nearby community centres</span>
                </div>
                <span className="text-rose-700">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/50">
                <div className="flex items-center">
                  <Bell className="w-6 h-6 text-rose-700 mr-3" />
                  <span className="text-rose-900 font-semibold">Upcoming activities</span>
                </div>
                <span className="text-rose-700">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200/50">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-rose-700 mr-3" />
                  <span className="text-rose-900 font-semibold">Healthcare news</span>
                </div>
                <span className="text-rose-700">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-fuchsia-50 border border-rose-200/50">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-rose-700 mr-3" />
                  <span className="text-rose-900 font-semibold">Recommended doctors</span>
                </div>
                <span className="text-rose-700">›</span>
              </div>
            </div>
          )}
        </div>

        {/* Visual accessibility */}
        <SettingCard 
          title="Visual accessibility" 
          icon={<Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
        >
           {/* Font size */}
           <div className="mb-6">
            <p className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-3">Font size</p>
            <div className="grid grid-cols-2 gap-3">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('fontSize', option.value)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left shadow-sm ${
                    settings.fontSize === option.value
                      ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-rose-400 text-white border-transparent shadow-[0_15px_35px_rgba(249,115,22,0.25)]'
                      : 'bg-stone-50/80 dark:bg-stone-800/70 text-stone-700 dark:text-stone-200 border-stone-200/70 dark:border-stone-700/80 hover:bg-stone-100/80 dark:hover:bg-stone-700/70'
                  }`}
                >
                  <div className="text-base font-semibold">{option.label}</div>
                  <div className="text-xs opacity-80">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <ToggleSwitch
            label="High contrast mode"
            checked={settings.highContrast}
            onChange={(checked: boolean) => updateSetting('highContrast', checked)}
            description="Increase contrast for better legibility"
          />
        </SettingCard>
        

        {/* Sound & notifications */}
        <SettingCard 
          title="Sound & notifications" 
          icon={<Volume2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
        >
          <ToggleSwitch
            label="Voice assistant"
            checked={settings.voiceEnabled}
            onChange={(checked) => updateSetting('voiceEnabled', checked)}
            description="Enable voice navigation and narration"
          />
          <ToggleSwitch
            label="Sound effects"
            checked={settings.soundEffects}
            onChange={(checked) => updateSetting('soundEffects', checked)}
            description="Button taps and interaction sounds"
            accent="ocean"
          />
          <ToggleSwitch
            label="Notification alerts"
            checked={settings.notifications}
            onChange={(checked) => updateSetting('notifications', checked)}
            description="Receive important reminders and updates"
            accent="forest"
          />

          <AccentSlider
            label="Alert volume"
            value={settings.alertVolume}
            onChange={(value) => updateSetting('alertVolume', value)}
            description="Adjust haptic and chime intensity for alarms"
          />
          
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-700">
            <button
              onClick={() => speak('This is a voice test. If you can hear this message, the feature is working correctly.')}
              className="w-full bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-2xl p-3 flex items-center justify-center transform transition-all duration-200 active:scale-95 border border-orange-200 dark:border-orange-800"
            >
              <Mic className="w-5 h-5 mr-2" />
              <span className="text-lg font-semibold">Test Voice Assistant</span>
            </button>
          </div>
        </SettingCard>

        {/* Safety settings */}
        <SettingCard 
          title="Safety settings" 
          icon={<Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
        >
          <ToggleSwitch
            label="Automatic emergency help"
            checked={settings.autoEmergency}
            onChange={(checked) => updateSetting('autoEmergency', checked)}
            description="Automatically contact emergency contacts when an anomaly is detected"
          />
        </SettingCard>

        {/* Theme settings */}
        <SettingCard 
          title="Theme appearance" 
          icon={<Palette className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
        >
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-lg font-medium text-stone-800 dark:text-stone-100">Dark mode</p>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Deep gray background with warm white text—gentler for the eyes</p>
            </div>
            <ThemeToggle size="lg" />
          </div>
        </SettingCard>

        {/* Friendly reminders */}
        <div className="card-elegant bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-amber-50/90 dark:from-orange-900/70 dark:via-rose-900/60 dark:to-amber-900/60 border border-orange-200/70 dark:border-orange-700/70 shadow-xl backdrop-blur">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-rose-500 dark:text-rose-400 mr-3" />
            <h3 className="text-xl font-semibold text-rose-800 dark:text-rose-200">Friendly reminders</h3>
          </div>
          <div className="space-y-3 text-rose-700 dark:text-rose-300">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Our design is optimised for seniors—large text and high contrast make navigation effortless.
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              The voice assistant can read screen content aloud, assisting users with limited vision.
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              If you have questions, our support team is always ready to help.
            </p>
          </div>
        </div>

        {/* Brand mascot area */}
        <div className="text-center mt-12">
          <BrandMascot type="both" size="lg" mood="caring" animated={true} />
          <p className="text-lg text-stone-600 dark:text-stone-300 mt-4">
            We are always by your side, caring for your health and safety. 💕
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ElegantSettings;