import { useState } from 'react'
import { 
  Type, 
  Minus, 
  Plus, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Sun,
  Moon,
  Contrast,
  Settings,
  X
} from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useTheme, THEMES } from '../../contexts/ThemeContext'
import Button from '../common/Button'

/**
 * Erişilebilirlik araç çubuğu
 * - Font boyutu kontrolü
 * - Tema değiştirme
 * - Sesli okuma
 * - Diğer erişilebilirlik ayarları
 */
function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    speechEnabled,
    setSpeechEnabled,
    reduceMotion,
    setReduceMotion
  } = useAccessibility()
  
  const { theme, setTheme } = useTheme()

  const toggleToolbar = () => {
    setIsOpen(!isOpen)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <>
      {/* Araç çubuğu açma butonu - her zaman görünür */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleToolbar}
          variant="primary"
          size="md"
          ariaLabel={isOpen ? 'Erişilebilirlik panelini kapat' : 'Erişilebilirlik panelini aç'}
          className="shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Settings size={24} />}
          <span className="ml-2 hidden sm:inline">Erişilebilirlik</span>
        </Button>
      </div>

      {/* Araç çubuğu paneli */}
      {isOpen && (
        <div 
          className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 z-40 w-80 border-2 border-gray-200 dark:border-gray-700"
          role="dialog"
          aria-label="Erişilebilirlik ayarları"
        >
          <h2 className="text-xl font-bold mb-4">Erişilebilirlik Ayarları</h2>
          
          {/* Font Boyutu Kontrolü */}
          <section className="mb-6" aria-labelledby="font-size-heading">
            <h3 id="font-size-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Type size={20} />
              Metin Boyutu
            </h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={decreaseFontSize}
                variant="outline"
                size="sm"
                ariaLabel="Yazı boyutunu küçült"
                disabled={fontSize <= 12}
              >
                <Minus size={16} />
              </Button>
              <span className="flex-1 text-center font-medium" aria-live="polite">
                {fontSize}px
              </span>
              <Button
                onClick={increaseFontSize}
                variant="outline"
                size="sm"
                ariaLabel="Yazı boyutunu büyüt"
                disabled={fontSize >= 24}
              >
                <Plus size={16} />
              </Button>
              <Button
                onClick={resetFontSize}
                variant="ghost"
                size="sm"
                ariaLabel="Yazı boyutunu sıfırla"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
          </section>

          {/* Tema Seçimi */}
          <section className="mb-6" aria-labelledby="theme-heading">
            <h3 id="theme-heading" className="text-lg font-semibold mb-3">
              Tema
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleThemeChange(THEMES.LIGHT)}
                variant={theme === THEMES.LIGHT ? 'primary' : 'outline'}
                size="sm"
                ariaLabel="Aydınlık tema"
                className="flex flex-col items-center gap-1 py-3"
              >
                <Sun size={20} />
                <span className="text-xs">Aydınlık</span>
              </Button>
              <Button
                onClick={() => handleThemeChange(THEMES.DARK)}
                variant={theme === THEMES.DARK ? 'primary' : 'outline'}
                size="sm"
                ariaLabel="Karanlık tema"
                className="flex flex-col items-center gap-1 py-3"
              >
                <Moon size={20} />
                <span className="text-xs">Karanlık</span>
              </Button>
              <Button
                onClick={() => handleThemeChange(THEMES.HIGH_CONTRAST)}
                variant={theme === THEMES.HIGH_CONTRAST ? 'primary' : 'outline'}
                size="sm"
                ariaLabel="Yüksek kontrast modu"
                className="flex flex-col items-center gap-1 py-3"
              >
                <Contrast size={20} />
                <span className="text-xs">Kontrast</span>
              </Button>
            </div>
          </section>

          {/* Sesli Okuma */}
          <section className="mb-6" aria-labelledby="speech-heading">
            <h3 id="speech-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
              {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              Sesli Okuma
            </h3>
            <Button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              variant={speechEnabled ? 'primary' : 'outline'}
              size="md"
              ariaLabel={speechEnabled ? 'Sesli okumayı kapat' : 'Sesli okumayı aç'}
              className="w-full"
            >
              {speechEnabled ? 'Aktif' : 'Kapalı'}
            </Button>
          </section>

          {/* Animasyonları Azalt */}
          <section aria-labelledby="motion-heading">
            <div className="flex items-center justify-between">
              <h3 id="motion-heading" className="text-lg font-semibold">
                Animasyonları Azalt
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Animasyonları azalt"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bu ayarlar tarayıcınızda kaydedilir.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AccessibilityToolbar

