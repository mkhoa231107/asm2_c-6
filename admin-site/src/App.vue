<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <main :class="{ 'with-navbar': showNavbar }">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  computed: {
    showNavbar() {
      return this.$route.path !== '/login';
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

#app {
  min-height: 100vh;
}

main {
  padding: 0;
}

main.with-navbar {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #3b82f6;
  color: white;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  background-color: #2563eb;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

h1 {
  font-size: 32px;
  color: #333;
}

h2 {
  font-size: 24px;
  color: #555;
}

h3 {
  font-size: 20px;
  color: #666;
}
</style>