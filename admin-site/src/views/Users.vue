<template>
  <div class="users-management">
    <div class="page-header">
      <h1>User Management</h1>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else class="card table-container">
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="search-input"
        />
        <select v-model="filterRole" class="role-filter">
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>#{{ user.id }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.city }}</td>
              <td>
                <span :class="['role-badge', user.role.toLowerCase()]">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', user.isActive ? 'active' : 'inactive']">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td class="actions">
                <button @click="editUser(user)" class="edit-btn">Edit</button>
                <button
                  v-if="user.role !== 'Admin'"
                  @click="deleteUser(user)"
                  class="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content card" @click.stop>
        <h2>Edit User</h2>

        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="userForm.fullName" type="text" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" readonly disabled />
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input v-model="userForm.phone" type="tel" required />
          </div>

          <div class="form-group">
            <label>Address</label>
            <input v-model="userForm.address" type="text" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>City</label>
              <input v-model="userForm.city" type="text" required />
            </div>

            <div class="form-group">
              <label>Country</label>
              <input v-model="userForm.country" type="text" required />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'UsersManagement',
  data() {
    return {
      users: [],
      searchQuery: '',
      filterRole: '',
      loading: true,
      showModal: false,
      userForm: {
        id: 0,
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: ''
      },
      error: ''
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }

      if (this.filterRole) {
        filtered = filtered.filter(user => user.role === this.filterRole);
      }

      return filtered;
    }
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const response = await api.getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        this.loading = false;
      }
    },
    editUser(user) {
      this.userForm = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country
      };
      this.showModal = true;
    },
    async saveUser() {
      this.error = '';

      try {
        await api.updateUser(this.userForm.id, {
          fullName: this.userForm.fullName,
          phone: this.userForm.phone,
          address: this.userForm.address,
          city: this.userForm.city,
          country: this.userForm.country
        });

        alert('User updated successfully!');
        await this.loadUsers();
        this.closeModal();
      } catch (error) {
        this.error = error.response?.data?.message || 'Operation failed';
      }
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
        try {
          await api.deleteUser(user.id);
          alert('User deleted successfully!');
          await this.loadUsers();
        } catch (error) {
          alert('Failed to delete user');
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.error = '';
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US');
    }
  }
};
</script>

<style scoped>
.users-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.table-container {
  padding: 25px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 2;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.role-filter {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.table-wrapper {
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
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.role-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background-color: #dbeafe;
  color: #1e40af;
}

.role-badge.customer {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #842029;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  padding: 6px 12px;
  background-color: #3b82f6;
  font-size: 14px;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
}

.modal-content h2 {
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.cancel-btn {
  flex: 1;
  background-color: #6c757d;
}

.save-btn {
  flex: 1;
  background-color: #28a745;
}

.error {
  margin-top: 15px;
  padding: 12px;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 5px;
  text-align: center;
}
</style>
