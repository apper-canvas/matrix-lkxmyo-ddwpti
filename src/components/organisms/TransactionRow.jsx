import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const TransactionRow = ({ 
  transaction, 
  farm,
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.type.toLowerCase()}?`)) {
      try {
        await onDelete(transaction.Id);
        toast.success('Transaction deleted successfully');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Seeds': 'Seed',
      'Fertilizer': 'Beaker',
      'Equipment': 'Wrench',
      'Utilities': 'Zap',
      'Labor': 'Users',
      'Produce Sales': 'ShoppingCart',
      'Wine Sales': 'Wine',
      'Other': 'Package'
    };
    return icons[category] || 'Package';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          transaction.type === 'Income' 
            ? 'bg-success/10 text-success' 
            : 'bg-error/10 text-error'
        }`}>
          <ApperIcon name={getCategoryIcon(transaction.category)} size={18} />
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {transaction.description}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={transaction.type === 'Income' ? 'success' : 'error'} size="sm">
                  {transaction.category}
                </Badge>
                {farm && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ApperIcon name="MapPin" size={10} />
                    {farm.name}
                  </span>
                )}
              </div>
            </div>
            
            {/* Amount */}
            <div className="text-right ml-4">
              <div className={`text-lg font-bold ${
                transaction.type === 'Income' ? 'text-success' : 'text-error'
              }`}>
                {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit2"
            onClick={() => onEdit(transaction)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionRow;