<template>
  <div class="order-history">
    <h1>Order History</h1>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your orders...</p>
    </div>

    <div v-else-if="orders.length === 0" class="no-orders card">
      <div class="empty-icon">📦</div>
      <p>You haven't placed any orders yet</p>
      <router-link to="/foods">Start Shopping</router-link>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card card">
        <div class="order-header">
          <div class="order-info">
            <h3>Order #{{ order.id }}</h3>
            <p class="order-date">{{ formatDate(order.orderDate) }}</p>
          </div>
          <div class="order-status">
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ order.status }}
            </span>
          </div>
        </div>

        <div class="order-body">
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-info">
                <p class="item-name">{{ item.itemName }}</p>
                <p class="item-qty">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>

          <div class="order-details">
            <p><strong>Delivery Address:</strong> {{ order.deliveryAddress }}</p>
            <p><strong>Phone:</strong> {{ order.phone }}</p>
            <p v-if="order.note"><strong>Note:</strong> {{ order.note }}</p>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>Total Amount:</span>
            <span class="total-price">${{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <button 
            v-if="order.status === 'Pending'" 
            @click="reorder(order)"
            class="reorder-btn"
          >
            Reorder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'OrderHistory',
  data() {
    return {
      orders: [],
      loading: true
    };
  },
  async mounted() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
          this.$router.push('/login');
          return;
        }

        const response = await api.getUserOrders(user.id);
        this.orders = response.data;
      } catch (error) {
        console.error('Error loading orders:', error);
        alert('Failed to load orders');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getStatusClass(status) {
      const statusMap = {
        'Pending': 'status-pending',
        'Processing': 'status-processing',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled'
      };
      return statusMap[status] || 'status-pending';
    },
    reorder(order) {
      if (confirm('Add all items from this order to your cart?')) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        order.items.forEach(item => {
          const existing = cart.find(c => c.name === item.itemName);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            cart.push({
              id: Date.now() + Math.random(),
              name: item.itemName,
              price: item.price,
              quantity: item.quantity,
              type: 'food'
            });
          }
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
        
        alert('Items added to cart!');
        this.$router.push('/cart');
      }
    }
  }
};
</script>

<style scoped>
.order-history h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 32px;
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

.no-orders {
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.no-orders p {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 24px;
}

.no-orders a {
  display: inline-block;
  padding: 12px 32px;
  background-color: #ef4444;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.no-orders a:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  padding: 28px;
  transition: all 0.2s;
}

.order-card:hover {
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.order-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.order-date {
  color: #6b7280;
  font-size: 14px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.status-processing {
  background-color: #dbeafe;
  color: #1e40af;
  border-color: #bfdbfe;
}

.status-delivered {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #a7f3d0;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}

.order-body {
  margin-bottom: 24px;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
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

.order-details {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
}

.order-details p {
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.order-details p:last-child {
  margin-bottom: 0;
}

.order-details strong {
  color: #111827;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-total span:first-child {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
}

.total-price {
  font-size: 28px;
  font-weight: 700;
  color: #ef4444;
}

.reorder-btn {
  padding: 10px 24px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reorder-btn:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 640px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .order-total {
    align-items: center;
  }
  
  .reorder-btn {
    width: 100%;
  }
}
</style>