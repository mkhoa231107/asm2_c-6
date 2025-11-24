
<template>
  <div class="food-card">
    <div class="food-image">
      <span class="emoji">🍔</span>
      <span v-if="!food.isAvailable" class="sold-out-badge">Sold Out</span>
    </div>
    
    <div class="food-content">
      <div class="food-header">
        <h3>{{ food.name }}</h3>
        <span class="category-badge">{{ food.categoryName }}</span>
      </div>
      
      <p class="description">{{ food.description }}</p>
      
      <div class="card-footer">
        <span class="price">${{ food.price }}</span>
        <div class="actions">
          <router-link :to="`/foods/${food.id}`" class="view-btn">
            Details
          </router-link>
          <button 
            @click="addToCart" 
            :disabled="!food.isAvailable"
            class="add-btn"
          >
            {{ food.isAvailable ? 'Add to Cart' : 'Out of Stock' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    food: {
      type: Object,
      required: true
    }
  },
  methods: {
    addToCart() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === this.food.id && item.type === 'food');
      
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ ...this.food, quantity: 1, type: 'food' });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      
      this.$emit('added-to-cart', this.food);
    }
  }
};
</script>

<style scoped>
.food-card {
  background: var(--card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.28s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.food-card:hover {
  border-color: var(--accent);
  box-shadow: 0 12px 30px rgba(2,6,23,0.6);
  transform: translateY(-6px);
}

.food-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
}

.emoji {
  background: white;
}

  border: 1px solid rgba(15,23,42,0.06);
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #dc2626;
  background-color: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  border-radius: 20px;
  border-color: rgba(239,68,68,0.12);
  font-weight: 600;
}

.food-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
  background-color: #f9fafb;
.food-header {
  margin-bottom: 12px;
}

.food-content h3 {
  margin-bottom: 8px;
  font-size: 18px;
  color: #111827;
  font-weight: 600;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fef2f2;
  margin-bottom: 8px;
    color: #0b1220;
  color: var(--text);
  font-weight: 600;
  border: 1px solid #fecaca;
}

.description {
    background-color: #fff1f0;
  background-color: rgba(239,68,68,0.06);
  color: var(--accent);
  border-radius: 12px;
  font-size: 12px;
    border: 1px solid rgba(239,68,68,0.12);
  border: 1px solid rgba(255,255,255,0.03);
  overflow: hidden;
  flex: 1;
    color: #6b7280;
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  display: block;
  margin-bottom: 12px;
}
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
  display: block;
  margin-bottom: 12px;

.view-btn {
  flex: 1;
  flex: 1;
  padding: 10px;
  background-color: rgba(255,255,255,0.02);
  color: var(--text);
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.2s;

.view-btn:hover {
  background-color: #f3f4f6;
  background-color: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.06);

.add-btn {
  flex: 1;
  flex: 1;
  padding: 10px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

.add-btn:hover:not(:disabled) {
  background-color: #dc2626;
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(220,38,38,0.28);

.add-btn:disabled {
  background-color: #d1d5db;
  background-color: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.5);
  cursor: not-allowed;
  transform: none;

@media (max-width: 640px) {
  .actions {
    flex-direction: column;
  }
  
  .view-btn,
  .add-btn {
    width: 100%;
  }
}
</style>