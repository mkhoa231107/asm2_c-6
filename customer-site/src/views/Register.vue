<template>
  <div class="register-page">
    <div class="card register-form">
      <div class="form-header">
        <h2>Create Account</h2>
        <p>Join us today</p>
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.fullName" type="text" placeholder="Full Name *" required />
          </div>
          <div class="form-group">
            <input v-model="form.email" type="email" placeholder="Email *" required />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.phone" type="tel" placeholder="Phone *" required />
          </div>
          <div class="form-group">
            <input v-model="form.city" type="text" placeholder="City *" required />
          </div>
        </div>
        
        <div class="form-group">
          <input v-model="form.address" type="text" placeholder="Address *" required />
        </div>
        
        <div class="form-group">
          <input v-model="form.country" type="text" placeholder="Country *" required />
        </div>
        
        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="Password *" required />
        </div>
        
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">{{ success }}</p>
      </form>
      
      <p class="login-link">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Vietnam',
        password: ''
      },
      loading: false,
      error: '',
      success: ''
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        await api.register(this.form);
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 16px;
}

.register-form {
  padding: 40px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.form-header p {
  font-size: 15px;
  color: #6b7280;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
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

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.submit-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #fecaca;
}

.success-message {
  color: #16a34a;
  background-color: #f0fdf4;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #bbf7d0;
}

.login-link {
  text-align: center;
  margin-top: 28px;
  color: #6b7280;
  font-size: 14px;
}

.login-link a {
  color: #ef4444;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-form {
    padding: 32px 24px;
  }
}
</style>