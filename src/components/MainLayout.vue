<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="main-layout">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/music">MusicVisualizer</RouterLink>
        </nav>
      </div>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.wrapper {
  overflow: auto;
}

.main-layout {
  height: 100%;

  .content {
    flex: auto;
  }
}

@media (min-width: 76.875rem) {

  .main-layout {
    display: flex;
    place-items: center;
  }

  header {
    height: auto;
  }

  header nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    padding-left: 1.6rem;
  }
}
</style>
