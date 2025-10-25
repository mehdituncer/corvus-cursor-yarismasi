import { Link } from 'react-router-dom'
import { BookOpen, Eye, Ear, Zap, Users, Award, Upload } from 'lucide-react'
import Button from '../components/common/Button'
import { useAccessibility } from '../contexts/AccessibilityContext'

/**
 * Ana sayfa
 */
function HomePage() {
  const { speak, speechEnabled } = useAccessibility()

  const handleReadSection = (text) => {
    if (speechEnabled) {
      speak(text)
    }
  }

  const features = [
    {
      icon: Eye,
      title: 'Görme Engelliler İçin',
      description: 'Ekran okuyucu desteği, yüksek kontrast modu, yazı boyutu kontrolü ve tüm içerikler için sesli açıklamalar.'
    },
    {
      icon: Ear,
      title: 'İşitme Engelliler İçin',
      description: 'Tüm videolar için altyazı desteği, görsel materyaller ve işaret dili açıklamaları.'
    },
    {
      icon: Zap,
      title: 'Yapay Zeka Destekli',
      description: 'Google Gemini AI ile otomatik içerik adaptasyonu, basitleştirme ve kişiselleştirilmiş öğrenme deneyimi.'
    },
    {
      icon: Users,
      title: 'Herkes İçin Tasarlandı',
      description: 'WCAG 2.1 AA standartlarına uygun, evrensel tasarım ilkeleriyle geliştirilmiş platform.'
    },
    {
      icon: Award,
      title: 'Kaliteli İçerik',
      description: 'Uzman eğitmenler tarafından hazırlanan, erişilebilir formatta sunulan eğitim materyalleri.'
    },
    {
      icon: BookOpen,
      title: 'Zengin Ders Kütüphanesi',
      description: 'Farklı konularda, farklı seviyelerde dersler. Sürekli güncellenen içerik kataloğu.'
    },
    {
      icon: Upload,
      title: 'Kendi Materyallerinizi Yükleyin',
      description: 'PDF, PowerPoint, görsel veya video yükleyin. AI ile otomatik olarak erişilebilir hale getirilir.'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section 
        className="text-center py-12 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl"
        aria-labelledby="hero-heading"
      >
        <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Herkes İçin Eğitim
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Görme ve işitme engelli öğrenciler için özel olarak tasarlanmış, tamamen erişilebilir dijital eğitim platformu. 
          Yapay zeka destekli, kişiselleştirilmiş öğrenme deneyimi.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/dersler">
            <Button size="lg" variant="primary">
              Derslere Başla
            </Button>
          </Link>
          <Link to="/hakkinda">
            <Button size="lg" variant="outline">
              Daha Fazla Bilgi
            </Button>
          </Link>
        </div>
      </section>

      {/* Özellikler */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold text-center mb-8">
          Platform Özellikleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <article 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                onMouseEnter={() => handleReadSection(feature.title + '. ' + feature.description)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon size={32} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* İstatistikler */}
      <section 
        className="bg-primary-600 dark:bg-primary-800 text-white py-12 rounded-2xl"
        aria-labelledby="stats-heading"
      >
        <h2 id="stats-heading" className="sr-only">Platform İstatistikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">100+</div>
            <div className="text-xl">Erişilebilir Ders</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-xl">Aktif Öğrenci</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">%100</div>
            <div className="text-xl">Erişilebilir İçerik</div>
          </div>
        </div>
      </section>

      {/* Materyal Yükleme CTA */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 px-8 rounded-2xl">
        <div className="max-w-3xl mx-auto text-center">
          <Upload size={64} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Kendi Materyallerinizi Yükleyin
          </h2>
          <p className="text-xl mb-6 opacity-90">
            PDF, PowerPoint, görsel veya videolarınızı yükleyin. Yapay zeka ile otomatik olarak 
            erişilebilir hale getirilir: görsel açıklaması, metin çıkarma, sesli okuma ve daha fazlası!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/materyal-yukle">
              <Button size="lg" className="hover:bg-gray-100">
                Materyal Yükle
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="text-3xl font-bold mb-4">
          Öğrenmeye Başlamaya Hazır mısınız?
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Ücretsiz olarak kaydolun ve tüm derslere erişin.
        </p>
        <Link to="/dersler">
          <Button size="lg" variant="primary">
            Hemen Başla
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HomePage

