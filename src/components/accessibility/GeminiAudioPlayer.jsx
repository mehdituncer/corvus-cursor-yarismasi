import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, RotateCcw, Loader2, StopCircle } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'

// Gemini ses seçenekleri
const VOICE_OPTIONS = [
  { value: 'Aoede', label: '🎤 Aoede (Kadın - Yumuşak)' },
  { value: 'Charon', label: '🎤 Charon (Erkek - Derin)' },
  { value: 'Fenrir', label: '🎤 Fenrir (Erkek - Güçlü)' },
  { value: 'Kore', label: '🎤 Kore (Kadın - Profesyonel)' },
  { value: 'Puck', label: '🎤 Puck (Genç - Dinamik)' },
  { value: 'Zephyr', label: '🎤 Zephyr (Kadın - Enerjik)' }
]

/**
 * Gemini TTS ile tam özellikli ses oynatıcı
 * - Ses seçimi
 * - Play/Pause/Stop/Restart
 * - Progress bar
 * - Loading states
 */
function GeminiAudioPlayer({ text, label = "Dinle" }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const [selectedVoice, setSelectedVoice] = useState('Aoede')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  // Cleanup: component unmount olduğunda ses URL'ini temizle
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }

    const handleError = () => {
      setError('Ses çalınırken bir hata oluştu')
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [audioUrl])

  const handleGenerate = async () => {
    if (!text) return

    setError(null)
    setIsLoading(true)
    setAudioUrl(null)
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)

    try {
      // Gemini TTS ile ses oluştur
      const audioBlob = await geminiService.textToSpeech(text, selectedVoice)
      
      if (audioBlob) {
        // Blob'dan URL oluştur
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Audio element'e yükle ve BEKLE
        if (audioRef.current) {
          audioRef.current.src = url
          // Metadata yüklenene kadar bekle
          await new Promise((resolve) => {
            audioRef.current.onloadedmetadata = resolve
          })
          // Şimdi oynat
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } else {
        // Fallback kullanıldı
        setError('Gemini TTS kullanılamadı, tarayıcı sesi kullanıldı')
      }
    } catch (err) {
      console.error('Ses oluşturma hatası:', err)
      
      // API limit hatası
      if (err.message?.includes('429') || err.message?.includes('Too Many Requests') || err.message?.includes('quota')) {
        setError('⚠️ API limiti aşıldı. Lütfen birkaç saat sonra tekrar deneyin.')
      } else {
        setError('Ses oluşturulamadı: ' + err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleStop = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  const handleRestart = () => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play()
    setIsPlaying(true)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
      {/* Ses Seçimi */}
      <div>
        <label htmlFor="voice-select" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          🎵 Ses Seçimi:
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          disabled={isLoading || isPlaying}
          className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {VOICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ses Üret Butonu (henüz ses yoksa) */}
      {!audioUrl && !isLoading && (
        <Button
          onClick={handleGenerate}
          variant="primary"
          size="md"
          className="w-full"
          ariaLabel={label}
        >
          <Volume2 size={18} />
          <span className="ml-2">{label}</span>
        </Button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <Loader2 size={32} className="animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
            🎙️ Gemini AI ile profesyonel ses üretiliyor...
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Ses: {VOICE_OPTIONS.find(v => v.value === selectedVoice)?.label}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            ⚠️ Lütfen bekleyin - ses hazırlanıyor...
          </p>
        </div>
      )}

      {/* Audio Kontrolleri (ses hazır olduğunda) */}
      {audioUrl && !isLoading && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          {/* Kontrol Butonları */}
          <div className="flex items-center justify-center gap-2">
            {/* Başa Al */}
            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              ariaLabel="Başa al"
              disabled={!audioUrl}
            >
              <RotateCcw size={18} />
            </Button>

            {/* Play/Pause */}
            <Button
              onClick={handlePlayPause}
              variant="primary"
              size="md"
              ariaLabel={isPlaying ? 'Duraklat' : 'Oynat'}
              className="px-6"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} />
                  <span className="ml-2">Duraklat</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span className="ml-2">Oynat</span>
                </>
              )}
            </Button>

            {/* Durdur */}
            <Button
              onClick={handleStop}
              variant="danger"
              size="sm"
              ariaLabel="Durdur"
              disabled={!audioUrl}
            >
              <StopCircle size={18} />
            </Button>
          </div>

          {/* Yeni Ses Üret */}
          <Button
            onClick={handleGenerate}
            variant="outline"
            size="sm"
            className="w-full"
            ariaLabel="Yeni ses oluştur"
          >
            <Volume2 size={16} />
            <span className="ml-2">Farklı Sesle Tekrar Üret</span>
          </Button>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div 
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-500"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Audio Element (gizli) */}
      <audio
        ref={audioRef}
        className="hidden"
        aria-label="Ses oynatıcı"
      />
    </div>
  )
}

export default GeminiAudioPlayer

