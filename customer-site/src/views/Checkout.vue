<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <div v-if="cart.length === 0" class="empty-cart card">
      <div class="empty-icon">🛒</div>
      <p>Your cart is empty</p>
      <router-link to="/foods">Browse Menu</router-link>
    </div>

    <div v-else class="checkout-container">
      <div class="checkout-form card">
        <h2>Delivery Information</h2>
        <form @submit.prevent="placeOrder">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.fullName" type="text" required readonly />
          </div>

          <div class="form-group">
            <label>Phone Number *</label>
            <input v-model="form.phone" type="tel" placeholder="0123456789" required />
          </div>

          <div class="form-group">
            <label>Delivery Address *</label>
            <textarea 
              v-model="form.deliveryAddress" 
              placeholder="Enter your full address" 
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Order Note (Optional)</label>
            <textarea 
              v-model="form.note" 
              placeholder="Any special requests?" 
              rows="2"
            ></textarea>
          </div>

          <div class="payment-method">
            <h3>Payment Method</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" value="COD" v-model="form.paymentMethod" />
                <span class="payment-content">
                  <span class="payment-icon">💵</span>
                  <span class="payment-text">
                    <strong>Cash on Delivery</strong>
                    <small>Pay when you receive</small>
                  </span>
                </span>
              </label>
              <label class="payment-option disabled">
                <input type="radio" value="Card" v-model="form.paymentMethod" disabled />
                <span class="payment-content">
                  <span class="payment-icon">💳</span>
                  <span class="payment-text">
                    <strong>Credit/Debit Card</strong>
                    <small>Coming Soon</small>
                  </span>
                </span>
              </label>
              <label class="payment-option disabled">
                <input type="radio" value="Wallet" v-model="form.paymentMethod" disabled />
                <span class="payment-content">
                  <span class="payment-icon">👛</span>
                  <span class="payment-text">
                    <strong>E-Wallet</strong>
                    <small>Coming Soon</small>
                  </span>
                </span>
              </label>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="place-order-btn">
            {{ loading ? 'Processing...' : 'Place Order' }}
          </button>

          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>

      <div class="order-summary card">
        <h2>Order Summary</h2>
        
        <div class="summary-items">
          <div v-for="item in cart" :key="item.id + item.type" class="summary-item">
            <div class="item-details">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-qty">x{{ item.quantity }}</p>
            </div>
            <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Delivery Fee:</span>
          <span>${{ deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Checkout',
  data() {
    return {
      cart: [],
      form: {
        fullName: '',
        phone: '',
        deliveryAddress: '',
        note: '',
        paymentMethod: 'COD'
      },
      loading: false,
      error: '',
      deliveryFee: 2.00
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    total() {
      return this.subtotal + this.deliveryFee;
    }
  },
  mounted() {
    this.loadCart();
    this.loadUserInfo();
  },
  methods: {
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    },
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.form.fullName = user.fullName || '';
    },
    async placeOrder() {
      this.loading = true;
      this.error = '';

      try {
        const orderData = {
          deliveryAddress: this.form.deliveryAddress,
          phone: this.form.phone,
          note: this.form.note,
          items: this.cart.map(item => ({
            foodItemId: item.type === 'food' ? item.id : null,
            comboId: item.type === 'combo' ? item.id : null,
            quantity: item.quantity
          }))
        };

        const response = await api.createOrder(orderData);
        
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        
        alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
        this.$router.push('/orders');
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to place order. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.checkout h1 {
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

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
}

.checkout-form,
.order-summary {
  padding: 28px;
}

.checkout-form h2,
.order-summary h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group input:read-only {
  background-color: #f9fafb;
  color: #6b7280;
}

.payment-method {
  margin: 32px 0;
}

.payment-method h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.payment-option:hover:not(.disabled) {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.payment-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-option input[type="radio"] {
  margin: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
  flex: 1;
}

.payment-icon {
  font-size: 24px;
}

.payment-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.payment-text strong {
  font-size: 15px;
  color: #111827;
}

.payment-text small {
  font-size: 13px;
  color: #6b7280;
}

.place-order-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.place-order-btn:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.place-order-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #fecaca;
}

.order-summary {
  position: sticky;
  top: 24px;
}

.summary-items {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  font-size: 15px;
}

.item-qty {
  color: #6b7280;
  font-size: 13px;
}

.item-price {
  font-weight: 600;
  color: #ef4444;
  font-size: 15px;
}

.summary-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
  color: #374151;
}

.summary-row span:last-child {
  font-weight: 600;
}

.total-row {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.total-row span:last-child {
  color: #ef4444;
  font-size: 24px;
}

@media (max-width: 1024px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    position: static;
  }
}
</style>