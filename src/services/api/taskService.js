import { toast } from 'react-toastify';

const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Task not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ],
        where: [{
          FieldName: "farm_id",
          Operator: "EqualTo",
          Values: [parseInt(farmId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by farm ID:", error);
      return [];
    }
  },

  async getTodaysTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [{
            operator: "AND",
            conditions: [
              {
                fieldName: "due_date",
                operator: "RelativeMatch",
                values: ["Today"]
              },
              {
                fieldName: "status",
                operator: "NotEqualTo",
                values: ["Completed"]
              }
            ]
          }]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: taskData.title || 'Task',
          title: taskData.title,
          description: taskData.description,
          due_date: new Date(taskData.dueDate).toISOString(),
          priority: taskData.priority,
          status: taskData.status,
          farm_id: parseInt(taskData.farmId, 10),
          crop_id: taskData.cropId ? parseInt(taskData.cropId, 10) : null
        }]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (taskData.title) updateData.Name = taskData.title;
      if (taskData.title) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate) updateData.due_date = new Date(taskData.dueDate).toISOString();
      if (taskData.priority) updateData.priority = taskData.priority;
      if (taskData.status) updateData.status = taskData.status;
      if (taskData.farmId) updateData.farm_id = parseInt(taskData.farmId, 10);
      if (taskData.cropId !== undefined) updateData.crop_id = taskData.cropId ? parseInt(taskData.cropId, 10) : null;
      
      // Auto-set completed_at when marking as completed
      if (taskData.status === 'Completed' && !taskData.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error);
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
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;