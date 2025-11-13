import React, { useState } from 'react';
import { Settings, Volume2, Sun, Moon, Maximize2, Minimize2, Palette, Eye, Mic, XCircle, Heart, Bell, Shield, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMascot } from '../components/BrandMascot';

interface ElegantSettingsProps {
  onBack: () => void;
}

const ElegantSettings: React.FC<ElegantSettingsProps> = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    largeText: false,
    highContrast: false,
    soundEffects: true,
    notifications: true,
    autoEmergency: true,
    fontSize: 'normal',
    theme: 'auto'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // 保存设置到本地存储
    localStorage.setItem('userSettings', JSON.stringify({ ...settings, [key]: value }));
  };

  const fontSizeOptions = [
    { value: 'small', label: '小字體', desc: '14px' },
    { value: 'normal', label: '標準字體', desc: '18px' },
    { value: 'large', label: '大字體', desc: '24px' },
    { value: 'extra-large', label: '特大字體', desc: '30px' }
  ];

  interface SettingCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    description?: string;
  }

  const SettingCard: React.FC<SettingCardProps> = ({ title, icon, children, description }) => (
    <div className="card-elegant mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 p-3 rounded-2xl mr-4">
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

  const ToggleSwitch = ({ label, checked, onChange, description }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="flex-1">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{label}</p>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-16 h-8 rounded-full transition-all duration-300 ease-out
          ${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
          focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800
        `}
      >
        <div className={`
          absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
          transform transition-transform duration-300 ease-out
          ${checked ? 'translate-x-8' : 'translate-x-0'}
        `} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          <XCircle className="w-8 h-8 mr-2" />
          <span className="text-xl font-medium">返回</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle size="lg" />
          <BrandMascot type="cat" size="sm" mood="caring" animated={false} />
        </div>
      </div>

      {/* 标题区域 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Settings className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">設置中心</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300">個性化您的使用體驗</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 显示设置 */}
        <SettingCard 
          title="顯示設置" 
          icon={<Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          description="調整界面外觀和字體大小"
        >
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">字體大小</label>
              <div className="grid grid-cols-2 gap-3">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('fontSize', option.value)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all duration-200 text-center
                      ${settings.fontSize === option.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500'
                      }
                    `}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm opacity-70">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <ToggleSwitch
              label="高對比度模式"
              checked={settings.highContrast}
              onChange={(checked) => updateSetting('highContrast', checked)}
              description="增強界面元素之間的對比度"
            />
          </div>
        </SettingCard>

        {/* 声音和通知 */}
        <SettingCard 
          title="聲音與通知" 
          icon={<Volume2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        >
          <ToggleSwitch
            label="語音助手"
            checked={settings.voiceEnabled}
            onChange={(checked) => updateSetting('voiceEnabled', checked)}
            description="啟用語音導航和朗讀功能"
          />
          <ToggleSwitch
            label="音效提示"
            checked={settings.soundEffects}
            onChange={(checked) => updateSetting('soundEffects', checked)}
            description="按鈕點擊和操作音效"
          />
          <ToggleSwitch
            label="通知提醒"
            checked={settings.notifications}
            onChange={(checked) => updateSetting('notifications', checked)}
            description="接收重要提醒和更新"
          />
        </SettingCard>

        {/* 安全设置 */}
        <SettingCard 
          title="安全設置" 
          icon={<Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        >
          <ToggleSwitch
            label="自動緊急求助"
            checked={settings.autoEmergency}
            onChange={(checked) => updateSetting('autoEmergency', checked)}
            description="檢測到異常時自動聯繫緊急聯繫人"
          />
        </SettingCard>

        {/* 主题设置 */}
        <SettingCard 
          title="主題外觀" 
          icon={<Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        >
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">夜間模式</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">深灰底+暖白字，保護眼睛</p>
            </div>
            <ThemeToggle size="lg" />
          </div>
        </SettingCard>

        {/* 温馨提示 */}
        <div className="card-elegant bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 border-2 border-rose-200 dark:border-rose-700">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-rose-500 dark:text-rose-400 mr-3" />
            <h3 className="text-xl font-semibold text-rose-800 dark:text-rose-200">溫馨提示</h3>
          </div>
          <div className="space-y-3 text-rose-700 dark:text-rose-300">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              我們的設計專為長者優化，大字體和高對比度讓使用更輕鬆
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              語音助手可以朗讀界面內容，幫助視力不便的用戶
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              有任何問題，請隨時聯繫我們的客服團隊
            </p>
          </div>
        </div>

        {/* 品牌吉祥物区域 */}
        <div className="text-center mt-12">
          <BrandMascot type="both" size="lg" mood="caring" animated={true} />
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            我們始終陪伴在您身邊，關心您的健康與安全 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default ElegantSettings;