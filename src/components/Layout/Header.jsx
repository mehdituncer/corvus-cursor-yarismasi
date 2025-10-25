import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Info, Eye, Upload } from 'lucide-react'

/**
 * Erişilebilir başlık bileşeni
 * - Semantic HTML (nav, header)
 * - ARIA landmarks
 * - Klavye navigasyonu
 */
function Header() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
    ${isActive(path) 
      ? 'bg-primary-600 text-white' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
    focus:outline-none focus:ring-2 focus:ring-primary-500
  `

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo ve Site Adı */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-2xl font-bold text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2"
            aria-label="Ana sayfaya git"
          >
            <Eye size={32} />
            <span>Erişilebilir Akademi</span>
          </Link>

          {/* Ana Navigasyon */}
          <nav aria-label="Ana navigasyon">
            <ul className="flex items-center gap-2">
              <li>
                <Link 
                  to="/" 
                  className={navLinkClass('/')}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  <Home size={20} />
                  <span>Ana Sayfa</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dersler" 
                  className={navLinkClass('/dersler')}
                  aria-current={isActive('/dersler') ? 'page' : undefined}
                >
                  <BookOpen size={20} />
                  <span>Dersler</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/materyal-yukle" 
                  className={navLinkClass('/materyal-yukle')}
                  aria-current={isActive('/materyal-yukle') ? 'page' : undefined}
                >
                  <Upload size={20} />
                  <span>Materyal Yükle</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/hakkinda" 
                  className={navLinkClass('/hakkinda')}
                  aria-current={isActive('/hakkinda') ? 'page' : undefined}
                >
                  <Info size={20} />
                  <span>Hakkında</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

