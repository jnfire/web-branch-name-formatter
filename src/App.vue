<script setup lang="ts">
import { ref } from 'vue'

import Footer from '@/components/Footer.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import LangSelector from '@/components/LangSelector.vue'
import { initAnalytics } from '@/utils/analytics'

import AppMainView from '@/components/AppMainView.vue'
import AppConfigurationView from '@/components/AppConfigurationView.vue'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' }
]

const handleCookieAccept = () => {
  const gaId = (import.meta.env.VITE_GA_ID as string) || 'G-XXXXXXXXXX'
  initAnalytics(gaId)
}

const showConfig = ref(false)

const toggleConfig = () => {
  showConfig.value = !showConfig.value
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-top">
        <button class="btn-secondary config-toggle" @click="toggleConfig">
          {{ showConfig ? '← Volver' : '⚙️ Configuración' }}
        </button>
      </div>
      <h1>{{ $t('hero.title') }}</h1>
      <div class="lang-selector-wrapper">
        <LangSelector v-model="$i18n.locale" :options="languages" />
      </div>
      <p class="subtitle">{{ $t('hero.subtitle') }}</p>
      <div class="badges">
        <span class="badge">{{ $t('hero.badges.auditable') }}</span>
        <span class="badge">{{ $t('hero.badges.privacy') }}</span>
        <span class="badge">{{ $t('hero.badges.serverless') }}</span>
      </div>
    </header>

    <!-- Simulación de router con v-if -->
    <AppConfigurationView v-if="showConfig" />
    <AppMainView v-else />

    <Footer />
    <CookieBanner @accept="handleCookieAccept" />
  </div>
</template>

<style scoped lang="scss">
.app-header {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
}

.header-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.config-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.lang-selector-wrapper {
  display: flex;
  justify-content: center;
  margin: 0.75rem 0 1rem 0;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: var(--text-main);
  margin: 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 600px) {
  .app-layout {
    padding: 2rem 1rem;
  }
  h1 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}

.badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background-color: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>