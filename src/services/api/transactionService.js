import { toast } from 'react-toastify';

const transactionService = {
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('transaction', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Transaction not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
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
          { field: { Name: "type" } },
          { field: { Name: "category" } },
          { field: { Name: "amount" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "farm_id" } }
        ],
        where: [{
          FieldName: "farm_id",
          Operator: "EqualTo",
          Values: [parseInt(farmId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by farm ID:", error);
      return [];
    }
  },

  async getRecentSummary() {
    try {
      const transactions = await this.getAll();
      
      const income = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const expenses = transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      return {
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        transactionCount: transactions.length
      };
    } catch (error) {
      console.error("Error getting recent summary:", error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        transactionCount: 0
      };
    }
  },

  async create(transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: transactionData.description || 'Transaction',
          type: transactionData.type,
          category: transactionData.category,
          amount: parseFloat(transactionData.amount),
          description: transactionData.description,
          date: new Date(transactionData.date).toISOString(),
          farm_id: parseInt(transactionData.farmId, 10)
        }]
      };
      
      const response = await apperClient.createRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} transactions:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create transaction');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  async update(id, transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (transactionData.description) updateData.Name = transactionData.description;
      if (transactionData.type) updateData.type = transactionData.type;
      if (transactionData.category) updateData.category = transactionData.category;
      if (transactionData.amount !== undefined) updateData.amount = parseFloat(transactionData.amount);
      if (transactionData.description) updateData.description = transactionData.description;
      if (transactionData.date) updateData.date = new Date(transactionData.date).toISOString();
      if (transactionData.farmId) updateData.farm_id = parseInt(transactionData.farmId, 10);
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} transactions:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update transaction');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
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
      
      const response = await apperClient.deleteRecord('transaction', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} transactions:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete transaction');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
};

export default transactionService;