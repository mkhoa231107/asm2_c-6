<template>
  <div class="search-bar">
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        v-model="searchQuery"
        :placeholder="placeholder"
        @input="handleSearch"
        class="search-input"
      />
      <button 
        v-if="searchQuery" 
        @click="clearSearch"
        class="clear-btn"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: 'Tìm kiếm...'
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery)
    },
    clearSearch() {
      this.searchQuery = ''
      this.$emit('search', '')
    }
  }
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  margin: 20px 0;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 45px;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 25px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
  background: rgba(255,255,255,0.02);
  color: var(--text);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 6px rgba(239,68,68,0.06);
}

.search-input::placeholder {
  color: rgba(255,255,255,0.35);
}

.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }
}
</style>