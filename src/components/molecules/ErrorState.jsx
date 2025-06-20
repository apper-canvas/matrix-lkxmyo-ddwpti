import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline" icon="RefreshCw">
            Try Again
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorState;