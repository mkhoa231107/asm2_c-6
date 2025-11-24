<template>
  <div id="app">
    <Header />
    <main class="container main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: { Header, Footer }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 20px;
}

.main-content {
  flex: 1 1 auto;
  width: 100%;
}

button {
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: var(--accent);
  color: white;
  font-size: 16px;
  transition: background-color 0.25s, transform 0.15s;
}

button:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0 15px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255,255,255,0.02);
  color: var(--text);
}

.card {
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.5);
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.04);
}
</style>