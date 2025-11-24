<template>
  <div class="combos-management">
    <div class="page-header">
      <h1>Combo Management</h1>
      <button @click="openAddModal" class="add-btn">+ Add New Combo</button>
    </div>

    <div v-if="loading" class="loading">Loading combos...</div>

    <div v-else class="combos-grid">
      <div v-for="combo in combos" :key="combo.id" class="combo-card card">
        <div class="combo-image">🎁</div>
        
        <div class="combo-info">
          <h3>{{ combo.name }}</h3>
          <p class="combo-description">{{ combo.description }}</p>
          
          <div class="combo-items">
            <p class="items-label">Includes:</p>
            <ul>
              <li v-for="item in combo.items" :key="item.foodItemId">
                {{ item.quantity }}x {{ item.foodItemName }}
              </li>
            </ul>
          </div>
          
          <div class="pricing">
            <span class="original-price">${{ combo.originalPrice }}</span>
            <span class="sale-price">${{ combo.price }}</span>
            <span class="discount">Save ${{ (combo.originalPrice - combo.price).toFixed(2) }}</span>
          </div>

          <div class="combo-status">
            <span :class="['status-badge', combo.isAvailable ? 'available' : 'unavailable']">
              {{ combo.isAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
        </div>

        <div class="combo-actions">
          <button @click="editCombo(combo)" class="edit-btn">Edit</button>
          <button @click="deleteCombo(combo)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content card" @click.stop>
        <h2>{{ isEditing ? 'Edit Combo' : 'Add New Combo' }}</h2>
        
        <form @submit.prevent="saveCombo">
          <div class="form-group">
            <label>Combo Name *</label>
            <input v-model="comboForm.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea v-model="comboForm.description" rows="3" required></textarea>
          </div>

          <div class="form-group">
            <label>Combo Price ($) *</label>
            <input v-model.number="comboForm.price" type="number" step="0.01" required />
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="comboForm.imageUrl" type="text" placeholder="combo.jpg" />
          </div>

          <div class="form-group">
            <label>Combo Items *</label>
            <div class="items-list">
              <div v-for="(item, index) in comboForm.items" :key="index" class="item-row">
                <select v-model="item.foodItemId" required>
                  <option value="">Select Food Item</option>
                  <option v-for="food in foodItems" :key="food.id" :value="food.id">
                    {{ food.name }} (${{ food.price }})
                  </option>
                </select>
                <input 
                  v-model.number="item.quantity" 
                  type="number" 
                  min="1" 
                  placeholder="Qty"
                  required 
                />
                <button type="button" @click="removeItem(index)" class="remove-item-btn">×</button>
              </div>
            </div>
            <button type="button" @click="addItem" class="add-item-btn">+ Add Item</button>
          </div>

          <div class="calculated-info">
            <p><strong>Original Total:</strong> ${{ calculateOriginalPrice() }}</p>
            <p><strong>Your Price:</strong> ${{ comboForm.price }}</p>
            <p class="savings">Savings: ${{ (calculateOriginalPrice() - comboForm.price).toFixed(2) }}</p>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">
              {{ isEditing ? 'Save Changes' : 'Add Combo' }}
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
  name: 'CombosManagement',
  data() {
    return {
      combos: [],
      foodItems: [],
      loading: true,
      showModal: false,
      isEditing: false,
      comboForm: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        items: []
      },
      error: ''
    };
  },
  async mounted() {
    await this.loadFoodItems();
    await this.loadCombos();
  },
  methods: {
    async loadCombos() {
      try {
        const response = await api.getCombos();
        this.combos = response.data;
      } catch (error) {
        console.error('Error loading combos:', error);
      } finally {
        this.loading = false;
      }
    },
    async loadFoodItems() {
      try {
        const response = await api.getFoodItems({});
        this.foodItems = response.data;
      } catch (error) {
        console.error('Error loading food items:', error);
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.comboForm = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        items: [{ foodItemId: '', quantity: 1 }]
      };
      this.showModal = true;
    },
    editCombo(combo) {
      this.isEditing = true;
      this.comboForm = {
        id: combo.id,
        name: combo.name,
        description: combo.description,
        price: combo.price,
        imageUrl: combo.imageUrl,
        items: combo.items.map(item => ({
          foodItemId: item.foodItemId,
          quantity: item.quantity
        }))
      };
      this.showModal = true;
    },
    addItem() {
      this.comboForm.items.push({ foodItemId: '', quantity: 1 });
    },
    removeItem(index) {
      this.comboForm.items.splice(index, 1);
      if (this.comboForm.items.length === 0) {
        this.addItem();
      }
    },
    calculateOriginalPrice() {
      return this.comboForm.items.reduce((sum, item) => {
        const food = this.foodItems.find(f => f.id === item.foodItemId);
        return sum + (food ? food.price * item.quantity : 0);
      }, 0);
    },
    async saveCombo() {
      this.error = '';
      
      if (this.comboForm.items.length === 0) {
        this.error = 'Please add at least one item to the combo';
        return;
      }

      try {
        const data = {
          name: this.comboForm.name,
          description: this.comboForm.description,
          price: this.comboForm.price,
          imageUrl: this.comboForm.imageUrl || 'combo.jpg',
          items: this.comboForm.items
        };

        if (this.isEditing) {
          await api.updateCombo(this.comboForm.id, data);
          alert('Combo updated successfully!');
        } else {
          await api.createCombo(data);
          alert('Combo added successfully!');
        }
        
        await this.loadCombos();
        this.closeModal();
      } catch (error) {
        this.error = error.response?.data?.message || 'Operation failed';
      }
    },
    async deleteCombo(combo) {
      if (confirm(`Are you sure you want to delete "${combo.name}"?`)) {
        try {
          await api.deleteCombo(combo.id);
          alert('Combo deleted successfully!');
          await this.loadCombos();
        } catch (error) {
          alert('Failed to delete combo');
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.error = '';
    }
  }
};
</script>

<style scoped>
.combos-management {
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

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.combos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.combo-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.combo-image {
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
}

.combo-info {
  flex: 1;
}

.combo-info h3 {
  font-size: 22px;
  margin-bottom: 10px;
  color: #333;
}

.combo-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.combo-items {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.items-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.combo-items ul {
  list-style: none;
  padding: 0;
}

.combo-items li {
  padding: 5px 0;
  color: #666;
}

.pricing {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 16px;
}

.sale-price {
  font-size: 28px;
  font-weight: bold;
  color: #ff6b6b;
}

.discount {
  background-color: #d1e7dd;
  color: #0f5132;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.combo-status {
  margin-bottom: 15px;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 13px;
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

.combo-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  flex: 1;
  background-color: #3b82f6;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.delete-btn {
  flex: 1;
  background-color: #dc3545;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
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

.items-list {
  margin-bottom: 10px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 10px;
  margin-bottom: 10px;
}

.remove-item-btn {
  width: 40px;
  background-color: #dc3545;
  padding: 8px;
  font-size: 20px;
  line-height: 1;
}

.add-item-btn {
  background-color: #28a745;
  padding: 10px;
  width: 100%;
}

.calculated-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.calculated-info p {
  margin-bottom: 5px;
  color: #555;
}

.savings {
  color: #28a745;
  font-weight: bold;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  gap: 15px;
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