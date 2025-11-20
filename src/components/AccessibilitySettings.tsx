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
    // Apply the selected font size and contrast mode to the root element
    const root = document.documentElement;
    
    // Mapping of font size tokens to rem values
    const fontSizeMap = {
      'small': '16px',
      'medium': '20px',
      'large': '24px',
      'extra-large': '28px'
    };
    
    root.style.fontSize = fontSizeMap[fontSize];
    
    // High-contrast mode toggle
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Persist settings to local storage
    localStorage.setItem('accessibility-settings', JSON.stringify({
      fontSize,
      highContrast,
      voiceNavigation
    }));
  }, [fontSize, highContrast, voiceNavigation]);

  useEffect(() => {
    // Load settings from local storage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.highContrast !== undefined) setHighContrast(settings.highContrast);
        if (settings.voiceNavigation !== undefined) setVoiceNavigation(settings.voiceNavigation);
      } catch (e) {
        console.log('Unable to load accessibility settings');
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

// Floating settings button removed as functionality has been merged into the main settings page.
export default AccessibilityProvider;