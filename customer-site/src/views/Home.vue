<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <h1>Welcome to FastFood Order System</h1>
        <p>Order your favorite fast food online and get it delivered to your door!</p>
        <router-link to="/foods" class="cta-button">Browse Menu</router-link>
      </div>
    </div>

    <div class="featured-section">
      <div class="section-header">
        <h2>Featured Combos</h2>
        <p>Special deals you don't want to miss</p>
      </div>
      
      <div class="combo-grid">
        <div v-for="combo in combos" :key="combo.id" class="combo-card card">
          <div class="combo-image">🍔</div>
          <div class="combo-content">
            <h3>{{ combo.name }}</h3>
            <p>{{ combo.description }}</p>
            <div class="price-section">
              <span class="original-price">${{ combo.originalPrice }}</span>
              <span class="sale-price">${{ combo.price }}</span>
              <span class="discount-badge">Save ${{ (combo.originalPrice - combo.price).toFixed(2) }}</span>
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
  name: 'Home',
  data() {
    return {
      combos: []
    };
  },
  async mounted() {
    try {
      const response = await api.getCombos();
      this.combos = response.data.slice(0, 3);
    } catch (error) {
      console.error('Error loading combos:', error);
    }
  }
};
</script>

<style scoped>
.hero {
  background-color: var(--accent);
  border-radius: 16px;
  padding: 80px 40px;
  margin-bottom: 64px;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-content p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  padding: 16px 40px;
  background-color: white;
  color: var(--accent);
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 6px 18px rgba(2,6,23,0.6);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(2,6,23,0.6);
}

.featured-section {
  margin-bottom: 64px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.section-header p {
  font-size: 16px;
  color: var(--muted);
}

.combo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.combo-card {
  padding: 0;
  overflow: hidden;
  transition: all 0.28s;
  background: white;
  border: 1px solid rgba(15,23,42,0.06);
}

.combo-card:hover {
  border-color: rgba(239,68,68,0.12);
  box-shadow: 0 12px 30px rgba(2,6,23,0.08);
  transform: translateY(-6px);
}

.combo-image {
  background-color: #f9fafb;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  border-bottom: 1px solid rgba(15,23,42,0.04);
}

.combo-content {
  padding: 24px;
  background: white;
}

.combo-content h3 {
  font-size: 22px;
  font-weight: 600;
  color: #0b1220;
  margin-bottom: 12px;
}

.combo-content p {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.original-price {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 16px;
}

.sale-price {
  color: #ef4444;
  font-size: 32px;
  font-weight: 700;
}

.discount-badge {
  padding: 6px 12px;
  background-color: #dcfce7;
  color: #16a34a;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #bbf7d0;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .combo-grid {
    grid-template-columns: 1fr;
  }
}
</style>