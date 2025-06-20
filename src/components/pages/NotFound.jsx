import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: 'easeInOut'
          }}
          className="mb-6"
        >
          <ApperIcon name="Sprout" size={64} className="text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the fields! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            icon="Home"
          >
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Check out your farms, crops, or tasks to get back on track.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;