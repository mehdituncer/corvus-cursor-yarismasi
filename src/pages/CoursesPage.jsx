import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, BarChart, Search } from 'lucide-react'
import Button from '../components/common/Button'

/**
 * Dersler sayfası
 * - Ders listesi
 * - Arama ve filtreleme
 */
function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  // Örnek ders verisi
  const courses = [
    {
      id: 1,
      title: 'Sinyaller ve Sistemler',
      description: 'Sinyal işleme, sistem analizi, Fourier dönüşümleri ve kontrol sistemleri temellerini öğrenin. YouTube video dersleri ile desteklenmiştir.',
      level: 'intermediate',
      duration: '8 hafta',
      lessonsCount: 24,
      image: '📡',
      youtubePlaylist: 'PLs65ieYbCDvMTiJPS-5EOVR18cVxagpMZ',
      youtubeVideoId: 'bOjTCcu-jUg'
    },
    {
      id: 2,
      title: 'React ile Erişilebilir Bileşenler',
      description: 'React kullanarak erişilebilir kullanıcı arayüz bileşenleri oluşturmayı öğrenin.',
      level: 'intermediate',
      duration: '6 hafta',
      lessonsCount: 18,
      image: '⚛️'
    },
    {
      id: 3,
      title: 'Ekran Okuyucular için Optimizasyon',
      description: 'JAWS, NVDA ve VoiceOver için web içeriğini optimize etme teknikleri.',
      level: 'intermediate',
      duration: '3 hafta',
      lessonsCount: 10,
      image: '👁️'
    },
    {
      id: 4,
      title: 'İşaret Dili ve Dijital İletişim',
      description: 'Türk İşaret Dili temellerini ve dijital ortamlarda kullanımını öğrenin.',
      level: 'beginner',
      duration: '8 hafta',
      lessonsCount: 24,
      image: '🤟'
    },
    {
      id: 5,
      title: 'Yapay Zeka ve Erişilebilirlik',
      description: 'AI araçlarının erişilebilirlik çözümlerinde kullanımı ve gelecek trendleri.',
      level: 'advanced',
      duration: '5 hafta',
      lessonsCount: 15,
      image: '🤖'
    },
    {
      id: 6,
      title: 'Mobil Uygulama Erişilebilirliği',
      description: 'iOS ve Android platformlarında erişilebilir mobil uygulamalar geliştirme.',
      level: 'intermediate',
      duration: '6 hafta',
      lessonsCount: 20,
      image: '📱'
    }
  ]

  const levelLabels = {
    beginner: 'Başlangıç',
    intermediate: 'Orta',
    advanced: 'İleri'
  }

  const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  // Filtreleme
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Dersler</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Erişilebilirlik alanında kendinizi geliştirin. Tüm dersler görme ve işitme engelli öğrenciler için optimize edilmiştir.
        </p>
      </section>

      {/* Arama ve Filtreleme */}
      <section 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        aria-label="Ders arama ve filtreleme"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Arama */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              Ders Ara
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="search"
                type="search"
                placeholder="Ders adı veya açıklama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="search-description"
              />
              <p id="search-description" className="sr-only">
                Ders adı veya açıklama ile arama yapın
              </p>
            </div>
          </div>

          {/* Seviye Filtresi */}
          <div>
            <label htmlFor="level-filter" className="block text-sm font-medium mb-2">
              Seviye
            </label>
            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tüm Seviyeler</option>
              <option value="beginner">Başlangıç</option>
              <option value="intermediate">Orta</option>
              <option value="advanced">İleri</option>
            </select>
          </div>
        </div>

        {/* Sonuç sayısı */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
          {filteredCourses.length} ders bulundu
        </div>
      </section>

      {/* Ders Listesi */}
      <section aria-label="Ders listesi">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Aramanıza uygun ders bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Ders Görseli */}
                <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-6xl">
                  <span role="img" aria-label={`${course.title} ikonu`}>
                    {course.image}
                  </span>
                </div>

                {/* Ders İçeriği */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelColors[course.level]}`}>
                      {levelLabels[course.level]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {course.description}
                  </p>

                  {/* Ders Bilgileri */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1" title="Süre">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Ders sayısı">
                      <BookOpen size={16} />
                      <span>{course.lessonsCount} ders</span>
                    </div>
                  </div>

                  {/* Ders Linki */}
                  <Link to={`/ders/${course.id}`}>
                    <Button variant="primary" className="w-full">
                      Derse Git
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CoursesPage

