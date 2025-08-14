import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * A simple toggle switch. Renders a checkbox behind the scenes and styles
 * it to resemble a modern sliding switch. The `checked` state is controlled
 * via props and the `onCheckedChange` callback notifies callers when the
 * state changes.
 */
export function Switch({ checked = false, onCheckedChange, className = '' }: SwitchProps) {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <span
        className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`}
        />
      </span>
    </label>
  );
}