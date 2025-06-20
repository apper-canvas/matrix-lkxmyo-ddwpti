import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';
import taskService from '@/services/api/taskService';
import transactionService from '@/services/api/transactionService';
import SummaryCard from '@/components/molecules/SummaryCard';
import WeatherWidget from '@/components/molecules/WeatherWidget';
import TaskCard from '@/components/organisms/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    farms: [],
    activeCrops: [],
    todaysTasks: [],
    financialSummary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [farms, crops, todaysTasks, financialSummary] = await Promise.all([
          farmService.getAll(),
          cropService.getAll(),
          taskService.getTodaysTasks(),
          transactionService.getRecentSummary()
        ]);

        const activeCrops = crops.filter(crop => crop.status === 'Active');
        
        setDashboardData({
          farms,
          activeCrops,
          todaysTasks,
          financialSummary
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await taskService.update(taskId, updates);
      // Refresh today's tasks
      const updatedTasks = await taskService.getTodaysTasks();
      setDashboardData(prev => ({ ...prev, todaysTasks: updatedTasks }));
    } catch (error) {
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      // Refresh today's tasks
      const updatedTasks = await taskService.getTodaysTasks();
      setDashboardData(prev => ({ ...prev, todaysTasks: updatedTasks }));
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} count={1} variant="card" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonLoader count={3} variant="list" />
          </div>
          <div>
            <SkeletonLoader count={1} variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { farms, activeCrops, todaysTasks, financialSummary } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Good morning, John! 🌱
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening on your farms today
          </p>
        </div>
        
        <Button 
          icon="Plus" 
          onClick={() => navigate('/tasks')}
          className="hidden sm:flex"
        >
          Add Task
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Farms"
          value={farms.length}
          icon="MapPin"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        
        <SummaryCard
          title="Active Crops"
          value={activeCrops.length}
          icon="Wheat"
          color="success"
          trend="up"
          trendValue="+8%"
        />
        
        <SummaryCard
          title="Tasks Due Today"
          value={todaysTasks.length}
          icon="CheckSquare"
          color="warning"
          trend="neutral"
          trendValue="0%"
        />
        
        <SummaryCard
          title="Net Profit"
          value={`$${financialSummary?.netProfit?.toLocaleString() || '0'}`}
          icon="DollarSign"
          color="info"
          trend="up"
          trendValue="+15%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              View All
              <ApperIcon name="ArrowRight" size={14} className="ml-1" />
            </Button>
          </div>
          
          {todaysTasks.length === 0 ? (
            <EmptyState
              icon="CheckCircle"
              title="All caught up!"
              description="No tasks due today. Great job staying on top of your farm work!"
              actionLabel="View All Tasks"
              onAction={() => navigate('/tasks')}
            />
          ) : (
            <div className="space-y-3">
              {todaysTasks.slice(0, 5).map((task, index) => {
                const farm = farms.find(f => f.Id === task.farmId);
                const crop = activeCrops.find(c => c.Id === task.cropId);
                
                return (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard
                      task={task}
                      farm={farm}
                      crop={crop}
                      onEdit={() => navigate('/tasks')}
                      onDelete={handleTaskDelete}
                      onUpdateStatus={handleTaskUpdate}
                      showFarmInfo={true}
                    />
                  </motion.div>
                );
              })}
              
              {todaysTasks.length > 5 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/tasks')}
                  >
                    View {todaysTasks.length - 5} More Tasks
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weather Widget */}
        <div className="space-y-6">
          <WeatherWidget />
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm text-gray-600">This Month's Income</span>
                </div>
                <span className="font-semibold text-success">
                  ${financialSummary?.totalIncome?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingDown" size={16} className="text-error" />
                  <span className="text-sm text-gray-600">This Month's Expenses</span>
                </div>
                <span className="font-semibold text-error">
                  ${financialSummary?.totalExpenses?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Net Profit</span>
                  <span className={`font-bold ${
                    (financialSummary?.netProfit || 0) >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    ${financialSummary?.netProfit?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/finances')}
                className="w-full"
              >
                View Finances
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;