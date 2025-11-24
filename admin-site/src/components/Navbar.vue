<template>
  <nav class="admin-navbar">
    <div class="navbar-brand">
      <h2>🍔 FastFood Admin</h2>
    </div>

    <div class="navbar-menu">
      <router-link to="/dashboard" class="nav-link">
        📊 Dashboard
      </router-link>
      <router-link to="/users" class="nav-link">
        👥 Users
      </router-link>
      <router-link to="/fooditems" class="nav-link">
        🍔 Food Items
      </router-link>
      <router-link to="/combos" class="nav-link">
        🎁 Combos
      </router-link>
      <router-link to="/orders" class="nav-link">
        📦 Orders
      </router-link>
    </div>

    <div class="navbar-user">
      <span class="user-name">{{ adminName }}</span>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminNavbar',
  data() {
    return {
      adminName: 'Admin'
    };
  },
  mounted() {
    const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
    this.adminName = admin.fullName || 'Admin';
  },
  methods: {
    logout() {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.admin-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand h2 {
  margin: 0;
  font-size: 24px;
}

.navbar-menu {
  display: flex;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-weight: 600;
}

.logout-btn {
  padding: 8px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: white;
  color: #667eea;
}

@media (max-width: 968px) {
  .admin-navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }

  .navbar-menu {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .navbar-user {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
