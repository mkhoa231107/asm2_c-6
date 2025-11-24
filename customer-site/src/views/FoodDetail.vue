<template>
  <div class="food-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
    
    <div v-else-if="food" class="card detail-container">
      <div class="food-image">
        <div class="image-placeholder">🍔</div>
      </div>
      
      <div class="food-info">
        <div class="food-header">
          <h1>{{ food.name }}</h1>
          <span class="category-badge">{{ food.categoryName }}</span>
        </div>
        
        <div class="description-section">
          <h3>Description</h3>
          <p>{{ food.description }}</p>
        </div>
        
        <div class="price-section">
          <span class="price">${{ food.price }}</span>
          <span v-if="!food.isAvailable" class="out-of-stock">Out of Stock</span>
        </div>
        
        <div class="quantity-selector">
          <label>Quantity:</label>
          <div class="qty-controls">
            <button @click="quantity > 1 && quantity--" class="qty-btn">−</button>
            <span class="quantity">{{ quantity }}</span>
            <button @click="quantity++" class="qty-btn">+</button>
          </div>
        </div>
        
        <div class="actions">
          <button 
            @click="addToCart" 
            :disabled="!food.isAvailable"
            class="add-to-cart-btn"
          >
            Add to Cart - ${{ (food.price * quantity).toFixed(2) }}
          </button>
          <button @click="$router.back()" class="back-btn">Back to Menu</button>
        </div>
      </div>
    </div>
    
    <div v-else class="error-state card">
      <div class="error-icon">❌</div>
      <p>Food item not found</p>
      <router-link to="/foods">Back to Menu</router-link>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'FoodDetail',
  data() {
    return {
      food: null,
      loading: true,
      quantity: 1
    };
  },
  async mounted() {
    await this.loadFood();
  },
  methods: {
    async loadFood() {
      try {
        const id = this.$route.params.id;
        const response = await api.getFoodItem(id);
        this.food = response.data;
      } catch (error) {
        console.error('Error loading food:', error);
      } finally {
        this.loading = false;
      }
    },
    addToCart() {
      if (!this.food.isAvailable) return;
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === this.food.id && item.type === 'food');
      
      if (existing) {
        existing.quantity += this.quantity;
      } else {
        cart.push({ 
          ...this.food, 
          quantity: this.quantity, 
          type: 'food' 
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      
      alert(`Added ${this.quantity} ${this.food.name} to cart!`);
      this.quantity = 1;
    }
  }
};
</script>

<style scoped>
.food-detail {
  max-width: 1200px;
  margin: 40px auto;
}

.loading {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #ef4444;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  color: #6b7280;
}

.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding: 40px;
}

.food-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-radius: 12px;
  min-height: 450px;
  border: 2px solid #e5e7eb;
}

.image-placeholder {
  font-size: 160px;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.food-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.food-info h1 {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.category-badge {
  display: inline-block;
  padding: 6px 16px;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #fecaca;
  width: fit-content;
}

.description-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.description-section p {
  color: #6b7280;
  line-height: 1.7;
  font-size: 15px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.price {
  font-size: 42px;
  font-weight: 700;
  color: #ef4444;
}

.out-of-stock {
  padding: 6px 16px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #fecaca;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.quantity-selector label {
  font-weight: 600;
  color: #374151;
  font-size: 15px;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.qty-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background-color: #fef2f2;
}

.quantity {
  font-size: 24px;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
  color: #111827;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.add-to-cart-btn {
  flex: 2;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.add-to-cart-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.back-btn {
  flex: 1;
  padding: 16px;
  background-color: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.error-state {
  text-align: center;
  padding: 80px 40px;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.error-state p {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 24px;
}

.error-state a {
  display: inline-block;
  padding: 12px 32px;
  background-color: #ef4444;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.error-state a:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .food-image {
    min-height: 350px;
  }
}

@media (max-width: 640px) {
  .food-info h1 {
    font-size: 28px;
  }
  
  .price {
    font-size: 32px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>