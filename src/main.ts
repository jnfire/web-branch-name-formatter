import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag-next'


const app = createApp(App)

// Configuración de Google Analytics
app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GTAG
  },
  // Habilitamos el Modo de Consentimiento
  consent: {
    isEnabled: true,
    // Estado por defecto: DENEGADO para todos los tipos de almacenamiento
    // Esto asegura que no se usen cookies ANTES del consentimiento.
    default: {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    }
  }
})



app.mount('#app')