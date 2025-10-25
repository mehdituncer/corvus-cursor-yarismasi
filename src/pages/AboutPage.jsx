import { Heart, Target, Users, Zap } from 'lucide-react'

/**
 * Hakkında sayfası
 */
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Başlık */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Eğitimde fırsat eşitliği için çalışıyoruz
        </p>
      </section>

      {/* Misyon */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Target size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Misyonumuz</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Erişilebilir Akademi, görme ve işitme engelli öğrencilerin kaliteli eğitime eşit şekilde 
              erişebilmelerini sağlamak için kurulmuştur. Modern teknolojileri ve yapay zeka destekli çözümleri 
              kullanarak, her öğrenciye uygun, kişiselleştirilmiş bir öğrenme deneyimi sunmayı hedefliyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit mb-4">
              <Heart size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Kapsayıcılık</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Herkes için erişilebilir, kimseyi dışlamayan bir eğitim platformu oluşturmak.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit mb-4">
              <Zap size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">İnovasyon</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yapay zeka ve modern teknolojileri kullanarak sürekli gelişen çözümler üretmek.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit mb-4">
              <Users size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Topluluk</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Öğrenciler, eğitmenler ve ailelerin birlikte öğrendiği destekleyici bir ortam.
            </p>
          </article>
        </div>
      </section>

      {/* Teknoloji */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Teknolojimiz</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Erişilebilir Akademi, en son web teknolojileri ve yapay zeka çözümleri ile geliştirilmiştir:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>React ve Tailwind CSS:</strong> Modern, hızlı ve responsive kullanıcı arayüzü
            </li>
            <li>
              <strong>Google Gemini AI:</strong> İçerik adaptasyonu, basitleştirme ve kişiselleştirme
            </li>
            <li>
              <strong>WCAG 2.1 AA Uyumluluğu:</strong> Uluslararası erişilebilirlik standartlarına tam uyum
            </li>
            <li>
              <strong>Ekran Okuyucu Desteği:</strong> JAWS, NVDA, VoiceOver gibi tüm popüler ekran okuyucularla uyumlu
            </li>
            <li>
              <strong>Altyazı ve Transkript:</strong> Tüm video ve ses içerikleri için otomatik alt yazı üretimi
            </li>
          </ul>
        </div>
      </section>

      {/* İletişim */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-4">İletişim</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz:
        </p>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <strong>E-posta:</strong>{' '}
            <a 
              href="mailto:info@erisilebilirakademi.com" 
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              info@erisilebilirakademi.com
            </a>
          </p>
          <p>
            <strong>Adres:</strong> İstanbul, Türkiye
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

