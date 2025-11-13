import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false 
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-12 h-6 text-sm',
    md: 'w-16 h-8 text-base',
    lg: 'w-20 h-10 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]} ${className}
        bg-gradient-to-r from-blue-100 to-indigo-100
        dark:from-gray-700 dark:to-gray-800
        rounded-full border-2 border-blue-200 dark:border-gray-600
        transition-all duration-300 ease-out
        hover:shadow-lg hover:scale-105
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-gray-600
      `}
      aria-label={isDarkMode ? '切换到日间模式' : '切换到夜间模式'}
    >
      {/* 背景动画效果 */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-r from-yellow-200 to-orange-200
        dark:from-blue-800 dark:to-indigo-800
        transition-opacity duration-500
        ${isDarkMode ? 'opacity-100' : 'opacity-0'}
      `} />
      
      {/* 太阳图标 */}
      <div className={`
        relative z-10 transition-all duration-300
        ${isDarkMode ? 'opacity-0 scale-50 translate-x-2' : 'opacity-100 scale-100 translate-x-0'}
      `}>
        <Sun 
          size={iconSizes[size]} 
          className="text-yellow-600 dark:text-yellow-300"
        />
      </div>
      
      {/* 月亮图标 */}
      <div className={`
        absolute inset-0 flex items-center justify-center transition-all duration-300
        ${isDarkMode ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-2'}
      `}>
        <Moon 
          size={iconSizes[size]} 
          className="text-blue-600 dark:text-blue-300"
        />
      </div>
      
      {/* 标签文字 */}
      {showLabel && (
        <span className={`
          ml-2 font-medium transition-colors duration-300
          text-gray-700 dark:text-gray-200
        `}>
          {isDarkMode ? '夜间模式' : '日间模式'}
        </span>
      )}
      
      {/* 脉冲动画效果 */}
      <div className={`
        absolute -inset-1 rounded-full border-2
        ${isDarkMode ? 'border-blue-400' : 'border-yellow-400'}
        opacity-0 animate-ping
        transition-opacity duration-1000
      `} />
    </button>
  );
};

export default ThemeToggle;