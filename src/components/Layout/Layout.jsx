import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SkipLink from '../common/SkipLink'
import AccessibilityToolbar from '../accessibility/AccessibilityToolbar'
import SimpleChatbot from '../chatbot/SimpleChatbot'
import { useAccessibility } from '../../contexts/AccessibilityContext'

/**
 * Ana layout bileşeni
 * - Semantic HTML yapısı
 * - ARIA landmarks
 * - Skip link
 * - Erişilebilirlik araç çubuğu
 */
function Layout({ children }) {
  const location = useLocation()
  const { announcePageTitle } = useAccessibility()

  // Sayfa değiştiğinde başlığı duyur ve scroll'u en üste al
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Sayfa başlığını belirle
    const titles = {
      '/': 'Ana Sayfa - Erişilebilir Akademi',
      '/dersler': 'Dersler - Erişilebilir Akademi',
      '/hakkinda': 'Hakkında - Erişilebilir Akademi',
      '/erisilebilirlik': 'Erişilebilirlik Bildirimi - Erişilebilir Akademi'
    }
    
    const title = titles[location.pathname] || 'Erişilebilir Akademi'
    document.title = title
    
    // Ekran okuyucular için duyuru
    announcePageTitle(title)
  }, [location, announcePageTitle])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link - klavye kullanıcıları için */}
      <SkipLink />
      
      {/* Erişilebilirlik Araç Çubuğu */}
      <AccessibilityToolbar />
      
      {/* Basit Chatbot */}
      <SimpleChatbot />
      
      {/* Header */}
      <Header />
      
      {/* Ana İçerik */}
      <main 
        id="main-content" 
        className="flex-1 container mx-auto px-4 py-8"
        tabIndex="-1"
      >
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* ARIA Live Region - Dinamik duyurular için */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="aria-live-region"
      />
    </div>
  )
}

export default Layout

