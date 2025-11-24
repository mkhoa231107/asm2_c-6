<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p class="welcome">Welcome back, {{ adminName }}!</p>

    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon" style="background-color: #667eea;">👥</div>
        <div class="stat-details">
          <p class="stat-value">{{ stats.totalUsers }}</p>
          <p class="stat-label">Total Users</p>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon" style="background-color: #f093fb;">🍔</div>
        <div class="stat-details">
          <p class="stat-value">{{ stats.totalFoodItems }}</p>
          <p class="stat-label">Food Items</p>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon" style="background-color: #4facfe;">📦</div>
        <div class="stat-details">
          <p class="stat-value">{{ stats.totalOrders }}</p>
          <p class="stat-label">Total Orders</p>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon" style="background-color: #43e97b;">💰</div>
        <div class="stat-details">
          <p class="stat-value">${{ stats.totalRevenue.toFixed(2) }}</p>
          <p class="stat-label">Total Revenue</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="recent-orders card">
        <h2>Recent Orders</h2>
        <div v-if="recentOrders.length === 0" class="no-data">
          No orders yet
        </div>
        <div v-else class="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.customerName }}</td>
                <td>${{ order.totalAmount.toFixed(2) }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(order.status)]">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>
                  <router-link :to="`/orders`" class="view-link">View</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="quick-actions card">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/users" class="action-btn">
            <span class="action-icon">👥</span>
            <span>Manage Users</span>
          </router-link>
          <router-link to="/fooditems" class="action-btn">
            <span class="action-icon">🍔</span>
            <span>Manage Foods</span>
          </router-link>
          <router-link to="/combos" class="action-btn">
            <span class="action-icon">🎁</span>
            <span>Manage Combos</span>
          </router-link>
          <router-link to="/orders" class="action-btn">
            <span class="action-icon">📦</span>
            <span>View Orders</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Dashboard',
  data() {
    return {
      adminName: '',
      stats: {
        totalUsers: 0,
        totalFoodItems: 0,
        totalOrders: 0,
        totalRevenue: 0
      },
      recentOrders: []
    };
  },
  async mounted() {
    this.loadAdminInfo();
    await this.loadStats();
    await this.loadRecentOrders();
  },
  methods: {
    loadAdminInfo() {
      const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      this.adminName = admin.fullName || 'Admin';
    },
    async loadStats() {
      try {
        const [usersRes, foodsRes, ordersRes] = await Promise.all([
          api.getUsers(),
          api.getFoodItems({}),
          api.getOrders()
        ]);

        this.stats.totalUsers = usersRes.data.length;
        this.stats.totalFoodItems = foodsRes.data.length;
        this.stats.totalOrders = ordersRes.data.length;
        this.stats.totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },
    async loadRecentOrders() {
      try {
        const response = await api.getOrders();
        this.recentOrders = response.data.slice(0, 5);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
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
.dashboard h1 {
  margin-bottom: 10px;
  color: #333;
}

.welcome {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.recent-orders,
.quick-actions {
  padding: 25px;
}

.recent-orders h2,
.quick-actions h2 {
  margin-bottom: 20px;
  color: #555;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.orders-table {
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
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cfe2ff;
  color: #084298;
}

.status-delivered {
  background-color: #d1e7dd;
  color: #0f5132;
}

.view-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 25px;
  background-color: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #667eea;
  color: white;
  transform: translateY(-3px);
}

.action-icon {
  font-size: 32px;
}

@media (max-width: 968px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}
</style>