<template>
  <div class="cart">
    <h1>Shopping Cart</h1>

    <div v-if="cart.length === 0" class="empty-cart card">
      <div class="empty-icon">🛒</div>
      <p>Your cart is empty</p>
      <router-link to="/foods">Browse Menu</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cart" :key="item.id + item.type" class="cart-item card">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="price">${{ item.price }} each</p>
          </div>
          <div class="item-actions">
            <button @click="updateQuantity(item, -1)" class="qty-btn">−</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button @click="updateQuantity(item, 1)" class="qty-btn">+</button>
            <button @click="removeItem(item)" class="remove-btn">Remove</button>
          </div>
          <div class="item-total">
            ${{ (item.price * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>

      <div class="cart-summary card">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cart: []
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  mounted() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    },
    updateQuantity(item, change) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(item);
      } else {
        this.saveCart();
      }
    },
    removeItem(item) {
      this.cart = this.cart.filter(i => !(i.id === item.id && i.type === item.type));
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      window.dispatchEvent(new Event('cart-updated'));
    }
  }
};
</script>

<style scoped>
.cart h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 32px;
}

.empty-cart {
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-cart p {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 24px;
}

.empty-cart a {
  display: inline-block;
  padding: 12px 32px;
  background-color: #ef4444;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.empty-cart a:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  transition: all 0.2s;
}

.cart-item:hover {
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.price {
  font-size: 14px;
  color: #6b7280;
}

.item-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  font-size: 18px;
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
}

.quantity {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.remove-btn {
  margin-left: 8px;
  padding: 8px 16px;
  background-color: transparent;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #fef2f2;
}

.item-total {
  font-size: 20px;
  font-weight: 700;
  color: #ef4444;
  min-width: 100px;
  text-align: right;
}

.cart-summary {
  padding: 28px;
  position: sticky;
  top: 24px;
}

.cart-summary h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
  color: #374151;
}

.summary-row span:last-child {
  font-weight: 600;
}

.total-row {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
  margin-top: 20px;
  margin-bottom: 0;
}

.total-row span:last-child {
  color: #ef4444;
}

.checkout-btn {
  display: block;
  text-align: center;
  padding: 14px;
  background-color: #ef4444;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 24px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
}

.checkout-btn:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .item-info,
  .item-actions,
  .item-total {
    width: 100%;
  }
  
  .item-actions {
    justify-content: center;
  }
  
  .item-total {
    text-align: center;
    font-size: 24px;
  }
}
</style>
