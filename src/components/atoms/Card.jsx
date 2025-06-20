import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  clickable = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover || clickable ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';

  const motionProps = hover || clickable ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  const CardComponent = hover || clickable ? motion.div : 'div';

  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      {...(hover || clickable ? motionProps : {})}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;