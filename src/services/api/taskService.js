import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return tasks.filter(t => t.farmId === parseInt(farmId, 10)).map(t => ({ ...t }));
  },

  async getTodaysTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDate === today && t.status !== 'Completed';
    }).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      farmId: parseInt(taskData.farmId, 10),
      cropId: taskData.cropId ? parseInt(taskData.cropId, 10) : null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    const updatedTask = { 
      ...tasks[index], 
      ...taskData,
      farmId: taskData.farmId ? parseInt(taskData.farmId, 10) : tasks[index].farmId,
      cropId: taskData.cropId ? parseInt(taskData.cropId, 10) : tasks[index].cropId,
      completedAt: taskData.status === 'Completed' && !tasks[index].completedAt 
        ? new Date().toISOString() 
        : tasks[index].completedAt
    };
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  }
};

export default taskService;