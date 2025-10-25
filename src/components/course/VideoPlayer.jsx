import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'
import Button from '../common/Button'

/**
 * Erişilebilir video oynatıcı
 * - Klavye kontrolleri
 * - Altyazı desteği
 * - ARIA etiketleri
 */
function VideoPlayer({ videoUrl, title, subtitles = [] }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showSubtitles, setShowSubtitles] = useState(true)

  // Demo amaçlı - gerçek uygulamada videoUrl kullanılacak
  const demoMessage = "Video oynatıcı demo modu. Gerçek uygulamada burada video oynatılacak."

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles)
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div 
        className="relative bg-black rounded-lg overflow-hidden aspect-video"
        role="region"
        aria-label={`Video oynatıcı: ${title}`}
      >
        {/* Demo Mesajı */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white p-8">
            <Play size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">{demoMessage}</p>
            <p className="text-sm opacity-75">
              Video URL: {videoUrl || 'Belirtilmemiş'}
            </p>
          </div>
        </div>

        {/* Gerçek video elementi (gizli - demo için) */}
        <video
          ref={videoRef}
          className="w-full h-full hidden"
          aria-label={title}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Altyazı track'leri */}
          {subtitles.map((subtitle, index) => (
            <track
              key={index}
              kind="subtitles"
              src={subtitle.src}
              srcLang={subtitle.lang}
              label={subtitle.label}
              default={index === 0}
            />
          ))}
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {/* Altyazı Gösterimi */}
        {showSubtitles && (
          <div 
            className="absolute bottom-16 left-0 right-0 text-center"
            aria-live="polite"
            role="region"
            aria-label="Video altyazıları"
          >
            <div className="inline-block bg-black/80 text-white px-4 py-2 rounded">
              <p className="text-lg">Altyazı burada görünecek</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Kontrolleri */}
      <div 
        className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
        role="group"
        aria-label="Video kontrolleri"
      >
        {/* Oynat/Duraklat */}
        <Button
          onClick={togglePlay}
          variant="primary"
          size="md"
          ariaLabel={isPlaying ? 'Videoyu duraklat' : 'Videoyu oynat'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        {/* Ses */}
        <Button
          onClick={toggleMute}
          variant="outline"
          size="md"
          ariaLabel={isMuted ? 'Sesi aç' : 'Sesi kapat'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>

        {/* Altyazı */}
        <Button
          onClick={toggleSubtitles}
          variant={showSubtitles ? 'primary' : 'outline'}
          size="md"
          ariaLabel={showSubtitles ? 'Altyazıları gizle' : 'Altyazıları göster'}
        >
          <Settings size={20} />
          <span className="ml-2 hidden sm:inline">Altyazı</span>
        </Button>

        {/* Tam Ekran */}
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="md"
          ariaLabel="Tam ekran"
          className="ml-auto"
        >
          <Maximize size={20} />
        </Button>
      </div>

      {/* Video Açıklaması */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Erişilebilirlik notu:</strong> Bu video tam altyazı desteği ile sunulmaktadır. 
          Altyazıları açmak/kapatmak için yukarıdaki "Altyazı" butonunu kullanabilirsiniz. 
          Klavye ile kontrol için: Space (oynat/duraklat), M (ses), F (tam ekran).
        </p>
      </div>
    </div>
  )
}

export default VideoPlayer

