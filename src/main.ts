import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag-next'


const app = createApp(App)

// Configuración de Google Analytics
app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GTAG
  }
})

// Set default consent to 'denied' before mounting the app
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});



app.mount('#app')