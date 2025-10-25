import { useState } from 'react'
import { Youtube, FileText, Loader2, PlayCircle, CheckCircle } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'
import GeminiAudioPlayer from '../accessibility/GeminiAudioPlayer'

// Sinyaller ve Sistemler Playlist Videoları
// Playlist: PLs65ieYbCDvMTiJPS-5EOVR18cVxagpMZ
const PLAYLIST_VIDEOS = [
  { id: 'bOjTCcu-jUg', title: 'Ders 1: Sinyaller ve Sistemlere Giriş', duration: '1:12:28' },
  { id: 'MuShgs0bmus', title: 'Ders 2: Sürekli Zaman Sinyalleri', duration: '52:15' },
  { id: 'UWI1rGEqKwA', title: 'Ders 3: Ayrık Zaman Sinyalleri', duration: '48:10' },
  { id: 'kQKhbUxd3-k', title: 'Ders 4: Lineer Sistemler', duration: '56:30' },
  { id: 'YVEgm75l5K8', title: 'Ders 5: Fourier Serileri - Bölüm 1', duration: '51:05' },
  { id: 'aMX8FmqKx8o', title: 'Ders 6: Fourier Serileri - Bölüm 2', duration: '47:20' },
  { id: 'qVw6CLz0O_I', title: 'Ders 7: Fourier Dönüşümü', duration: '1:02:40' },
  { id: 'F6zDP_J0q0M', title: 'Ders 8: Laplace Dönüşümü - Bölüm 1', duration: '58:55' },
  { id: 'lZqE9bqGPYs', title: 'Ders 9: Laplace Dönüşümü - Bölüm 2', duration: '54:30' },
  { id: 'C4kh-rTZqH4', title: 'Ders 10: Z-Dönüşümü', duration: '1:03:15' },
]

/**
 * YouTube video oynatıcı ve transkript üretici
 * - Embedded YouTube player
 * - Playlist yan menüsü
 * - AI ile video transkript (Speech-to-Text)
 * - Gemini TTS ile dinleme
 */
function YouTubePlayer({ videoId: initialVideoId, playlistId, title }) {
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId)
  const [transcript, setTranscript] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [transcriptCache, setTranscriptCache] = useState({})

  const currentVideo = PLAYLIST_VIDEOS.find(v => v.id === currentVideoId) || PLAYLIST_VIDEOS[0]
  
  const embedUrl = playlistId 
    ? `https://www.youtube.com/embed/${currentVideoId}?list=${playlistId}&autoplay=0`
    : `https://www.youtube.com/embed/${currentVideoId}?autoplay=0`

  const handleVideoChange = (newVideoId) => {
    console.log('Video değiştiriliyor:', newVideoId)
    
    // Video ID'sini güncelle
    setCurrentVideoId(newVideoId)
    
    // Cache'de transkript varsa yükle
    if (transcriptCache[newVideoId]) {
      setTranscript(transcriptCache[newVideoId].transcript)
      setSummary(transcriptCache[newVideoId].summary)
    } else {
      setTranscript(null)
      setSummary(null)
    }
    
    setError(null)
    
    // Sayfayı yukarı scroll et
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerateTranscript = async () => {
    setIsGenerating(true)
    setError(null)
    setTranscript(null)
    setSummary(null)

    try {
      const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`
      
      // Gemini'den transkript iste
      const result = await geminiService.analyzeYouTubeVideo(videoUrl)
      
      setTranscript(result.transcript)
      setSummary(result.summary)
      
      // Cache'e kaydet
      setTranscriptCache({
        ...transcriptCache,
        [currentVideoId]: {
          transcript: result.transcript,
          summary: result.summary
        }
      })
    } catch (err) {
      console.error('Transkript üretme hatası:', err)
      setError(err.message || 'Transkript oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Yan Menü - Playlist Videoları */}
      <aside className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-fit sticky top-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Youtube size={20} className="text-red-600" />
          Ders Listesi
        </h3>
        <nav aria-label="Ders videoları">
          <ul className="space-y-2">
            {PLAYLIST_VIDEOS.map((video, index) => {
              const isActive = video.id === currentVideoId
              const hasTranscript = transcriptCache[video.id]
              
              return (
                <li key={video.id}>
                  <button
                    onClick={() => handleVideoChange(video.id)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }
                      focus:outline-none focus:ring-2 focus:ring-red-500
                    `}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {isActive ? (
                          <PlayCircle size={16} />
                        ) : hasTranscript ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive ? 'bg-white text-red-500' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold mb-1 ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                          {video.title}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          ⏱️ {video.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* Playlist Bilgisi */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <strong>Toplam:</strong> {PLAYLIST_VIDEOS.length} ders
          </p>
          <a
            href={`https://www.youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <Youtube size={12} />
            YouTube'da Aç
          </a>
        </div>
      </aside>

      {/* Ana İçerik - Video ve Transkript */}
      <div className="lg:col-span-3 space-y-4">
        {/* Şu anki ders başlığı */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border-l-4 border-red-500">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">
            {currentVideo.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ⏱️ Süre: {currentVideo.duration}
          </p>
        </div>

        {/* YouTube Video Player */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <iframe
            key={`youtube-${currentVideoId}`}
            src={embedUrl}
            title={currentVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
          />
        </div>
        
        {/* Video Navigasyon */}
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <Button
            onClick={() => {
              const currentIndex = PLAYLIST_VIDEOS.findIndex(v => v.id === currentVideoId)
              if (currentIndex > 0) {
                handleVideoChange(PLAYLIST_VIDEOS[currentIndex - 1].id)
              }
            }}
            variant="outline"
            size="sm"
            disabled={PLAYLIST_VIDEOS.findIndex(v => v.id === currentVideoId) === 0}
          >
            ← Önceki Ders
          </Button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {PLAYLIST_VIDEOS.findIndex(v => v.id === currentVideoId) + 1} / {PLAYLIST_VIDEOS.length}
          </span>
          
          <Button
            onClick={() => {
              const currentIndex = PLAYLIST_VIDEOS.findIndex(v => v.id === currentVideoId)
              if (currentIndex < PLAYLIST_VIDEOS.length - 1) {
                handleVideoChange(PLAYLIST_VIDEOS[currentIndex + 1].id)
              }
            }}
            variant="outline"
            size="sm"
            disabled={PLAYLIST_VIDEOS.findIndex(v => v.id === currentVideoId) === PLAYLIST_VIDEOS.length - 1}
          >
            Sonraki Ders →
          </Button>
        </div>

        {/* Bilgi */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>📺 YouTube Video:</strong> Bu video, Sinyaller ve Sistemler playlist'inden alınmıştır. 
            Videoda anlatılanları AI ile metne çevirip sesli dinleyebilirsiniz.
          </p>
        </div>

        {/* Transkript Üret Butonu */}
        {!transcript && !isGenerating && (
          <div className="text-center">
            <Button
              onClick={handleGenerateTranscript}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <FileText size={20} />
              <span className="ml-2">🎙️ Videoyu Metne Çevir (AI ile)</span>
            </Button>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Gemini AI, YouTube videosundaki konuşmaları analiz edip metne çevirecek
            </p>
          </div>
        )}

        {/* Loading */}
        {isGenerating && (
          <div className="text-center py-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
            <Loader2 size={48} className="animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
              🎬 Video analiz ediliyor...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Gemini AI konuşmaları dinleyip metne çeviriyor. Bu birkaç dakika sürebilir.
            </p>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div 
            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
            role="alert"
          >
            <p className="text-red-700 dark:text-red-400">
              ⚠️ {error}
            </p>
            <Button
              onClick={handleGenerateTranscript}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Transkript Sonucu */}
        {transcript && (
          <div className="space-y-4">
            {/* Transkript Kartı */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500 rounded-lg overflow-hidden">
              <div className="p-4 bg-purple-100 dark:bg-purple-800/30">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Youtube size={24} className="text-red-600" />
                  🎬 Video Transkripti (AI)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Videodaki konuşmalar Gemini AI tarafından metne çevrildi
                </p>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Özet */}
                {summary && (
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">
                      📝 Video Özeti
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Tam Transkript */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">
                    📄 Tam Transkript
                  </h4>
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
{transcript}
                    </pre>
                  </div>
                </div>

                {/* Gemini TTS ile Dinle */}
                <GeminiAudioPlayer 
                  text={transcript} 
                  label="🎙️ Transkripti Gemini AI Sesi ile Dinle"
                />
              </div>
            </div>

            {/* Yeni Transkript Üret */}
            <div className="text-center">
              <Button
                onClick={handleGenerateTranscript}
                variant="outline"
                size="md"
              >
                <FileText size={18} />
                <span className="ml-2">Transkripti Yeniden Oluştur</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubePlayer

