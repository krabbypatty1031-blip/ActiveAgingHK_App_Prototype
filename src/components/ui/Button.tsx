import React from 'react';
import { cn } from '../../utils/cn';
import { Icon as UIIcon } from './Icon';

/**
 * Apple HIG inspired tint styles: use iOS system colors with translucent layering for a native feel.
 */
const buttonVariantStyles = {
  primary: 'bg-ios-primary text-white shadow-ios hover:shadow-ios-lg focus:ring-ios-primary/30 transition-shadow',
  secondary: 'bg-ios-secondary text-white shadow-ios hover:shadow-ios-lg focus:ring-ios-secondary/30 transition-shadow',
  success: 'bg-ios-success text-white shadow-ios hover:shadow-ios-lg focus:ring-ios-success/30 transition-shadow',
  warning: 'bg-ios-warning text-white shadow-ios hover:shadow-ios-lg focus:ring-ios-warning/30 transition-shadow',
  danger: 'bg-ios-danger text-white shadow-ios hover:shadow-ios-lg focus:ring-ios-danger/30 transition-shadow',
  ghost: 'bg-transparent border border-ios-border text-ios-label hover:bg-ios-surface focus:ring-ios-primary/20 dark:border-ios-border-dark',
  outline: 'bg-ios-surface border border-ios-primary text-ios-primary hover:bg-ios-surface-strong focus:ring-ios-primary/25 dark:bg-ios-surface-dark',
  soft: 'bg-ios-surface glass-ios text-ios-primary hover:bg-ios-surface-strong focus:ring-ios-primary/15',
  sos: 'bg-ios-danger text-white animate-pulse shadow-ios hover:shadow-ios-lg focus:ring-ios-danger/40',
};

const buttonSizeStyles = {
  xs: 'px-3 py-2 text-sm rounded-xl gap-1',
  sm: 'px-4 py-3 text-base rounded-2xl gap-2',
  md: 'px-6 py-4 text-lg rounded-3xl gap-3',
  lg: 'px-8 py-5 text-xl rounded-3xl gap-4',
  xl: 'px-10 py-6 text-2xl rounded-3xl gap-5',
  icon: 'p-4 text-lg rounded-full gap-0',
};

/** buttonRoundedStyles - Extended radius options for larger control sizes */
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

/** buttonShadowStyles - Extended shadow mapping to cover additional Tailwind sizes */
const buttonShadowStyles = {
  none: 'shadow-none',
  sm: 'shadow-md',
  md: 'shadow-lg',
  lg: 'shadow-xl',
  xl: 'shadow-2xl',
  '2xl': 'shadow-2xl',
} as const;

// Icon button component
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

// Standard button component
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
        {/* Gloss highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Loading animation */}
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

// Button group component
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

// Floating action button
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