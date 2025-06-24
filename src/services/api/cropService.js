import { toast } from 'react-toastify';

const cropService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "variety" } },
          { field: { Name: "planted_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "area_planted" } },
          { field: { Name: "growth_stage" } },
          { field: { Name: "status" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "variety" } },
          { field: { Name: "planted_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "area_planted" } },
          { field: { Name: "growth_stage" } },
          { field: { Name: "status" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('crop', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Crop not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  },

  async getByFarmId(farmId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "variety" } },
          { field: { Name: "planted_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "area_planted" } },
          { field: { Name: "growth_stage" } },
          { field: { Name: "status" } },
          { field: { Name: "farm_id" } }
        ],
        where: [{
          FieldName: "farm_id",
          Operator: "EqualTo",
          Values: [parseInt(farmId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm ID:", error);
      return [];
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cropData.name,
          variety: cropData.variety,
          planted_date: new Date(cropData.plantedDate).toISOString(),
          expected_harvest: new Date(cropData.expectedHarvest).toISOString(),
          area_planted: parseFloat(cropData.areaPlanted),
          growth_stage: cropData.growthStage,
          status: cropData.status,
          farm_id: parseInt(cropData.farmId, 10)
        }]
      };
      
      const response = await apperClient.createRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} crops:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create crop');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (cropData.name) updateData.Name = cropData.name;
      if (cropData.variety) updateData.variety = cropData.variety;
      if (cropData.plantedDate) updateData.planted_date = new Date(cropData.plantedDate).toISOString();
      if (cropData.expectedHarvest) updateData.expected_harvest = new Date(cropData.expectedHarvest).toISOString();
      if (cropData.areaPlanted !== undefined) updateData.area_planted = parseFloat(cropData.areaPlanted);
      if (cropData.growthStage) updateData.growth_stage = cropData.growthStage;
      if (cropData.status) updateData.status = cropData.status;
      if (cropData.farmId) updateData.farm_id = parseInt(cropData.farmId, 10);
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} crops:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update crop');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating crop:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} crops:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete crop');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
};

export default cropService;