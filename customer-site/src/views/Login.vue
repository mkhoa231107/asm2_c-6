<template>
  <div class="login-page">
    <div class="card login-form">
      <div class="form-header">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="Email address" 
            required 
          />
        </div>
        
        <div class="form-group">
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Password" 
            required 
          />
        </div>
        
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <button class="google-btn" @click="loginWithGoogle">
        <span class="google-icon">🔍</span>
        Continue with Google
      </button>
      
      <p class="register-link">
        Don't have an account? <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Login',
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
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, fullName, email, role }));
        
        this.$router.push('/');
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed. Please check your credentials.';
      } finally {
        this.loading = false;
      }
    },
    loginWithGoogle() {
      alert('Google login will be implemented with OAuth 2.0');
    }
  }
};
</script>

<style scoped>
.login-page {
  max-width: 480px;
  margin: 60px auto;
  padding: 0 16px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e5e7eb;
}

.login-form {
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
  color: #111827;
}

.form-group input::placeholder {
  color: #9ca3af;
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

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #fecaca;
  text-align: center;
}

.divider {
  text-align: center;
  margin: 32px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 42%;
  height: 1px;
  background-color: #e5e7eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: white;
  padding: 0 16px;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
}

.google-btn {
  width: 100%;
  padding: 14px;
  background-color: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.google-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.google-btn:active {
  transform: translateY(0);
}

.google-icon {
  font-size: 20px;
}

.register-link {
  text-align: center;
  margin-top: 28px;
  color: #6b7280;
  font-size: 14px;
}

.register-link a {
  color: #ef4444;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .login-page {
    margin: 40px auto;
  }
  
  .login-form {
    padding: 32px 24px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
}
</style>