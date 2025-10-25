import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || THEMES.LIGHT
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Önceki tema sınıflarını temizle
    root.classList.remove(THEMES.LIGHT, THEMES.DARK, THEMES.HIGH_CONTRAST)
    
    // Yeni temayı uygula
    if (theme === THEMES.DARK) {
      root.classList.add('dark')
    } else if (theme === THEMES.HIGH_CONTRAST) {
      root.classList.add('high-contrast')
    }
    
    // Temayı kaydet
    localStorage.setItem('theme', theme)
    
    // Ekran okuyucular için duyuru
    announceThemeChange(theme)
  }, [theme])

  const announceThemeChange = (newTheme) => {
    const messages = {
      [THEMES.LIGHT]: 'Aydınlık tema aktif',
      [THEMES.DARK]: 'Karanlık tema aktif',
      [THEMES.HIGH_CONTRAST]: 'Yüksek kontrast modu aktif'
    }
    
    // ARIA live region için duyuru
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = messages[newTheme]
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const value = {
    theme,
    setTheme,
    isLight: theme === THEMES.LIGHT,
    isDark: theme === THEMES.DARK,
    isHighContrast: theme === THEMES.HIGH_CONTRAST
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

