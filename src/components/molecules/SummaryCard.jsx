import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const SummaryCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  loading = false,
  className = ''
}) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10',
    info: 'text-info bg-info/10'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-gray-500'
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 truncate">{title}</h3>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <ApperIcon name={icon} size={20} />
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center gap-1">
          <ApperIcon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            size={14} 
            className={trendColors[trend]} 
          />
          <span className={`text-xs font-medium ${trendColors[trend]}`}>
            {trendValue}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default SummaryCard;