import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {
  // Font boyutu kontrolü
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize')
    return saved ? parseInt(saved) : 16
  })

  // Metin aralığı (letter spacing) kontrolü
  const [letterSpacing, setLetterSpacing] = useState(() => {
    const saved = localStorage.getItem('letterSpacing')
    return saved || 'normal'
  })

  // Satır yüksekliği kontrolü
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('lineHeight')
    return saved || 'normal'
  })

  // Animasyonları azalt
  const [reduceMotion, setReduceMotion] = useState(() => {
    const saved = localStorage.getItem('reduceMotion')
    if (saved !== null) return saved === 'true'
    // Sistem tercihini kontrol et
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  // Sesli okuma aktif mi
  const [speechEnabled, setSpeechEnabled] = useState(false)

  // Font boyutunu uygula
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem('fontSize', fontSize.toString())
  }, [fontSize])

  // Metin aralığını uygula
  useEffect(() => {
    const spacingValues = {
      'tight': '0.025em',
      'normal': '0',
      'wide': '0.05em',
      'wider': '0.1em'
    }
    document.documentElement.style.letterSpacing = spacingValues[letterSpacing]
    localStorage.setItem('letterSpacing', letterSpacing)
  }, [letterSpacing])

  // Satır yüksekliğini uygula
  useEffect(() => {
    const heightValues = {
      'tight': '1.25',
      'normal': '1.5',
      'relaxed': '1.75',
      'loose': '2'
    }
    document.documentElement.style.lineHeight = heightValues[lineHeight]
    localStorage.setItem('lineHeight', lineHeight)
  }, [lineHeight])

  // Animasyon azaltmayı uygula
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
    }
    localStorage.setItem('reduceMotion', reduceMotion.toString())
  }, [reduceMotion])

  // Font boyutunu artır
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  // Font boyutunu azalt
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }

  // Font boyutunu sıfırla
  const resetFontSize = () => {
    setFontSize(16)
  }

  // Metni sesli oku (Text-to-Speech)
  const speak = (text, options = {}) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return

    // Önceki konuşmayı durdur
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    window.speechSynthesis.speak(utterance)
  }

  // Konuşmayı durdur
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  // Sayfa başlığını duyur
  const announcePageTitle = (title) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.className = 'sr-only'
    announcement.textContent = title
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const value = {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight,
    reduceMotion,
    setReduceMotion,
    speechEnabled,
    setSpeechEnabled,
    speak,
    stopSpeaking,
    announcePageTitle
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

