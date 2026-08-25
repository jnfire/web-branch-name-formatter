export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'app-theme'

export const getTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved
    }
  } catch (e) {
    // ignore
  }
  return 'system'
}

export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (e) {
    // ignore
  }
  applyTheme(theme)
}

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export const initTheme = () => {
  applyTheme(getTheme())
}
