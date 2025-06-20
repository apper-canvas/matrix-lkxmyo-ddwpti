import cropData from '../mockData/crops.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let crops = [...cropData];

const cropService = {
  async getAll() {
    await delay(300);
    return [...crops];
  },

  async getById(id) {
    await delay(200);
    const crop = crops.find(c => c.Id === parseInt(id, 10));
    if (!crop) {
      throw new Error('Crop not found');
    }
    return { ...crop };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return crops.filter(c => c.farmId === parseInt(farmId, 10)).map(c => ({ ...c }));
  },

  async create(cropData) {
    await delay(400);
    const newCrop = {
      ...cropData,
      Id: Math.max(...crops.map(c => c.Id), 0) + 1,
      farmId: parseInt(cropData.farmId, 10)
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay(350);
    const index = crops.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Crop not found');
    }
    const updatedCrop = { 
      ...crops[index], 
      ...cropData,
      farmId: cropData.farmId ? parseInt(cropData.farmId, 10) : crops[index].farmId
    };
    crops[index] = updatedCrop;
    return { ...updatedCrop };
  },

  async delete(id) {
    await delay(300);
    const index = crops.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Crop not found');
    }
    crops.splice(index, 1);
    return true;
  }
};

export default cropService;