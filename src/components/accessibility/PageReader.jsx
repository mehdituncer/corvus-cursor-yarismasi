import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Pause, Play, SkipForward } from 'lucide-react'
import Button from '../common/Button'

/**
 * Sayfa Okuyucu - Görme Engelliler İçin
 * - Tüm sayfa içeriğini sesli okur
 * - Play/Pause/Stop kontrolleri
 * - Otomatik bölüm bölüm okuma
 */
function PageReader() {
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [sections, setSections] = useState([])

  useEffect(() => {
    // Sayfa içeriğini bölümlere ayır
    const extractSections = () => {
      const mainContent = document.getElementById('main-content')
      if (!mainContent) return []

      const elements = mainContent.querySelectorAll('h1, h2, h3, p, li, button, a')
      const sectionList = []

      elements.forEach(element => {
        const text = element.textContent?.trim()
        if (text && text.length > 0) {
          // Çok kısa metinleri atlama
          if (text.length < 3) return
          
          // Element tipine göre öncelik ve açıklama ekle
          let prefix = ''
          if (element.tagName === 'H1') prefix = 'Ana başlık: '
          else if (element.tagName === 'H2') prefix = 'Alt başlık: '
          else if (element.tagName === 'H3') prefix = 'Bölüm başlığı: '
          else if (element.tagName === 'BUTTON') prefix = 'Buton: '
          else if (element.tagName === 'A') prefix = 'Link: '

          sectionList.push({
            text: prefix + text,
            element: element
          })
        }
      })

      return sectionList
    }

    setSections(extractSections())
  }, [])

  const handleStartReading = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.')
      return
    }

    // Eğer okuma duraklatıldıysa devam et
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsReading(true)
      return
    }

    // Yeni okumaya başla
    setIsReading(true)
    setCurrentSection(0)
    readSection(0)
  }

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsReading(false)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsReading(false)
    setIsPaused(false)
    setCurrentSection(0)
  }

  const handleSkip = () => {
    const nextSection = currentSection + 1
    if (nextSection < sections.length) {
      window.speechSynthesis.cancel()
      setCurrentSection(nextSection)
      readSection(nextSection)
    } else {
      handleStop()
    }
  }

  const readSection = (index) => {
    if (index >= sections.length) {
      handleStop()
      return
    }

    const section = sections[index]
    const utterance = new SpeechSynthesisUtterance(section.text)
    utterance.lang = 'tr-TR'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      const next = index + 1
      if (next < sections.length) {
        setCurrentSection(next)
        // Kısa bir duraklama
        setTimeout(() => readSection(next), 500)
      } else {
        handleStop()
      }
    }

    utterance.onerror = () => {
      handleStop()
    }

    // Okunan bölümü vurgula (görsel geri bildirim)
    if (section.element) {
      // Önceki vurguyu kaldır
      document.querySelectorAll('.reading-highlight').forEach(el => {
        el.classList.remove('reading-highlight')
      })
      // Yeni vurgula
      section.element.classList.add('reading-highlight')
    }

    window.speechSynthesis.speak(utterance)
  }

  if (sections.length === 0) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 p-4 max-w-xs">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <Volume2 size={18} className="text-blue-600" />
        Sayfa Okuyucu
      </h3>

      {/* İlerleme */}
      {isReading || isPaused ? (
        <div className="mb-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {currentSection + 1} / {sections.length} bölüm
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Sayfadaki tüm içeriği sesli okur ({sections.length} bölüm)
        </p>
      )}

      {/* Kontroller */}
      <div className="flex gap-2">
        {!isReading && !isPaused ? (
          <Button
            onClick={handleStartReading}
            variant="primary"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Play size={16} />
            <span className="ml-2">Sayfayı Oku</span>
          </Button>
        ) : (
          <>
            {isReading ? (
              <Button
                onClick={handlePause}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Pause size={16} />
                <span className="ml-1 text-xs">Duraklat</span>
              </Button>
            ) : (
              <Button
                onClick={handleStartReading}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                <Play size={16} />
                <span className="ml-1 text-xs">Devam</span>
              </Button>
            )}

            <Button
              onClick={handleSkip}
              variant="outline"
              size="sm"
              ariaLabel="Sonraki bölüm"
            >
              <SkipForward size={16} />
            </Button>

            <Button
              onClick={handleStop}
              variant="danger"
              size="sm"
              ariaLabel="Durdur"
            >
              <VolumeX size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Klavye Kısayolları */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Shift+R</kbd> Okumaya başla
        </p>
      </div>
    </div>
  )
}

export default PageReader

