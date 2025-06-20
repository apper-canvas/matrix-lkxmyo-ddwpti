import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'Package', 
  title, 
  description, 
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="mb-4"
        >
          <ApperIcon name={icon} size={48} className="text-gray-300 mx-auto" />
        </motion.div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} icon="Plus">
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;