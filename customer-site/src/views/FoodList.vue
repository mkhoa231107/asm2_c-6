<template>
  <div class="food-list">
    <div class="header">
      <h1>Our Menu</h1>
      <p class="subtitle">Discover our delicious selection</p>
    </div>
    
    <div class="filters card">
      <input 
        v-model="search" 
        @input="loadFoods" 
        type="text" 
        placeholder="Search by name..." 
        class="search-input"
      />
      
      <select v-model="categoryId" @change="loadFoods" class="category-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <input 
        v-model="minPrice" 
        @input="loadFoods" 
        type="number" 
        placeholder="Min $" 
        class="price-input"
      />
      
      <input 
        v-model="maxPrice" 
        @input="loadFoods" 
        type="number" 
        placeholder="Max $" 
        class="price-input"
      />
    </div>

    <div class="food-grid">
      <div v-for="food in foods" :key="food.id" class="food-card">
        <div class="food-image">🍔</div>
        <div class="food-content">
          <div class="food-header">
            <h3>{{ food.name }}</h3>
            <span class="category-badge">{{ food.categoryName }}</span>
          </div>
          <p class="description">{{ food.description }}</p>
          <div class="card-footer">
            <p class="price">${{ food.price }}</p>
            <div class="actions">
              <router-link :to="`/foods/${food.id}`" class="view-btn">Details</router-link>
              <button @click="addToCart(food)" class="add-btn">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'FoodList',
  data() {
    return {
      foods: [],
      categories: [],
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: ''
    };
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
        const params = {
          search: this.search || undefined,
          categoryId: this.categoryId || undefined,
          minPrice: this.minPrice || undefined,
          maxPrice: this.maxPrice || undefined
        };
        const response = await api.getFoodItems(params);
        this.foods = response.data;
      } catch (error) {
        console.error('Error loading foods:', error);
      }
    },
    addToCart(food) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === food.id && item.type === 'food');
      
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ ...food, quantity: 1, type: 'food' });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      alert('Added to cart!');
    }
  }
};
</script>

<style scoped>
.food-list {
  max-width: var(--max-width);
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: var(--muted);
}

.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 0.8fr;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: transparent;
}

.search-input,
.category-select,
.price-input {
  padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: rgba(255,255,255,0.02);
  color: var(--text);
}

.search-input:focus,
.category-select:focus,
.price-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 6px rgba(239,68,68,0.06);
}

.category-select {
  cursor: pointer;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.food-card {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,0.06);
  overflow: hidden;
  transition: all 0.28s;
  display: flex;
  flex-direction: column;
}

.food-card:hover {
  border-color: rgba(239,68,68,0.12);
  box-shadow: 0 12px 30px rgba(2,6,23,0.08);
  transform: translateY(-6px);
}

.food-image {
  background-color: #f9fafb;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  border-bottom: 1px solid rgba(15,23,42,0.04);
}

.food-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
}

.food-header {
  margin-bottom: 12px;
}

.food-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0b1220;
  margin-bottom: 8px;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fff1f0;
  color: var(--accent);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(239,68,68,0.12);
}

.description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

.card-footer {
  margin-top: auto;
}

.price {
  font-size: 28px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
}

.view-btn {
  flex: 1;
  padding: 10px;
  background-color: #f9fafb;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid rgba(15,23,42,0.06);
  transition: all 0.2s;
}

.view-btn:hover {
  background-color: #f3f4f6;
  border-color: rgba(15,23,42,0.08);
}

.add-btn {
  flex: 1;
  padding: 10px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@media (max-width: 1024px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }
  
  .food-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 640px) {
  .filters {
    grid-template-columns: 1fr;
  }
  
  .food-grid {
    grid-template-columns: 1fr;
  }
}
</style>