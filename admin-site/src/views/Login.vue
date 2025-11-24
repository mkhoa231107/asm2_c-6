<template>
  <div class="admin-login">
    <div class="login-container card">
      <div class="login-header">
        <h1>🔐 Admin Login</h1>
        <p>FastFood Management System</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="admin@fastfood.com"
            required 
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            required 
          />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Logging in...' : 'Login to Dashboard' }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <div class="login-footer">
        <p>Only authorized administrators can access this panel</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        const response = await api.login(this.form);
        const { token, id, fullName, email, role } = response.data;
        
        if (role !== 'Admin') {
          this.error = 'Access denied. Admin privileges required.';
          return;
        }

        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify({ id, fullName, email, role }));
        
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed. Invalid credentials.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.login-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 20px;
  padding: 12px;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 8px;
  text-align: center;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
}

.login-footer p {
  color: #999;
  font-size: 14px;
}
</style>