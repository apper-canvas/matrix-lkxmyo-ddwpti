import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import farmService from '@/services/api/farmService';
import cropService from '@/services/api/cropService';
import FarmCard from '@/components/organisms/FarmCard';
import AddEditModal from '@/components/organisms/AddEditModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const farmFields = [
    {
      name: 'name',
      label: 'Farm Name',
      type: 'text',
      required: true,
      placeholder: 'Enter farm name',
      icon: 'MapPin'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      placeholder: 'City, State',
      icon: 'Globe'
    },
    {
      name: 'totalArea',
      label: 'Total Area',
      type: 'number',
      inputType: 'number',
      required: true,
      placeholder: '0',
      icon: 'Maximize2'
    },
    {
      name: 'areaUnit',
      label: 'Area Unit',
      type: 'select',
      required: true,
      options: [
        { value: 'acres', label: 'Acres' },
        { value: 'hectares', label: 'Hectares' },
        { value: 'sq ft', label: 'Square Feet' },
        { value: 'sq m', label: 'Square Meters' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message || 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = () => {
    setEditingFarm(null);
    setModalOpen(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setModalOpen(true);
  };

  const handleSubmitFarm = async (formData) => {
    setModalLoading(true);
    
    try {
      const farmData = {
        ...formData,
        totalArea: parseFloat(formData.totalArea)
      };

      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        setFarms(prev => prev.map(farm => 
          farm.Id === editingFarm.Id 
            ? { ...farm, ...farmData }
            : farm
        ));
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms(prev => [...prev, newFarm]);
      }
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteFarm = async (farmId) => {
    try {
      await farmService.delete(farmId);
      setFarms(prev => prev.filter(farm => farm.Id !== farmId));
      
      // Also remove associated crops
      setCrops(prev => prev.filter(crop => crop.farmId !== farmId));
    } catch (error) {
      throw error;
    }
  };

  const getActiveCropsCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId && crop.status === 'Active').length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
        <SkeletonLoader count={4} variant="card" />
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
            My Farms
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your farm locations and properties
          </p>
        </div>
        
        <Button icon="Plus" onClick={handleAddFarm}>
          Add Farm
        </Button>
      </div>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No farms yet"
          description="Start by adding your first farm to begin tracking your agricultural operations."
          actionLabel="Add Your First Farm"
          onAction={handleAddFarm}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FarmCard
                farm={farm}
                activeCropsCount={getActiveCropsCount(farm.Id)}
                onEdit={handleEditFarm}
                onDelete={handleDeleteFarm}
                className="group"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Farm Statistics */}
      {farms.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {farms.length}
              </div>
              <div className="text-sm text-gray-600">Total Farms</div>
            </div>
            
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {farms.reduce((sum, farm) => sum + farm.totalArea, 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Area (acres)</div>
            </div>
            
            <div className="text-center p-4 bg-info/5 rounded-lg">
              <div className="text-2xl font-bold text-info">
                {crops.filter(crop => crop.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Crops</div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitFarm}
        title={editingFarm ? 'Edit Farm' : 'Add New Farm'}
        fields={farmFields}
        initialData={editingFarm || {}}
        loading={modalLoading}
      />
    </div>
  );
};

export default Farms;