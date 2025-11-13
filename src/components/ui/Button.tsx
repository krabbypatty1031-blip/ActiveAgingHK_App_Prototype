import React from 'react';
import { cn } from '../../utils/cn';
import { Icon as UIIcon } from './Icon';

// 按钮变体样式映射
const buttonVariantStyles = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-200 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl',
  secondary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-200 dark:focus:ring-orange-800 shadow-lg hover:shadow-xl',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-200 dark:focus:ring-green-800 shadow-lg hover:shadow-xl',
  warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-200 dark:focus:ring-yellow-800 shadow-lg hover:shadow-xl',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-200 dark:focus:ring-red-800 shadow-lg hover:shadow-xl',
  ghost: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  outline: 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 focus:ring-blue-200 dark:bg-gray-800 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20',
  soft: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 focus:ring-blue-100 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:hover:from-blue-800 dark:hover:to-indigo-800',
  sos: 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white animate-pulse hover:from-red-600 hover:via-red-700 hover:to-red-600 focus:ring-red-300 dark:focus:ring-red-700 shadow-2xl hover:shadow-red-500/25',
};

const buttonSizeStyles = {
  xs: 'px-3 py-2 text-sm rounded-xl gap-1',
  sm: 'px-4 py-3 text-base rounded-2xl gap-2',
  md: 'px-6 py-4 text-lg rounded-3xl gap-3',
  lg: 'px-8 py-5 text-xl rounded-3xl gap-4',
  xl: 'px-10 py-6 text-2xl rounded-3xl gap-5',
  icon: 'p-4 text-lg rounded-full gap-0',
};

/** buttonRoundedStyles - 扩展圆角枚举以兼容更大尺寸需求 */
const buttonRoundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
  full: 'rounded-full',
  rounded: 'rounded-2xl',
  circle: 'rounded-full',
  '3xl': 'rounded-3xl',
} as const;

const buttonAnimationStyles = {
  none: '',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  ping: 'animate-ping',
  gentle: 'animate-gentle-bounce',
};

/** buttonShadowStyles - 扩展阴影级别映射以覆盖额外的 Tailwind 阴影尺寸 */
const buttonShadowStyles = {
  none: 'shadow-none',
  sm: 'shadow-md',
  md: 'shadow-lg',
  lg: 'shadow-xl',
  xl: 'shadow-2xl',
  '2xl': 'shadow-2xl',
} as const;

// 图标按钮组件
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ className?: string }> | string;
  iconClassName?: string;
  children?: React.ReactNode;
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeStyles;
  rounded?: keyof typeof buttonRoundedStyles;
  shape?: keyof typeof buttonRoundedStyles;
  animation?: keyof typeof buttonAnimationStyles;
  shadow?: keyof typeof buttonShadowStyles;
  tooltip?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', rounded = 'full', shape, animation = 'none', shadow = 'md', icon: Icon, iconClassName, children, tooltip, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 group relative overflow-hidden';
    const variantClass = buttonVariantStyles[variant] || buttonVariantStyles.ghost;
    const sizeClass = buttonSizeStyles[size] || buttonSizeStyles.md;
    const roundedClass = buttonRoundedStyles[shape || rounded] || buttonRoundedStyles.full;
    const animationClass = buttonAnimationStyles[animation] || '';
    const shadowClass = buttonShadowStyles[shadow] || buttonShadowStyles.md;
    
    const buttonContent = (
      <button
        className={`${baseClasses} ${variantClass} ${sizeClass} ${roundedClass} ${animationClass} ${shadowClass} ${className || ''}`}
        ref={ref}
        {...props}
      >
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {typeof Icon === 'string' ? (
          <UIIcon name={Icon as any} className={`relative z-10 ${iconClassName || ''}`} />
        ) : (
          <Icon className={`relative z-10 ${iconClassName || ''}`} />
        )}
        {children && <span className="relative z-10 ml-2">{children}</span>}
      </button>
    );

    if (tooltip) {
      return (
        <div className="relative group">
          {buttonContent}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {tooltip}
          </div>
        </div>
      );
    }

    return buttonContent;
  }
);
IconButton.displayName = 'IconButton';

// 标准按钮组件
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeStyles;
  rounded?: keyof typeof buttonRoundedStyles;
  animation?: keyof typeof buttonAnimationStyles;
  shadow?: keyof typeof buttonShadowStyles;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', rounded = 'lg', animation = 'none', shadow = 'md', children, leftIcon: LeftIcon, rightIcon: RightIcon, isLoading, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 group relative overflow-hidden';
    const variantClass = buttonVariantStyles[variant] || buttonVariantStyles.primary;
    const sizeClass = buttonSizeStyles[size] || buttonSizeStyles.md;
    const roundedClass = buttonRoundedStyles[rounded] || buttonRoundedStyles.lg;
    const animationClass = buttonAnimationStyles[animation] || '';
    const shadowClass = buttonShadowStyles[shadow] || buttonShadowStyles.md;
    
    return (
      <button
        className={`${baseClasses} ${variantClass} ${sizeClass} ${roundedClass} ${animationClass} ${shadowClass} ${className || ''}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 加载动画 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div className={`relative z-10 flex items-center ${isLoading ? 'opacity-0' : ''}`}>
          {LeftIcon && <LeftIcon className="mr-2" />}
          {children}
          {RightIcon && <RightIcon className="ml-2" />}
        </div>
      </button>
    );
  }
);
Button.displayName = 'Button';

// 按钮组组件
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  children, 
  className = '', 
  orientation = 'horizontal',
  attached = false 
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };
  
  const spacingClasses = attached ? '' : (orientation === 'horizontal' ? 'space-x-3' : 'space-y-3');
  
  return (
    <div className={`flex ${orientationClasses[orientation]} ${spacingClasses} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            className: `${(child as React.ReactElement).props.className || ''} ${
              attached && index === 0 && (orientation === 'horizontal' ? 'rounded-r-none' : 'rounded-b-none')
            } ${
              attached && index === React.Children.count(children) - 1 && (orientation === 'horizontal' ? 'rounded-l-none' : 'rounded-t-none')
            } ${
              attached && index > 0 && index < React.Children.count(children) - 1 ? 'rounded-none' : ''
            }`
          });
        }
        return child;
      })}
    </div>
  );
};

// 浮动操作按钮
interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ className?: string }>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  tooltip?: string;
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeStyles;
  rounded?: keyof typeof buttonRoundedStyles;
  animation?: keyof typeof buttonAnimationStyles;
  shadow?: keyof typeof buttonShadowStyles;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className,
  variant = 'primary',
  size = 'icon',
  icon: Icon,
  position = 'bottom-right',
  tooltip,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-8 right-8',
    'bottom-left': 'fixed bottom-8 left-8',
    'top-right': 'fixed top-8 right-8',
    'top-left': 'fixed top-8 left-8'
  };
  
  return (
    <div className={`${positionClasses[position]} z-50 group`}>
      <IconButton
        variant={variant}
        size={size}
        icon={Icon}
        className={cn('shadow-2xl hover:shadow-3xl transform hover:scale-110', className)}
        {...props}
      />
      {tooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default Button;