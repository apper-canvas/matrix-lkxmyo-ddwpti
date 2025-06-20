import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-green-700 focus:ring-primary shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-amber-800 focus:ring-secondary shadow-sm',
    accent: 'bg-accent text-white hover:bg-orange-600 focus:ring-accent shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-white',
    ghost: 'text-gray-600 hover:text-primary hover:bg-gray-50 focus:ring-gray-300',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { duration: 0.1 }
  };

  const renderIcon = (position) => {
    if (!icon || loading) return null;
    if (iconPosition !== position) return null;
    
    return <ApperIcon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16} />;
  };

  return (
    <motion.button
      {...motionProps}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="animate-spin" />
      ) : (
        <>
          {renderIcon('left')}
          {children}
          {renderIcon('right')}
        </>
      )}
    </motion.button>
  );
};

export default Button;