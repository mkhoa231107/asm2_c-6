<template>
  <div class="fooditems-management">
    <div class="page-header">
      <h1>Food Items Management</h1>
      <button @click="openAddModal" class="add-btn">+ Add New Food Item</button>
    </div>

    <div class="card table-container">
      <div class="filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search food items..." 
          class="search-input"
        />
        <select v-model="filterCategory" class="category-filter">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading food items...</div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="food in filteredFoods" :key="food.id">
              <td>#{{ food.id }}</td>
              <td>
                <div class="food-thumb">🍔</div>
              </td>
              <td>
                <strong>{{ food.name }}</strong>
                <p class="description">{{ food.description }}</p>
              </td>
              <td>{{ food.categoryName }}</td>
              <td class="price">${{ food.price }}</td>
              <td>
                <span :class="['status-badge', food.isAvailable ? 'available' : 'unavailable']">
                  {{ food.isAvailable ? 'Available' : 'Unavailable' }}
                </span>
              </td>
              <td>{{ formatDate(food.createdAt) }}</td>
              <td class="actions">
                <button @click="editFood(food)" class="edit-btn">Edit</button>
                <button @click="deleteFood(food)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content card" @click.stop>
        <h2>{{ isEditing ? 'Edit Food Item' : 'Add New Food Item' }}</h2>
        
        <form @submit.prevent="saveFood">
          <div class="form-group">
            <label>Food Name *</label>
            <input v-model="foodForm.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea v-model="foodForm.description" rows="3" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price ($) *</label>
              <input v-model.number="foodForm.price" type="number" step="0.01" required />
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select v-model="foodForm.categoryId" required>
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="foodForm.imageUrl" type="text" placeholder="image.jpg" />
          </div>

          <div class="form-group checkbox">
            <label>
              <input v-model="foodForm.isAvailable" type="checkbox" />
              Available for order
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">
              {{ isEditing ? 'Save Changes' : 'Add Food Item' }}
            </button>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'FoodItemsManagement',
  data() {
    return {
      foods: [],
      categories: [],
      searchQuery: '',
      filterCategory: '',
      loading: true,
      showModal: false,
      isEditing: false,
      foodForm: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        imageUrl: '',
        isAvailable: true
      },
      error: ''
    };
  },
  computed: {
    filteredFoods() {
      let filtered = this.foods;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(food => 
          food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query)
        );
      }
      
      if (this.filterCategory) {
        filtered = filtered.filter(food => food.categoryId === parseInt(this.filterCategory));
      }
      
      return filtered;
    }
  },
  async mounted() {
    await this.loadCategories();
    await this.loadFoods();
  },
  methods: {
    async loadCategories() {
      try {
        const response = await api.getCategories();
        this.categories = response.data;
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    async loadFoods() {
      try {
        const response = await api.getFoodItems({});
        this.foods = response.data;
      } catch (error) {
        console.error('Error loading foods:', error);
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.foodForm = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        imageUrl: '',
        isAvailable: true
      };
      this.showModal = true;
    },
    editFood(food) {
      this.isEditing = true;
      this.foodForm = { ...food };
      this.showModal = true;
    },
    async saveFood() {
      this.error = '';
      
      try {
        if (this.isEditing) {
          await api.updateFoodItem(this.foodForm.id, this.foodForm);
          alert('Food item updated successfully!');
        } else {
          await api.createFoodItem(this.foodForm);
          alert('Food item added successfully!');
        }
        
        await this.loadFoods();
        this.closeModal();
      } catch (error) {
        this.error = error.response?.data?.message || 'Operation failed';
      }
    },
    async deleteFood(food) {
      if (confirm(`Are you sure you want to delete "${food.name}"?`)) {
        try {
          await api.deleteFoodItem(food.id);
          alert('Food item deleted successfully!');
          await this.loadFoods();
        } catch (error) {
          alert('Failed to delete food item');
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.error = '';
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US');
    }
  }
};
</script>

<style scoped>
.fooditems-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.add-btn {
  background-color: #28a745;
}

.table-container {
  padding: 25px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 2;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.category-filter {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f9fa;
}

th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.food-thumb {
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.description {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.price {
  font-weight: bold;
  color: #ff6b6b;
  font-size: 18px;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.available {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-badge.unavailable {
  background-color: #f8d7da;
  color: #842029;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  padding: 6px 12px;
  background-color: #3b82f6;
  font-size: 14px;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
}

.modal-content h2 {
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group.checkbox input {
  width: auto;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.cancel-btn {
  flex: 1;
  background-color: #6c757d;
}

.save-btn {
  flex: 1;
  background-color: #28a745;
}

.error {
  margin-top: 15px;
  padding: 12px;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 5px;
  text-align: center;
}
</style>