// ABOUTME: Main entry point for the Vue application
// ABOUTME: Creates and mounts the Vue app instance to the DOM

import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

// Create and mount the Vue application
const app = createApp(App)

// Mount to #app element
app.mount('#app')