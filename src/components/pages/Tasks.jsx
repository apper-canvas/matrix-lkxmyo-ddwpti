import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import TaskCard from "@/components/organisms/TaskCard";
import AddEditModal from "@/components/organisms/AddEditModal";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    farm: '',
    status: '',
    priority: ''
  });

  const taskFields = [
    {
      name: 'farmId',
      label: 'Farm',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'cropId',
      label: 'Crop (Optional)',
      type: 'select',
      required: false,
      options: []
    },
    {
      name: 'title',
      label: 'Task Title',
      type: 'text',
      required: true,
      placeholder: 'e.g., Water tomato beds, Apply fertilizer',
      icon: 'CheckSquare'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Additional details about the task...'
placeholder: 'Additional details about the task...'
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: 'datepicker',
      required: true,
      icon: 'Calendar'
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        { value: 'High', label: 'High Priority' },
        { value: 'Medium', label: 'Medium Priority' },
        { value: 'Low', label: 'Low Priority' }
      ]
    },
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (filters.farm) {
      filtered = filtered.filter(task => task.farmId === parseInt(filters.farm, 10));
    }
    
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    // Sort by due date, with overdue tasks first
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      const now = new Date();
      
      const aOverdue = dateA < now && a.status !== 'Completed';
      const bOverdue = dateB < now && b.status !== 'Completed';
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      return dateA - dateB;
    });
    
    setFilteredTasks(filtered);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    // Format datetime for input
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toISOString().slice(0, 16);
    
    setEditingTask({
      ...task,
      dueDate: formattedDate,
      farmId: task.farmId.toString(),
      cropId: task.cropId ? task.cropId.toString() : ''
    });
    setModalOpen(true);
  };

  const handleSubmitTask = async (formData) => {
    setModalLoading(true);
    
    try {
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        cropId: formData.cropId ? parseInt(formData.cropId, 10) : null,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id 
            ? { ...task, ...taskData }
            : task
        ));
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
      }
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStatus = async (taskId, updates) => {
    try {
      await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.Id === taskId 
          ? { ...task, ...updates }
          : task
      ));
    } catch (error) {
      throw error;
    }
  };

  // Update task fields with farm and crop options
  const updatedTaskFields = taskFields.map(field => {
    if (field.name === 'farmId') {
      return {
        ...field,
        options: farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))
      };
    }
    if (field.name === 'cropId') {
      return {
        ...field,
        options: crops
          .filter(crop => crop.status === 'Active')
          .map(crop => ({ value: crop.Id.toString(), label: `${crop.name} (${crop.variety})` }))
      };
    }
    return field;
  });

  const getFarmById = (farmId) => {
    return farms.find(farm => farm.Id === farmId);
  };

  const getCropById = (cropId) => {
    return crops.find(crop => crop.Id === cropId);
  };

  const clearFilters = () => {
    setFilters({ farm: '', status: '', priority: '' });
  };

  const hasActiveFilters = filters.farm || filters.status || filters.priority;

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <SkeletonLoader count={4} variant="list" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and track your farming activities
          </p>
        </div>
        
        <Button icon="Plus" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-warning">{taskStats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-info">{taskStats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-success">{taskStats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-error">{taskStats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-4">
          <ApperIcon name="Filter" size={16} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary"
            >
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Farm"
            value={filters.farm}
            onChange={(e) => setFilters(prev => ({ ...prev, farm: e.target.value }))}
            options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
            placeholder="All farms"
          />
          
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
            placeholder="All statuses"
          />
          
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' }
            ]}
            placeholder="All priorities"
          />
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="CheckSquare"
          title={hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
          description={hasActiveFilters 
            ? "Try adjusting your filters to see more tasks." 
            : "Stay organized by adding your first farm task."
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : "Add Your First Task"}
          onAction={hasActiveFilters ? clearFilters : handleAddTask}
        />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            {hasActiveFilters && (
              <span className="flex items-center gap-1">
                <ApperIcon name="Filter" size={14} />
                Filters applied
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TaskCard
                  task={task}
                  farm={getFarmById(task.farmId)}
                  crop={getCropById(task.cropId)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onUpdateStatus={handleUpdateStatus}
                  showFarmInfo={true}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTask}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        fields={updatedTaskFields}
        initialData={editingTask || { status: 'Pending', priority: 'Medium' }}
        loading={modalLoading}
      />
    </div>
  );
};

export default Tasks;