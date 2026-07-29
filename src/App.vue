<template>
  <div id="app">
    <AppNavbar />
    <div id="app" class="">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import '@/assets/styles.css'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter,
  },
}
</script>

<style></style>
