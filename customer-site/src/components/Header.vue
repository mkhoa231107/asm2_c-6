<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">🍔</span>
        <span class="logo-text">FastFood</span>
      </router-link>
      
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/foods" class="nav-link">Menu</router-link>
        <router-link v-if="isLoggedIn" to="/orders" class="nav-link">Orders</router-link>
        <router-link v-if="isLoggedIn" to="/cart" class="nav-link cart-link">
          <span>Cart</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
        <router-link v-if="isLoggedIn" to="/profile" class="nav-link">Profile</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link-btn">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link-btn primary">Sign Up</router-link>
        <button v-if="isLoggedIn" @click="logout" class="logout-btn">Logout</button>
      </nav>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="hamburger"></span>
      </button>
    </div>
    
    <div v-if="showMobileMenu" class="mobile-nav">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Home</router-link>
      <router-link to="/foods" class="mobile-nav-link" @click="closeMobileMenu">Menu</router-link>
      <router-link v-if="isLoggedIn" to="/orders" class="mobile-nav-link" @click="closeMobileMenu">Orders</router-link>
      <router-link v-if="isLoggedIn" to="/cart" class="mobile-nav-link" @click="closeMobileMenu">
        Cart ({{ cartCount }})
      </router-link>
      <router-link v-if="isLoggedIn" to="/profile" class="mobile-nav-link" @click="closeMobileMenu">Profile</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="mobile-nav-link" @click="closeMobileMenu">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="mobile-nav-link" @click="closeMobileMenu">Sign Up</router-link>
      <button v-if="isLoggedIn" @click="logout" class="mobile-logout-btn">Logout</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      cartCount: 0,
      showMobileMenu: false
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      this.closeMobileMenu();
      this.$router.push('/login');
    },
    updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    closeMobileMenu() {
      this.showMobileMenu = false;
    }
  },
  mounted() {
    this.updateCartCount();
    window.addEventListener('cart-updated', this.updateCartCount);
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.updateCartCount);
  }
};
</script>

<style scoped>
.header {
  background-color: var(--surface);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 6px 18px rgba(2,6,23,0.6);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 24px;
  color: var(--text);
  transition: all 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  color: var(--accent);
}

.nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  color: var(--accent);
  background-color: rgba(239,68,68,0.06);
}

.nav-link.router-link-active {
  color: var(--accent);
  background-color: rgba(239,68,68,0.06);
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-badge {
  background-color: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}


.nav-link-btn {
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.04);
  transition: all 0.2s;
  background-color: rgba(255,255,255,0.02);
}

.nav-link-btn:hover {
  border-color: rgba(255,255,255,0.06);
  background-color: rgba(255,255,255,0.04);
}

.nav-link-btn.primary {
  background-color: var(--accent);
  color: white;
  border-color: var(--accent);
}

.nav-link-btn.primary:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

.logout-btn {
  padding: 8px 20px;
  background-color: rgba(255,255,255,0.02);
  color: var(--text);
  border: 2px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background-color: rgba(239,68,68,0.06);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--text);
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--text);
  left: 0;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.mobile-nav {
  display: none;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
}

.mobile-nav-link {
  display: block;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: color 0.2s;
}

.mobile-nav-link:hover {
  color: #ef4444;
}

.mobile-logout-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  background-color: #fef2f2;
  color: #ef4444;
  border: 2px solid #fecaca;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-nav {
    display: block;
  }
}
</style>