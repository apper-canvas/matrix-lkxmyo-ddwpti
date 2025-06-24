import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import cropService from '@/services/api/cropService';
import farmService from '@/services/api/farmService';
import CropCard from '@/components/organisms/CropCard';
import AddEditModal from '@/components/organisms/AddEditModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [filters, setFilters] = useState({
    farm: '',
    status: '',
    growthStage: ''
  });

const cropFields = [
    {
      name: 'farmId',
      label: 'Farm',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'name',
      label: 'Crop Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Tomatoes, Corn, Lettuce',
      icon: 'Wheat'
    },
    {
      name: 'variety',
      label: 'Variety',
      type: 'text',
      required: true,
      placeholder: 'e.g., Roma, Sweet Corn, Romaine',
      icon: 'Leaf'
    },
    {
      name: 'plantedDate',
      label: 'Planted Date',
      type: 'datepicker',
      required: true,
      icon: 'Calendar'
    },
    {
      name: 'expectedHarvest',
      label: 'Expected Harvest Date',
      type: 'datepicker',
      required: true,
      icon: 'Clock'
    },
    {
      name: 'areaPlanted',
      label: 'Area Planted (acres)',
      type: 'text',
      inputType: 'number',
      required: true,
      placeholder: '0.0',
      icon: 'Maximize2'
    },
    {
      name: 'growthStage',
      label: 'Growth Stage',
      type: 'select',
      required: true,
      options: [
        { value: 'Seedling', label: 'Seedling' },
        { value: 'Vegetative', label: 'Vegetative' },
        { value: 'Flowering', label: 'Flowering' },
        { value: 'Fruit Development', label: 'Fruit Development' },
        { value: 'Root Development', label: 'Root Development' },
        { value: 'Mature', label: 'Mature' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Harvested', label: 'Harvested' },
        { value: 'Failed', label: 'Failed' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [crops, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError(err.message || 'Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...crops];
    
    if (filters.farm) {
      filtered = filtered.filter(crop => crop.farmId === parseInt(filters.farm, 10));
    }
    
    if (filters.status) {
      filtered = filtered.filter(crop => crop.status === filters.status);
    }
    
    if (filters.growthStage) {
      filtered = filtered.filter(crop => crop.growthStage === filters.growthStage);
    }
    
    setFilteredCrops(filtered);
  };

  const handleAddCrop = () => {
    setEditingCrop(null);
    setModalOpen(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop({
      ...crop,
      plantedDate: crop.plantedDate ? crop.plantedDate.split('T')[0] : '',
      expectedHarvest: crop.expectedHarvest ? crop.expectedHarvest.split('T')[0] : ''
    });
    setModalOpen(true);
  };

  const handleSubmitCrop = async (formData) => {
    setModalLoading(true);
    
    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        areaPlanted: parseFloat(formData.areaPlanted),
        plantedDate: new Date(formData.plantedDate).toISOString(),
        expectedHarvest: new Date(formData.expectedHarvest).toISOString()
      };

      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(crop => 
          crop.Id === editingCrop.Id 
            ? { ...crop, ...cropData }
            : crop
        ));
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops(prev => [...prev, newCrop]);
      }
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(crop => crop.Id !== cropId));
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStatus = async (cropId, updates) => {
    try {
      await cropService.update(cropId, updates);
      setCrops(prev => prev.map(crop => 
        crop.Id === cropId 
          ? { ...crop, ...updates }
          : crop
      ));
    } catch (error) {
      throw error;
    }
  };

  // Update crop fields with farm options
  const updatedCropFields = cropFields.map(field => {
    if (field.name === 'farmId') {
      return {
        ...field,
        options: farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))
      };
    }
    return field;
  });

  const getFarmById = (farmId) => {
    return farms.find(farm => farm.Id === farmId);
  };

  const clearFilters = () => {
    setFilters({ farm: '', status: '', growthStage: '' });
  };

  const hasActiveFilters = filters.farm || filters.status || filters.growthStage;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
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
            Crop Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your crops from planting to harvest
          </p>
        </div>
        
        <Button icon="Plus" onClick={handleAddCrop}>
          Add Crop
        </Button>
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
              { value: 'Active', label: 'Active' },
              { value: 'Harvested', label: 'Harvested' },
              { value: 'Failed', label: 'Failed' }
            ]}
            placeholder="All statuses"
          />
          
          <Select
            label="Growth Stage"
            value={filters.growthStage}
            onChange={(e) => setFilters(prev => ({ ...prev, growthStage: e.target.value }))}
            options={[
              { value: 'Seedling', label: 'Seedling' },
              { value: 'Vegetative', label: 'Vegetative' },
              { value: 'Flowering', label: 'Flowering' },
              { value: 'Fruit Development', label: 'Fruit Development' },
              { value: 'Root Development', label: 'Root Development' },
              { value: 'Mature', label: 'Mature' }
            ]}
            placeholder="All stages"
          />
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon="Wheat"
          title={hasActiveFilters ? "No crops match your filters" : "No crops yet"}
          description={hasActiveFilters 
            ? "Try adjusting your filters to see more crops." 
            : "Start tracking your crops by adding your first planting."
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : "Add Your First Crop"}
          onAction={hasActiveFilters ? clearFilters : handleAddCrop}
        />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredCrops.length} of {crops.length} crops
            </span>
            {hasActiveFilters && (
              <span className="flex items-center gap-1">
                <ApperIcon name="Filter" size={14} />
                Filters applied
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCrops.map((crop, index) => (
              <motion.div
                key={crop.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CropCard
                  crop={crop}
                  farm={getFarmById(crop.farmId)}
                  onEdit={handleEditCrop}
                  onDelete={handleDeleteCrop}
                  onUpdateStatus={handleUpdateStatus}
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
        onSubmit={handleSubmitCrop}
        title={editingCrop ? 'Edit Crop' : 'Add New Crop'}
        fields={updatedCropFields}
        initialData={editingCrop || { status: 'Active' }}
        loading={modalLoading}
      />
    </div>
  );
};

export default Crops;