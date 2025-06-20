import transactionData from '../mockData/transactions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let transactions = [...transactionData];

const transactionService = {
  async getAll() {
    await delay(300);
    return [...transactions];
  },

  async getById(id) {
    await delay(200);
    const transaction = transactions.find(t => t.Id === parseInt(id, 10));
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return { ...transaction };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return transactions.filter(t => t.farmId === parseInt(farmId, 10)).map(t => ({ ...t }));
  },

  async getRecentSummary() {
    await delay(200);
    const income = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses,
      transactionCount: transactions.length
    };
  },

  async create(transactionData) {
    await delay(400);
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...transactions.map(t => t.Id), 0) + 1,
      farmId: parseInt(transactionData.farmId, 10)
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay(350);
    const index = transactions.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    const updatedTransaction = { 
      ...transactions[index], 
      ...transactionData,
      farmId: transactionData.farmId ? parseInt(transactionData.farmId, 10) : transactions[index].farmId
    };
    transactions[index] = updatedTransaction;
    return { ...updatedTransaction };
  },

  async delete(id) {
    await delay(300);
    const index = transactions.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    transactions.splice(index, 1);
    return true;
  }
};

export default transactionService;