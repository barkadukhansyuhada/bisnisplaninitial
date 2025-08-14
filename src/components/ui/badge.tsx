import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

/**
 * A small pill-shaped label for denoting contextual information. Variants
 * change the colours used to render the badge. Use the `className` prop to
 * further customise the appearance.
 */
export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}