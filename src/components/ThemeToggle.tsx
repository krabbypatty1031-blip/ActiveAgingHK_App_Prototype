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
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background shimmer effect */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-r from-yellow-200 to-orange-200
        dark:from-blue-800 dark:to-indigo-800
        transition-opacity duration-500
        ${isDarkMode ? 'opacity-100' : 'opacity-0'}
      `} />
      
      {/* Sun icon */}
      <div className={`
        relative z-10 transition-all duration-300
        ${isDarkMode ? 'opacity-0 scale-50 translate-x-2' : 'opacity-100 scale-100 translate-x-0'}
      `}>
        <Sun 
          size={iconSizes[size]} 
          className="text-yellow-600 dark:text-yellow-300"
        />
      </div>
      
      {/* Moon icon */}
      <div className={`
        absolute inset-0 flex items-center justify-center transition-all duration-300
        ${isDarkMode ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-2'}
      `}>
        <Moon 
          size={iconSizes[size]} 
          className="text-blue-600 dark:text-blue-300"
        />
      </div>
      
      {/* Toggle label */}
      {showLabel && (
        <span className={`
          ml-2 font-medium transition-colors duration-300
          text-gray-700 dark:text-gray-200
        `}>
          {isDarkMode ? 'Dark mode' : 'Light mode'}
        </span>
      )}
      
      {/* Pulse animation accent */}
      
    </button>
  );
};

export default ThemeToggle;