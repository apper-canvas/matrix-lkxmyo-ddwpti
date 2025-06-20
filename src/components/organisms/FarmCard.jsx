import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';

const FarmCard = ({ 
  farm, 
  activeCropsCount = 0,
  onEdit, 
  onDelete,
  onClick,
  className = ''
}) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${farm.name}? This action cannot be undone.`)) {
      try {
        await onDelete(farm.Id);
        toast.success(`${farm.name} has been deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete farm');
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(farm);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(farm);
    }
  };

  return (
    <Card 
      hover 
      clickable={!!onClick}
      onClick={handleClick}
      className={`farm-card p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            {farm.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <ApperIcon name="MapPin" size={14} />
            <span className="truncate">{farm.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit2"
            onClick={handleEdit}
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {farm.totalArea}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {farm.areaUnit}
          </div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-info">
            {activeCropsCount}
          </div>
          <div className="text-sm text-gray-600">
            Active Crops
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            Active
          </Badge>
          <span className="text-xs text-gray-500">
            Since {new Date(farm.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {onClick && (
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
        )}
      </div>
    </Card>
  );
};

export default FarmCard;