import React from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * A horizontal rule used to visually separate sections of content. Applies
 * minimal styling so that it blends into the surrounding layout. Extend
 * further via the `className` prop as needed.
 */
export function Separator({ className = '', ...props }: SeparatorProps) {
  return <div className={`border-t border-gray-200 ${className}`} {...props} />;
}