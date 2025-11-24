<template>
  <div class="orders-management">
    <div class="page-header">
      <h1>Orders Management</h1>
      <div class="status-filters">
        <button 
          v-for="status in statusOptions" 
          :key="status"
          @click="filterStatus = status"
          :class="['filter-btn', { active: filterStatus === status }]"
        >
          {{ status || 'All' }} ({{ getStatusCount(status) }})
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading orders...</div>

    <div v-else class="orders-list">
      <div v-if="filteredOrders.length === 0" class="no-orders card">
        <p>No orders found</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.id" class="order-card card">
        <div class="order-header">
          <div class="order-info">
            <h3>Order #{{ order.id }}</h3>
            <p class="customer-name">Customer: {{ order.customerName }}</p>
            <p class="order-date">{{ formatDate(order.orderDate) }}</p>
          </div>
          <div class="order-status-container">
            <select 
              v-model="order.status" 
              @change="updateOrderStatus(order)"
              :class="['status-select', getStatusClass(order.status)]"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div class="order-body">
          <div class="order-items">
            <h4>Order Items:</h4>
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span class="item-name">{{ item.itemName }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-details">
            <div class="detail-row">
              <span class="label">📍 Delivery Address:</span>
              <span>{{ order.deliveryAddress }}</span>
            </div>
            <div class="detail-row">
              <span class="label">📞 Phone:</span>
              <span>{{ order.phone }}</span>
            </div>
            <div v-if="order.note" class="detail-row">
              <span class="label">📝 Note:</span>
              <span>{{ order.note }}</span>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>Total Amount:</span>
            <span class="total-price">${{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'OrdersManagement',
  data() {
    return {
      orders: [],
      filterStatus: '',
      statusOptions: ['', 'Pending', 'Processing', 'Delivered'],
      loading: true
    };
  },
  computed: {
    filteredOrders() {
      if (!this.filterStatus) return this.orders;
      return this.orders.filter(order => order.status === this.filterStatus);
    }
  },
  async mounted() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const response = await api.getOrders();
        this.orders = response.data;
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        this.loading = false;
      }
    },
    getStatusCount(status) {
      if (!status) return this.orders.length;
      return this.orders.filter(order => order.status === status).length;
    },
    async updateOrderStatus(order) {
      try {
        await api.updateOrderStatus(order.id, order.status);
        alert(`Order #${order.id} status updated to ${order.status}`);
        await this.loadOrders();
      } catch (error) {
        alert('Failed to update order status');
        console.error('Error updating status:', error);
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
      const map = {
        'Pending': 'status-pending',
        'Processing': 'status-processing',
        'Delivered': 'status-delivered'
      };
      return map[status] || 'status-pending';
    }
  }
};
</script>

<style scoped>
.orders-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 20px;
  color: #333;
}

.status-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background-color: #f8f9fa;
  color: #555;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.filter-btn:hover {
  background-color: #e9ecef;
}

.filter-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.no-orders {
  text-align: center;
  padding: 60px;
  color: #999;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  padding: 25px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.order-info h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.customer-name {
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
}

.order-date {
  color: #999;
  font-size: 14px;
}

.order-status-container {
  min-width: 180px;
}

.status-select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  background-color: white;
}

.status-select.status-pending {
  border-color: #ffc107;
  color: #856404;
  background-color: #fff3cd;
}

.status-select.status-processing {
  border-color: #0d6efd;
  color: #084298;
  background-color: #cfe2ff;
}

.status-select.status-delivered {
  border-color: #198754;
  color: #0f5132;
  background-color: #d1e7dd;
}

.order-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 20px;
}

.order-items h4 {
  margin-bottom: 15px;
  color: #555;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-name {
  flex: 2;
  font-weight: 500;
  color: #333;
}

.item-qty {
  flex: 1;
  text-align: center;
  color: #666;
}

.item-price {
  flex: 1;
  text-align: right;
  font-weight: 600;
  color: #ff6b6b;
}

.order-details {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row .label {
  font-weight: 600;
  color: #555;
  min-width: 140px;
}

.order-footer {
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total span:first-child {
  font-size: 18px;
  font-weight: 600;
  color: #555;
}

.total-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .order-body {
    grid-template-columns: 1fr;
  }

  .order-header {
    flex-direction: column;
    gap: 15px;
  }

  .order-status-container {
    width: 100%;
  }
}
</style>