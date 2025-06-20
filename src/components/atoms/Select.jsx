import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white';
  const errorClasses = error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-300';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className} pr-10`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
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

Select.displayName = 'Select';

export default Select;