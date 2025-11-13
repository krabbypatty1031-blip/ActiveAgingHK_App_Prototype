import React from 'react';

interface BrandMascotProps {
  type?: 'cat' | 'bird' | 'both';
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'sleepy' | 'playful' | 'caring';
  className?: string;
  animated?: boolean;
}

export const BrandMascot: React.FC<BrandMascotProps> = ({
  type = 'both',
  size = 'md',
  mood = 'happy',
  className = '',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const moodColors = {
    happy: 'text-blue-500 dark:text-blue-400',
    sleepy: 'text-purple-500 dark:text-purple-400',
    playful: 'text-orange-500 dark:text-orange-400',
    caring: 'text-rose-500 dark:text-rose-400'
  };

  const animationClasses = animated ? 'animate-gentle-bounce' : '';

  const CatMascot = () => (
    <div className={`${sizeClasses[size]} ${animationClasses} ${className}`}>
      <img 
        src={`${import.meta.env.BASE_URL}UI.png`}
        alt="猫咪吉祥物" 
        className={`w-full h-full object-contain ${moodColors[mood]}`}
      />
    </div>
  );


  const CombinedMascot = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img 
        src={`${import.meta.env.BASE_URL}UI.png`}
        alt="品牌吉祥物" 
        className={`w-full h-full object-contain ${moodColors[mood]}`}
      />
    </div>
  );

  const getMascotComponent = () => {
    switch (type) {
      case 'cat':
        return <CatMascot />;
      default:
        return <CombinedMascot />;
    }
  };

  return (
    <div className="inline-block relative">
      {getMascotComponent()}
      {/* 温馨的对话气泡 - 优化位置适应UI排版 */}
      <div className={`
        absolute -top-8 -left-2 
        sm:-top-10 sm:left-1/2 sm:-translate-x-1/2
        md:-top-12 md:left-auto md:right-0 md:translate-x-0
        bg-white dark:bg-gray-800 
        rounded-2xl px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium
        shadow-lg border-2 border-blue-200 dark:border-blue-600
        transition-all duration-300 hover:scale-105 whitespace-nowrap z-10
        before:content-[''] before:absolute before:bottom-0 
        before:left-1/2 before:-translate-x-1/2 before:translate-y-full
        before:w-2 before:h-2 sm:before:w-3 sm:before:h-3 
        before:bg-white dark:before:bg-gray-800
        before:border-r-2 before:border-b-2 before:border-blue-200 dark:before:border-blue-600
        before:transform before:rotate-45
        group-hover:opacity-100 opacity-0 group-hover:translate-y-0
        translate-y-2 pointer-events-none
        max-w-[120px] sm:max-w-none
      `}>
        {mood === 'happy' && '很高興陪伴您！'}
        {mood === 'sleepy' && '晚安，好好休息~'}
        {mood === 'playful' && '一起玩吧！'}
        {mood === 'caring' && '我們關心您 💕'}
      </div>
    </div>
  );
};

export default BrandMascot;