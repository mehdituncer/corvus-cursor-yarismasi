import { CheckCircle, Eye, Ear, Keyboard, Monitor } from 'lucide-react'

/**
 * Erişilebilirlik bildirimi sayfası
 */
function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Başlık */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Erişilebilirlik Bildirimi</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Erişilebilir Akademi, herkes için erişilebilir bir platform olmayı taahhüt eder.
        </p>
      </section>

      {/* Standartlar */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Uyumluluk Standartları</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bu platform, <strong>Web İçeriği Erişilebilirlik Kılavuzları (WCAG) 2.1 Seviye AA</strong> standartlarına 
          uymak için tasarlanmış ve geliştirilmiştir.
        </p>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle size={24} />
          <span className="font-semibold">WCAG 2.1 AA Uyumlu</span>
        </div>
      </section>

      {/* Görme Engelliler İçin */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Eye size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Görme Engelli Kullanıcılar İçin</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Ekran okuyucu desteği (JAWS, NVDA, VoiceOver uyumlu)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Ayarlanabilir yazı boyutu (12px - 24px arası)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Yüksek kontrast modu (WCAG AA uyumlu renk kontrastları)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Tüm görseller için detaylı alt metinler</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Metinden sese dönüştürme (Text-to-Speech)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Semantic HTML ve ARIA etiketleri kullanımı</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* İşitme Engelliler İçin */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Ear size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">İşitme Engelli Kullanıcılar İçin</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Tüm video içerikleri için senkronize alt yazılar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Video transkriptleri</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Görsel bildirimler (ses uyarıları yerine)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>Güçlü görsel materyaller ve infografikler</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Klavye Navigasyonu */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Keyboard size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Klavye Navigasyonu</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tüm işlevler fare kullanmadan, sadece klavye ile erişilebilir:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> - Sonraki elemana git
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Shift + Tab</kbd> - Önceki elemana git
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> veya <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd> - Aktif et
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> - Modalları kapat
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Arrow Keys</kbd> - Menülerde navigasyon
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tarayıcı ve Teknoloji Desteği */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Monitor size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Desteklenen Teknolojiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Tarayıcılar:</h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Chrome (son 2 sürüm)</li>
                  <li>• Firefox (son 2 sürüm)</li>
                  <li>• Safari (son 2 sürüm)</li>
                  <li>• Edge (son 2 sürüm)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ekran Okuyucular:</h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• NVDA (Windows)</li>
                  <li>• JAWS (Windows)</li>
                  <li>• VoiceOver (macOS, iOS)</li>
                  <li>• TalkBack (Android)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geri Bildirim */}
      <section className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">Geri Bildiriminiz Önemli</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Erişilebilirlikle ilgili herhangi bir sorun yaşarsanız veya önerileriniz varsa, 
          lütfen bizimle iletişime geçin. Sürekli gelişmeyi hedefliyoruz.
        </p>
        <a 
          href="mailto:erisilebilirlik@erisilebilirakademi.com"
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
        >
          erisilebilirlik@erisilebilirakademi.com
        </a>
      </section>

      {/* Son Güncelleme */}
      <section className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Son güncelleme: Ekim 2025</p>
      </section>
    </div>
  )
}

export default AccessibilityPage

