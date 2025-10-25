import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Volume2, FileText, Lightbulb, HelpCircle, Download, Youtube } from 'lucide-react'
import Button from '../components/common/Button'
import TextToSpeech from '../components/accessibility/TextToSpeech'
import VideoPlayer from '../components/course/VideoPlayer'
import YouTubePlayer from '../components/course/YouTubePlayer'
import ContentSimplifier from '../components/course/ContentSimplifier'
import QuizGenerator from '../components/course/QuizGenerator'

/**
 * Ders detay sayfası
 * - Ders içeriği
 * - Video oynatıcı (altyazı desteği)
 * - Metni sesli okuma
 * - İçerik basitleştirme (Gemini AI)
 * - Quiz üretme (Gemini AI)
 */
function CourseDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('content')

  // Örnek ders verisi (gerçek uygulamada API'den gelecek)
  const coursesData = {
    1: {
      id: 1,
      title: 'Sinyaller ve Sistemler',
      description: 'Bu derste sinyal işleme, sistem analizi, Fourier dönüşümleri ve kontrol sistemlerinin temellerini öğreneceksiniz.',
      content: `
# Sinyaller ve Sistemler

Sinyaller ve sistemler, elektrik-elektronik mühendisliğinin temel konularından biridir. Bu ders, sinyallerin nasıl analiz edildiğini ve sistemlerin nasıl modellendiğini öğretir.

## Sinyal Nedir?

Sinyal, zaman veya uzay boyunca değişen bir niceliktir. Ses dalgaları, elektrik voltajı, görüntüler - hepsi birer sinyal örneğidir.

### Sinyal Türleri

1. **Sürekli Zaman Sinyalleri**: Her zaman anında tanımlı
2. **Ayrık Zaman Sinyalleri**: Sadece belirli zaman noktalarında tanımlı
3. **Periyodik Sinyaller**: Kendini tekrar eden sinyaller
4. **Aperiyodik Sinyaller**: Tekrar etmeyen sinyaller

## Sistemler

Sistem, bir veya daha fazla giriş sinyalini alıp işleyerek bir veya daha fazla çıkış sinyali üreten bir süreçtir.

### Sistem Özellikleri

- **Lineerlik**: Süperpozisyon prensibi
- **Zamanla Değişmezlik**: Sistem özellikleri zamana bağlı değildir
- **Nedensellik**: Çıkış sadece geçmiş ve şimdiki giriş değerlerine bağlıdır
- **Kararlılık**: Sınırlı giriş, sınırlı çıkış üretir

## Fourier Analizi

Fourier analizi, sinyalleri frekans bileşenlerine ayırarak analiz etmeyi sağlar. Bu, sinyal işlemede en önemli araçlardan biridir.

### Uygulamalar

- Ses işleme ve filtreleme
- Görüntü işleme
- İletişim sistemleri
- Kontrol sistemleri
      `,
      youtubeVideoId: 'bOjTCcu-jUg',
      youtubePlaylist: 'PLs65ieYbCDvMTiJPS-5EOVR18cVxagpMZ',
      instructor: 'Prof. Dr. Mehmet Demir',
      duration: '8 hafta',
      level: 'Orta'
    },
    // Diğer dersler...
  }

  const course = coursesData[parseInt(id)] || coursesData[1]

  const tabs = [
    { id: 'content', label: 'İçerik', icon: FileText },
    { id: 'video', label: 'Video', icon: Play },
    { id: 'simplify', label: 'Basitleştir', icon: Lightbulb },
    { id: 'quiz', label: 'Test', icon: HelpCircle }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Geri Dön Butonu */}
      <Link to="/dersler">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Derslere Dön
        </Button>
      </Link>

      {/* Ders Başlığı */}
      <header className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong>Eğitmen:</strong> {course.instructor}
          </div>
          <div>
            <strong>Süre:</strong> {course.duration}
          </div>
          <div>
            <strong>Seviye:</strong> {course.level}
          </div>
        </div>
      </header>

      {/* Tab Navigasyon */}
      <nav 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        aria-label="Ders içeriği navigasyonu"
      >
        <div className="flex flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Tab İçeriği */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 min-h-[400px]">
        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Ders İçeriği</h2>
              <TextToSpeech text={course.content} />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {/* Markdown content buraya render edilecek */}
              <div dangerouslySetInnerHTML={{ __html: course.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Youtube size={28} className="text-red-600" />
              Ders Videosu
            </h2>
            {course.youtubeVideoId ? (
              <YouTubePlayer 
                videoId={course.youtubeVideoId} 
                playlistId={course.youtubePlaylist}
                title={course.title} 
              />
            ) : (
              <VideoPlayer videoUrl={course.videoUrl} title={course.title} />
            )}
          </div>
        )}

        {activeTab === 'simplify' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">İçeriği Basitleştir</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Yapay zeka ile ders içeriğini daha basit ve anlaşılır hale getirin.
            </p>
            <ContentSimplifier content={course.content} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Kendini Test Et</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Yapay zeka tarafından oluşturulmuş sorularla öğrendiklerinizi test edin.
            </p>
            <QuizGenerator content={course.content} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetailPage

