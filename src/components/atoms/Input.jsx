import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  type = 'text', 
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
  const errorClasses = error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-300';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;