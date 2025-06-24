import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import transactionService from '@/services/api/transactionService';
import farmService from '@/services/api/farmService';
import TransactionRow from '@/components/organisms/TransactionRow';
import AddEditModal from '@/components/organisms/AddEditModal';
import SummaryCard from '@/components/molecules/SummaryCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    farm: '',
    type: '',
    category: ''
  });

  const transactionFields = [
    {
      name: 'farmId',
      label: 'Farm',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Income', label: 'Income' },
        { value: 'Expense', label: 'Expense' }
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'Seeds', label: 'Seeds' },
        { value: 'Fertilizer', label: 'Fertilizer' },
        { value: 'Equipment', label: 'Equipment' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Labor', label: 'Labor' },
        { value: 'Produce Sales', label: 'Produce Sales' },
        { value: 'Wine Sales', label: 'Wine Sales' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      name: 'amount',
      label: 'Amount ($)',
      type: 'text',
      inputType: 'number',
      required: true,
      placeholder: '0.00',
      icon: 'DollarSign'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      placeholder: 'Brief description of the transaction',
      icon: 'FileText'
    },
{
      name: 'date',
      label: 'Date',
      type: 'datepicker',
      required: true,
      icon: 'Calendar'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      setError(err.message || 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];
    
    if (filters.farm) {
      filtered = filtered.filter(transaction => 
        transaction.farmId === parseInt(filters.farm, 10)
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }
    
    if (filters.category) {
      filtered = filtered.filter(transaction => transaction.category === filters.category);
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction({
      ...transaction,
      date: transaction.date ? transaction.date.split('T')[0] : '',
      farmId: transaction.farmId.toString()
    });
    setModalOpen(true);
  };

  const handleSubmitTransaction = async (formData) => {
    setModalLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prev => prev.map(transaction => 
          transaction.Id === editingTransaction.Id 
            ? { ...transaction, ...transactionData }
            : transaction
        ));
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await transactionService.delete(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.Id !== transactionId));
    } catch (error) {
      throw error;
    }
  };

  // Update transaction fields with farm options
  const updatedTransactionFields = transactionFields.map(field => {
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
    setFilters({ farm: '', type: '', category: '' });
  };

  const hasActiveFilters = filters.farm || filters.type || filters.category;

  // Calculate financial summary
  const financialSummary = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'Income') {
      acc.totalIncome += transaction.amount;
    } else {
      acc.totalExpenses += transaction.amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });

  financialSummary.netProfit = financialSummary.totalIncome - financialSummary.totalExpenses;

  // Get this month's data
  const thisMonth = new Date();
  const monthStart = startOfMonth(thisMonth);
  const monthEnd = endOfMonth(thisMonth);
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  const thisMonthSummary = thisMonthTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'Income') {
      acc.income += transaction.amount;
    } else {
      acc.expenses += transaction.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonLoader key={i} count={1} variant="card" />
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
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your farm income and expenses
          </p>
        </div>
        
        <Button icon="Plus" onClick={handleAddTransaction}>
          Add Transaction
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="This Month's Income"
          value={`$${thisMonthSummary.income.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
          trend="up"
          trendValue="+8.2%"
        />
        
        <SummaryCard
          title="This Month's Expenses"
          value={`$${thisMonthSummary.expenses.toLocaleString()}`}
          icon="TrendingDown"
          color="error"
          trend="down"
          trendValue="-3.1%"
        />
        
        <SummaryCard
          title="Net Profit (Filtered)"
          value={`$${financialSummary.netProfit.toLocaleString()}`}
          icon="DollarSign"
          color={financialSummary.netProfit >= 0 ? 'success' : 'error'}
          trend={financialSummary.netProfit >= 0 ? 'up' : 'down'}
          trendValue={`${financialSummary.netProfit >= 0 ? '+' : ''}${(
            (financialSummary.netProfit / Math.max(financialSummary.totalExpenses, 1)) * 100
          ).toFixed(1)}%`}
        />
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
            label="Type"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'Income', label: 'Income' },
              { value: 'Expense', label: 'Expense' }
            ]}
            placeholder="All types"
          />
          
          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            options={[
              { value: 'Seeds', label: 'Seeds' },
              { value: 'Fertilizer', label: 'Fertilizer' },
              { value: 'Equipment', label: 'Equipment' },
              { value: 'Utilities', label: 'Utilities' },
              { value: 'Labor', label: 'Labor' },
              { value: 'Produce Sales', label: 'Produce Sales' },
              { value: 'Wine Sales', label: 'Wine Sales' },
              { value: 'Other', label: 'Other' }
            ]}
            placeholder="All categories"
          />
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="DollarSign"
          title={hasActiveFilters ? "No transactions match your filters" : "No transactions yet"}
          description={hasActiveFilters 
            ? "Try adjusting your filters to see more transactions." 
            : "Start tracking your farm finances by adding your first transaction."
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : "Add Your First Transaction"}
          onAction={hasActiveFilters ? clearFilters : handleAddTransaction}
        />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
            {hasActiveFilters && (
              <span className="flex items-center gap-1">
                <ApperIcon name="Filter" size={14} />
                Filters applied
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TransactionRow
                  transaction={transaction}
                  farm={getFarmById(transaction.farmId)}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
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
        onSubmit={handleSubmitTransaction}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        fields={updatedTransactionFields}
        initialData={editingTransaction || { type: 'Expense' }}
        loading={modalLoading}
      />
    </div>
  );
};

export default Finances;