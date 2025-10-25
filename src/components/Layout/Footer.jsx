import { Link } from 'react-router-dom'
import { Github, Mail, Heart } from 'lucide-react'

/**
 * Erişilebilir footer bileşeni
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hakkında */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Erişilebilir Akademi</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Görme ve işitme engelli öğrenciler için tasarlanmış, herkes için erişilebilir bir dijital eğitim platformu.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <nav aria-label="Footer navigasyonu">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dersler" 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                  >
                    Dersler
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/erisilebilirlik" 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                  >
                    Erişilebilirlik Bildirimi
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/hakkinda" 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                  >
                    Hakkında
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <a 
                href="mailto:info@erisilebilirakademi.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                aria-label="E-posta gönder"
              >
                <Mail size={20} />
                <span>info@erisilebilirakademi.com</span>
              </a>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:underline"
                aria-label="GitHub sayfamızı ziyaret edin (yeni sekmede açılır)"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <span>© {currentYear} Erişilebilir Akademi. Tüm hakları saklıdır.</span>
            <span className="flex items-center gap-1">
              <span>Sevgiyle yapıldı</span>
              <Heart size={16} className="text-red-500" fill="currentColor" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

