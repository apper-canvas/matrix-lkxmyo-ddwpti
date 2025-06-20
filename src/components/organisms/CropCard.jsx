import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';

const CropCard = ({ 
  crop, 
  farm,
  onEdit, 
  onDelete,
  onUpdateStatus,
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);

  const plantedDate = new Date(crop.plantedDate);
  const expectedHarvest = new Date(crop.expectedHarvest);
  const daysToHarvest = differenceInDays(expectedHarvest, new Date());
  const daysSincePlanted = differenceInDays(new Date(), plantedDate);

  const getGrowthStageInfo = (stage) => {
    const stages = {
      'Seedling': { progress: 20, color: 'info', icon: 'Sprout' },
      'Vegetative': { progress: 40, color: 'primary', icon: 'Leaf' },
      'Flowering': { progress: 60, color: 'warning', icon: 'Flower' },
      'Fruit Development': { progress: 80, color: 'accent', icon: 'Apple' },
      'Mature': { progress: 100, color: 'success', icon: 'Award' },
      'Root Development': { progress: 50, color: 'secondary', icon: 'TreePine' }
    };
    return stages[stage] || { progress: 0, color: 'default', icon: 'Seed' };
  };

  const stageInfo = getGrowthStageInfo(crop.growthStage);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${crop.name}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        await onDelete(crop.Id);
        toast.success(`${crop.name} has been deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete crop');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await onUpdateStatus(crop.Id, { status: newStatus });
      toast.success(`${crop.name} status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update crop status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover className={`p-6 ${className} ${loading ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {crop.name}
            </h3>
            <Badge variant={crop.status === 'Active' ? 'success' : 'default'} size="sm">
              {crop.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{crop.variety}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="MapPin" size={12} />
            <span className="truncate">{farm?.name || 'Unknown Farm'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit2"
            onClick={() => onEdit(crop)}
            disabled={loading}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            disabled={loading}
            className="text-error hover:text-error"
          />
        </div>
      </div>

      {/* Growth Stage Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ApperIcon name={stageInfo.icon} size={16} className={`text-${stageInfo.color}`} />
            <span className="text-sm font-medium text-gray-700">{crop.growthStage}</span>
          </div>
          <span className="text-xs text-gray-500">{stageInfo.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stageInfo.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="growth-progress h-2 rounded-full"
          />
        </div>
      </div>

      {/* Crop Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="Calendar" size={14} className="text-gray-400" />
            <span className="text-gray-600">Planted</span>
          </div>
          <p className="text-sm font-medium">
            {format(plantedDate, 'MMM dd, yyyy')}
          </p>
          <p className="text-xs text-gray-500">
            {daysSincePlanted} days ago
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="Clock" size={14} className="text-gray-400" />
            <span className="text-gray-600">Harvest</span>
          </div>
          <p className="text-sm font-medium">
            {format(expectedHarvest, 'MMM dd, yyyy')}
          </p>
          <p className={`text-xs ${daysToHarvest < 0 ? 'text-error' : daysToHarvest < 7 ? 'text-warning' : 'text-gray-500'}`}>
            {daysToHarvest < 0 
              ? `${Math.abs(daysToHarvest)} days overdue`
              : daysToHarvest === 0
              ? 'Due today'
              : `${daysToHarvest} days left`
            }
          </p>
        </div>
      </div>

      {/* Area Planted */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="Maximize2" size={16} className="text-gray-600" />
          <span className="text-sm text-gray-600">Area Planted</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {crop.areaPlanted} acres
        </span>
      </div>

      {/* Quick Actions */}
      {crop.status === 'Active' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2"
        >
          {crop.growthStage === 'Mature' && (
            <Button
              size="sm"
              variant="accent"
              icon="Package"
              onClick={() => handleStatusUpdate('Harvested')}
              disabled={loading}
              className="flex-1"
            >
              Mark Harvested
            </Button>
          )}
          {daysToHarvest < 7 && daysToHarvest >= 0 && (
            <Button
              size="sm"
              variant="warning"
              icon="AlertTriangle"
              disabled
              className="flex-1"
            >
              Harvest Soon
            </Button>
          )}
        </motion.div>
      )}
    </Card>
  );
};

export default CropCard;