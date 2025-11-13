import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDarkMode);
    setTheme(shouldUseDarkMode ? 'dark' : 'light');
    
    // 应用主题到根元素
    document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light');
    
    // 更新body背景色
    if (shouldUseDarkMode) {
      document.body.style.background = 'linear-gradient(135deg, #1F2937 0%, #374151 100%)';
      document.body.style.color = '#F9FAFB';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)';
      document.body.style.color = '#374151';
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
    
    // 保存到本地存储
    localStorage.setItem('theme', newTheme);
    
    // 应用主题到根元素
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 更新body背景色
    if (newTheme === 'dark') {
      document.body.style.background = 'linear-gradient(135deg, #1F2937 0%, #374151 100%)';
      document.body.style.color = '#F9FAFB';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)';
      document.body.style.color = '#374151';
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};