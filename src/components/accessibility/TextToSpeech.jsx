import { useState } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import Button from '../common/Button'
import { useAccessibility } from '../../contexts/AccessibilityContext'

/**
 * Metni sesli okuma bileşeni
 * - Web Speech API kullanır
 * - Oynat/Duraklat/Durdur kontrolleri
 */
function TextToSpeech({ text }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const { speechEnabled } = useAccessibility()

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.')
      return
    }

    if (isPlaying && !isPaused) {
      // Duraklat
      window.speechSynthesis.pause()
      setIsPaused(true)
    } else if (isPaused) {
      // Devam et
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      // Başlat
      window.speechSynthesis.cancel() // Önceki konuşmaları temizle

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'tr-TR'
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  if (!speechEnabled) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Sesli okuma kapalı. Erişilebilirlik panelinden açabilirsiniz.
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleSpeak}
        variant="outline"
        size="sm"
        ariaLabel={isPlaying ? (isPaused ? 'Okumaya devam et' : 'Okumayı duraklat') : 'Metni sesli oku'}
      >
        {isPlaying ? (
          isPaused ? (
            <>
              <Play size={18} />
              <span className="ml-2">Devam Et</span>
            </>
          ) : (
            <>
              <Pause size={18} />
              <span className="ml-2">Duraklat</span>
            </>
          )
        ) : (
          <>
            <Volume2 size={18} />
            <span className="ml-2">Sesli Oku</span>
          </>
        )}
      </Button>

      {isPlaying && (
        <Button
          onClick={handleStop}
          variant="ghost"
          size="sm"
          ariaLabel="Okumayı durdur"
        >
          <VolumeX size={18} />
          <span className="ml-2">Durdur</span>
        </Button>
      )}
    </div>
  )
}

export default TextToSpeech

