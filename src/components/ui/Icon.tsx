import React from 'react';
import * as LucideIcons from 'lucide-react';

// 图标大小配置
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// 图标颜色配置
export const ICON_COLORS = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-orange-600 dark:text-orange-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-cyan-600 dark:text-cyan-400',
  neutral: 'text-gray-600 dark:text-gray-400',
  light: 'text-gray-400 dark:text-gray-500',
  white: 'text-white',
  inherit: 'text-current',
} as const;

// 图标动画配置
export const ICON_ANIMATIONS = {
  none: '',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  gentle: 'animate-gentle-bounce',
} as const;

export type IconSize = keyof typeof ICON_SIZES;
export type IconColor = keyof typeof ICON_COLORS;
export type IconAnimation = keyof typeof ICON_ANIMATIONS;

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: IconSize | number;
  color?: IconColor;
  className?: string;
  animation?: IconAnimation;
  strokeWidth?: number;
}

/**
 * 统一图标组件
 * 提供一致的图标样式和行为
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  className = '',
  animation = 'none',
  strokeWidth = 2,
}) => {
  // 处理字符串名称映射到正确的Lucide图标组件名称
  const iconNameMap: Record<string, keyof typeof LucideIcons> = {
    'ArrowLeft': 'ArrowLeft',
    'Settings': 'Settings',
    'Mic': 'Mic',
    'MicOff': 'MicOff',
    'Volume2': 'Volume2',
    'VolumeX': 'VolumeX',
    'Send': 'Send',
    'Pill': 'Pill',
    'Sun': 'Sun',
    'Bot': 'Bot',
    'User': 'User',
    'Heart': 'Heart',
    'Phone': 'Phone',
    'TrendingUp': 'TrendingUp',
    'CheckCircle': 'CheckCircle',
    'Calendar': 'Calendar',
    'MapPin': 'MapPin',
    'Users': 'Users',
    'Clock': 'Clock',
    'Star': 'Star',
    'MessageCircle': 'MessageCircle',
    'Camera': 'Camera',
    'Video': 'Video',
    'Home': 'Home',
    'UserHeart': 'UserHeart' as keyof typeof LucideIcons,
    'AlertTriangle': 'AlertTriangle',
    'Info': 'Info',
    'Loader2': 'Loader2',
  };
  
  const actualIconName = iconNameMap[name] || name;
  const LucideIcon = LucideIcons[actualIconName] as React.ComponentType<any>;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" (mapped to "${actualIconName}") not found in Lucide icons`);
    return null;
  }
  
  const sizeValue = typeof size === 'number' ? size : ICON_SIZES[size];
  const colorClass = ICON_COLORS[color];
  const animationClass = ICON_ANIMATIONS[animation];
  
  return (
    <LucideIcon
      size={sizeValue}
      className={`${colorClass} ${animationClass} ${className}`}
      strokeWidth={strokeWidth}
    />
  );
};

/**
 * 图标按钮组件
 * 结合图标和按钮功能
 */
export interface IconButtonProps extends Omit<IconProps, 'name'> {
  icon: keyof typeof LucideIcons;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'soft';
  shape?: 'circle' | 'square' | 'rounded';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  tooltip,
  variant = 'ghost',
  shape = 'circle',
  size = 'md',
  color = 'neutral',
  className = '',
  animation = 'none',
  ...iconProps
}) => {
  const baseClasses = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-200 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800',
    soft: 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-100 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800',
  };
  
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-2xl',
  };
  
  const sizeClasses = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  };
  
  const buttonClasses = `
    ${baseClasses[variant]}
    ${shapeClasses[shape]}
    ${sizeClasses[size]}
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-95
    ${className}
  `;
  
  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={tooltip}
    >
      <Icon name={icon} size={size} color={color} animation={animation} {...iconProps} />
    </button>
  );
  
  if (tooltip) {
    return (
      <div className="relative group">
        {button}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tooltip}
        </div>
      </div>
    );
  }
  
  return button;
};

/**
 * 图标组组件
 * 用于显示多个相关图标
 */
export interface IconGroupProps {
  icons: Array<{
    name: keyof typeof LucideIcons;
    color?: IconColor;
    size?: IconSize;
  }>;
  spacing?: 'tight' | 'normal' | 'loose';
  direction?: 'horizontal' | 'vertical';
}

export const IconGroup: React.FC<IconGroupProps> = ({
  icons,
  spacing = 'normal',
  direction = 'horizontal',
}) => {
  const spacingClasses = {
    tight: direction === 'horizontal' ? 'space-x-1' : 'space-y-1',
    normal: direction === 'horizontal' ? 'space-x-3' : 'space-y-3',
    loose: direction === 'horizontal' ? 'space-x-5' : 'space-y-5',
  };
  
  const flexClasses = direction === 'horizontal' ? 'flex items-center' : 'flex flex-col items-center';
  
  return (
    <div className={`${flexClasses} ${spacingClasses[spacing]}`}>
      {icons.map((icon, index) => (
        <Icon
          key={index}
          name={icon.name}
          color={icon.color}
          size={icon.size}
        />
      ))}
    </div>
  );
};

/**
 * 状态图标组件
 * 用于显示不同状态的图标
 */
export interface StatusIconProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'loading';
  size?: IconSize;
  animated?: boolean;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'md',
  animated = true,
}) => {
  const statusConfig = {
    success: { icon: 'CheckCircle', color: 'success' as IconColor },
    warning: { icon: 'AlertTriangle', color: 'warning' as IconColor },
    error: { icon: 'XCircle', color: 'error' as IconColor },
    info: { icon: 'Info', color: 'info' as IconColor },
    loading: { icon: 'Loader2', color: 'neutral' as IconColor },
  };
  
  const config = statusConfig[status];
  const animation = status === 'loading' && animated ? 'spin' : 'none';
  
  return (
    <Icon
      name={config.icon as keyof typeof LucideIcons}
      size={size}
      color={config.color}
      animation={animation}
    />
  );
};

/**
 * 导航图标组件
 * 专门用于导航的图标
 */
export interface NavigationIconProps {
  name: 'home' | 'health' | 'assistant' | 'emergency' | 'social' | 'settings' | 'family';
  size?: IconSize;
  active?: boolean;
}

export const NavigationIcon: React.FC<NavigationIconProps> = ({
  name,
  size = 'md',
  active = false,
}) => {
  const iconMap = {
    home: 'Home',
    health: 'Heart',
    assistant: 'MessageCircle',
    emergency: 'Phone',
    social: 'Users',
    settings: 'Settings',
    family: 'UserHeart',
  };
  
  const color = active ? 'primary' : 'neutral';
  const animation = active ? 'gentle' : 'none';
  
  return (
    <Icon
      name={iconMap[name] as keyof typeof LucideIcons}
      size={size}
      color={color}
      animation={animation}
    />
  );
};

// 导出所有 Lucide 图标供外部使用
export { LucideIcons };

export default Icon;