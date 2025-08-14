import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button. The default variant renders a primary styled button.
   */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  /**
   * Size of the button. Defaults to medium.
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

/**
 * A simple button component used throughout the dashboard. It forwards all
 * native button props and applies a handful of Tailwind utility classes to
 * achieve a sensible default appearance. The `variant` and `size` props allow
 * callers to customise the look and feel without redefining styles each time.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors';
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-8 w-8',
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';