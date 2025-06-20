import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';

const TaskCard = ({ 
  task, 
  farm,
  crop,
  onEdit, 
  onDelete,
  onUpdateStatus,
  showFarmInfo = true,
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'Completed';
  const isDueToday = isToday(dueDate);

  const getPriorityInfo = (priority) => {
    const priorities = {
      'High': { color: 'error', icon: 'AlertTriangle' },
      'Medium': { color: 'warning', icon: 'AlertCircle' },
      'Low': { color: 'info', icon: 'Info' }
    };
    return priorities[priority] || { color: 'default', icon: 'Circle' };
  };

  const getStatusInfo = (status) => {
    const statuses = {
      'Pending': { color: 'warning', icon: 'Clock' },
      'In Progress': { color: 'info', icon: 'Play' },
      'Completed': { color: 'success', icon: 'CheckCircle' }
    };
    return statuses[status] || { color: 'default', icon: 'Circle' };
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await onUpdateStatus(task.Id, { status: newStatus });
      toast.success(`Task ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setLoading(true);
      try {
        await onDelete(task.Id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card 
      hover 
      className={`p-4 ${className} ${loading ? 'opacity-75' : ''} ${
        isOverdue ? 'border-l-4 border-l-error' : 
        isDueToday ? 'border-l-4 border-l-warning' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleComplete}
          disabled={loading}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all mt-0.5 ${
            task.status === 'Completed'
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-success'
          }`}
        >
          {task.status === 'Completed' && (
            <ApperIcon name="Check" size={12} />
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                icon="Edit2"
                onClick={() => onEdit(task)}
                disabled={loading}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleDelete}
                disabled={loading}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
              />
            </div>
          </div>

          {/* Task Meta Information */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={12} className="text-gray-400" />
              <span className={`${
                isOverdue ? 'text-error font-medium' : 
                isDueToday ? 'text-warning font-medium' : 'text-gray-600'
              }`}>
                {isOverdue ? 'Overdue' : isDueToday ? 'Due today' : format(dueDate, 'MMM dd')}
              </span>
            </div>
            
            {showFarmInfo && farm && (
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" size={12} className="text-gray-400" />
                <span className="text-gray-600 truncate">{farm.name}</span>
              </div>
            )}
            
            {crop && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Wheat" size={12} className="text-gray-400" />
                <span className="text-gray-600 truncate">{crop.name}</span>
              </div>
            )}
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.color} size="sm">
              <ApperIcon name={statusInfo.icon} size={12} className="mr-1" />
              {task.status}
            </Badge>
            
            <Badge variant={priorityInfo.color} size="sm">
              <ApperIcon name={priorityInfo.icon} size={12} className="mr-1" />
              {task.priority}
            </Badge>
            
            {task.completedAt && (
              <span className="text-xs text-gray-500">
                Completed {format(new Date(task.completedAt), 'MMM dd, HH:mm')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;