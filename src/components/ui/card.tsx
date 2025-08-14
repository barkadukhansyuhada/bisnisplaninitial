import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * A surface used to group related pieces of content. Cards provide a light
 * background, subtle border and rounded corners. You can nest `CardContent`
 * within `Card` to add consistent padding around your content.
 */
export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Wraps the contents of a card and applies padding. This component is kept
 * separate from `Card` so that you can optionally customise the spacing for
 * different sections of your card.
 */
export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}