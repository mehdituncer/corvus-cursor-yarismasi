import { useState } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import Button from '../common/Button'

/**
 * Basit TTS bileşeni - Web Speech API (Fallback için)
 * - API limiti aşıldığında kullanılır
 * - Tarayıcı yerleşik TTS
 * - Hızlı ve güvenilir
 */
function SimpleTTS({ text, label = "Sesli Oku" }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.')
      return
    }

    // Zaten konuşuyorsa durdur
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Yeni konuşma başlat
    window.speechSynthesis.cancel() // Önceki konuşmaları temizle

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <Button
      onClick={handleSpeak}
      variant="outline"
      size="sm"
      className="text-xs"
      ariaLabel={isPlaying ? 'Okumayı durdur' : label}
    >
      {isPlaying ? (
        <>
          <VolumeX size={14} />
          <span className="ml-1">Durdur</span>
        </>
      ) : (
        <>
          <Volume2 size={14} />
          <span className="ml-1">{label}</span>
        </>
      )}
    </Button>
  )
}

export default SimpleTTS

