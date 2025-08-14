import React from 'react';

interface SelectProps {
  /**
   * The currently selected value. This can be any serialisable value. The
   * component treats all values as strings internally to work seamlessly with
   * the underlying native select element.
   */
  value: any;
  /**
   * Callback invoked when the selected option changes. The new value is
   * forwarded verbatim (i.e. without casting) to the caller. Consumers are
   * responsible for casting to the appropriate type if necessary.
   */
  onValueChange?: (value: any) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * A lightweight alternative to more feature rich select components. It maps
 * `SelectItem` children into native `<option>` elements and forwards the
 * selected value via the `onValueChange` callback. The surrounding
 * `SelectTrigger`, `SelectValue` and `SelectContent` components are
 * implemented as simple passthrough wrappers to keep the API surface
 * compatible with the original ShadCN implementation used in the dashboard.
 */
export function Select({ value, onValueChange, children, className = '' }: SelectProps) {
  const options: { value: any; label: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    // Extract option values from SelectItem components
    if (child.props.value !== undefined) {
      options.push({ value: child.props.value, label: child.props.children });
    }
    // Support nested SelectContent
    if (child.type && (child.type as any).displayName === 'SelectContent') {
      React.Children.forEach(child.props.children, (sub) => {
        if (React.isValidElement(sub)) {
          const el = sub as React.ReactElement<{ value?: any; children?: React.ReactNode }>;
          if (el.props.value !== undefined) {
            options.push({ value: el.props.value, label: el.props.children });
          }
        }
      });
    }
  });
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

Select.displayName = 'Select';

// Passthrough wrappers used for API compatibility. They simply render
// children without modification so that the structure of Select remains
// declarative and easy to follow.
export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};
SelectContent.displayName = 'SelectContent';

export const SelectItem: React.FC<{ value: any; children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
SelectItem.displayName = 'SelectItem';

export const SelectValue: React.FC<{ placeholder?: string }> = () => {
  // This component intentionally renders nothing. Placeholder support is not
  // implemented as the native select element displays the selected option
  // automatically.
  return null;
};
SelectValue.displayName = 'SelectValue';