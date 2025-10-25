import { useState } from 'react'
import { Loader2, Lightbulb, AlertCircle } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'

/**
 * İçerik basitleştirici bileşen
 * - Gemini AI ile metni basitleştirir
 * - Karmaşık terimleri açıklar
 */
function ContentSimplifier({ content }) {
  const [simplifiedContent, setSimplifiedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSimplify = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await geminiService.simplifyText(content)
      setSimplifiedContent(result)
    } catch (err) {
      setError('İçerik basitleştirilirken bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Simplify error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await geminiService.summarizeText(content)
      setSimplifiedContent(result)
    } catch (err) {
      setError('Özet oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Summarize error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Kontroller */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSimplify}
          variant="primary"
          size="md"
          disabled={isLoading}
          ariaLabel="İçeriği basitleştir"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="ml-2">İşleniyor...</span>
            </>
          ) : (
            <>
              <Lightbulb size={20} />
              <span className="ml-2">Basitleştir</span>
            </>
          )}
        </Button>

        <Button
          onClick={handleSummarize}
          variant="outline"
          size="md"
          disabled={isLoading}
          ariaLabel="İçeriği özetle"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="ml-2">İşleniyor...</span>
            </>
          ) : (
            <>
              <Lightbulb size={20} />
              <span className="ml-2">Özetle</span>
            </>
          )}
        </Button>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Basitleştirilmiş İçerik */}
      {simplifiedContent && (
        <div 
          className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded"
          role="region"
          aria-label="Basitleştirilmiş içerik"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb size={20} className="text-green-600 dark:text-green-400" />
            <span>Basitleştirilmiş İçerik</span>
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{simplifiedContent}</p>
          </div>
        </div>
      )}

      {/* Bilgilendirme */}
      {!simplifiedContent && !error && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Nasıl çalışır?</strong> Google Gemini AI, ders içeriğini analiz ederek daha basit ve anlaşılır 
            bir dille yeniden yazar. Karmaşık terimleri açıklar ve cümleleri kısaltır. 
            Önemli bilgiler korunur.
          </p>
        </div>
      )}
    </div>
  )
}

export default ContentSimplifier

