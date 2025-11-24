<template>
  <div class="profile">
    <h1>My Profile</h1>

    <div class="profile-container">
      <div class="profile-card card">
        <div class="profile-header">
          <div class="avatar">
            {{ getInitials(user.fullName) }}
          </div>
          <div class="user-info">
            <h2>{{ user.fullName }}</h2>
            <p class="email">{{ user.email }}</p>
            <span :class="['role-badge', user.role.toLowerCase()]">
              {{ user.role }}
            </span>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="profile-form">
          <h3>Personal Information</h3>

          <div class="form-group">
            <label>Full Name *</label>
            <input v-model="form.fullName" type="text" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="user.email" type="email" readonly disabled />
          </div>

          <div class="form-group">
            <label>Phone Number *</label>
            <input v-model="form.phone" type="tel" required />
          </div>

          <div class="form-group">
            <label>Address *</label>
            <input v-model="form.address" type="text" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>City *</label>
              <input v-model="form.city" type="text" required />
            </div>

            <div class="form-group">
              <label>Country *</label>
              <input v-model="form.country" type="text" required />
            </div>
          </div>

          <button type="submit" :disabled="loading" class="save-btn">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>

          <p v-if="success" class="success">{{ success }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>

      <div class="sidebar">
        <div class="account-stats card">
          <h3>Account Statistics</h3>
          
          <div class="stat-item">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <p class="stat-label">Total Orders</p>
              <p class="stat-value">{{ stats.totalOrders }}</p>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <p class="stat-label">Total Spent</p>
              <p class="stat-value">${{ stats.totalSpent.toFixed(2) }}</p>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <p class="stat-label">Member Since</p>
              <p class="stat-value">{{ formatDate(user.createdAt) }}</p>
            </div>
          </div>
        </div>

        <router-link to="/orders" class="view-orders-btn">
          View Order History
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Profile',
  data() {
    return {
      user: {
        id: 0,
        fullName: '',
        email: '',
        role: 'Customer',
        createdAt: new Date()
      },
      form: {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        country: ''
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0
      },
      loading: false,
      success: '',
      error: ''
    };
  },
  async mounted() {
    await this.loadUserData();
    await this.loadStats();
  },
  methods: {
    async loadUserData() {
      try {
        const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userLocal.id) {
          this.$router.push('/login');
          return;
        }

        const response = await api.getUser(userLocal.id);
        this.user = response.data;
        
        this.form.fullName = this.user.fullName;
        this.form.phone = this.user.phone;
        this.form.address = this.user.address;
        this.form.city = this.user.city;
        this.form.country = this.user.country;
      } catch (error) {
        console.error('Error loading user data:', error);
        this.error = 'Failed to load profile data';
      }
    },
    async loadStats() {
      try {
        const response = await api.getUserOrders(this.user.id);
        const orders = response.data;
        
        this.stats.totalOrders = orders.length;
        this.stats.totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },
    async updateProfile() {
      this.loading = true;
      this.success = '';
      this.error = '';

      try {
        await api.updateUser(this.user.id, this.form);
        
        const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
        userLocal.fullName = this.form.fullName;
        localStorage.setItem('user', JSON.stringify(userLocal));
        
        this.success = 'Profile updated successfully!';
        await this.loadUserData();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update profile';
      } finally {
        this.loading = false;
      }
    },
    getInitials(name) {
      if (!name) return '?';
      return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    }
  }
};
</script>

<style scoped>
.profile h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 32px;
}

.profile-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.profile-card {
  padding: 32px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 2px solid #f3f4f6;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ef4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin-bottom: 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
}

.email {
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 15px;
}

.role-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
}

.role-badge.customer {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #a7f3d0;
}

.role-badge.admin {
  background-color: #dbeafe;
  color: #1e40af;
  border-color: #bfdbfe;
}

.profile-form h3 {
  margin-bottom: 24px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
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

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group input:disabled,
.form-group input:read-only {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.save-btn {
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

.save-btn:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.save-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.success {
  color: #16a34a;
  background-color: #f0fdf4;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid #bbf7d0;
  font-size: 14px;
}

.error {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid #fecaca;
  font-size: 14px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 24px;
}

.account-stats {
  padding: 24px;
}

.account-stats h3 {
  margin-bottom: 20px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.stat-item:hover {
  background-color: #f3f4f6;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.view-orders-btn {
  display: block;
  text-align: center;
  padding: 14px;
  background-color: #ef4444;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
}

.view-orders-btn:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .profile-card {
    padding: 24px;
  }
}
</style>