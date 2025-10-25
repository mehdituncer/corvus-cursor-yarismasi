import { useState } from 'react'
import { FileText, Image, Video, Trash2, Volume2, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../common/Button'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import GeminiAudioPlayer from '../accessibility/GeminiAudioPlayer'

/**
 * Yüklenmiş materyal kartı
 * - Materyal bilgileri
 * - AI tarafından üretilen içerik
 * - Sesli okuma
 * - Önizleme
 */
function MaterialCard({ material, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { speak, speechEnabled } = useAccessibility()

  const getIcon = () => {
    switch (material.type) {
      case 'document':
        return <FileText size={24} className="text-blue-600 dark:text-blue-400" />
      case 'image':
        return <Image size={24} className="text-green-600 dark:text-green-400" />
      case 'video':
        return <Video size={24} className="text-purple-600 dark:text-purple-400" />
      default:
        return <FileText size={24} className="text-gray-600 dark:text-gray-400" />
    }
  }

  const getTypeLabel = () => {
    switch (material.type) {
      case 'document':
        return 'Doküman'
      case 'image':
        return 'Görsel'
      case 'video':
        return 'Video'
      default:
        return 'Dosya'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleSpeak = () => {
    if (material.extractedText) {
      speak(material.extractedText)
    } else if (material.description) {
      speak(material.description)
    }
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Başlık */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" title={material.fileName}>
              {material.fileName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {getTypeLabel()}
              </span>
              <span>{formatFileSize(material.fileSize)}</span>
              <span>•</span>
              <span>{formatDate(material.uploadDate)}</span>
            </div>
          </div>
          <Button
            onClick={() => onDelete(material.id)}
            variant="ghost"
            size="sm"
            ariaLabel="Materyali sil"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        {/* Görsel Preview */}
        {material.type === 'image' && material.preview && (
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={material.preview}
              alt={material.description || material.fileName}
              className="w-full h-48 object-contain"
            />
          </div>
        )}

        {/* AI Açıklaması (Görsel için) */}
        {material.description && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded space-y-3">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Eye size={18} className="text-green-600 dark:text-green-400" />
                AI Görselin Açıklaması
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{material.description}</p>
            </div>
            
            {/* Gemini TTS ile Görsel Açıklamasını Dinle */}
            <div className="pt-3 border-t border-green-200 dark:border-green-800">
              <GeminiAudioPlayer 
                text={material.description} 
                label="🎙️ Görsel Açıklamasını Dinle (Gemini AI Sesi)"
              />
            </div>
          </div>
        )}

        {/* AI Detaylı Ders Anlatımı (Doküman için) */}
        {material.extractedText && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              aria-expanded={isExpanded}
            >
              <span className="font-bold flex items-center gap-2 text-lg">
                <FileText size={22} />
                🎓 AI ile Detaylı Ders Anlatımı
              </span>
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            
             {isExpanded && (
              <div className="mt-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                    {material.extractedText}
                  </p>
                </div>
                
                {/* Gemini TTS ile Detaylı İçeriği Dinle */}
                <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                  <GeminiAudioPlayer 
                    text={material.extractedText} 
                    label="🎙️ Detaylı Anlatımı Dinle (Gemini AI Sesi)"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    💡 Gemini AI tarafından profesyonel Türkçe sesle seslendirilir
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Özet (Doküman için) */}
        {material.summary && material.type === 'document' && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded space-y-3">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText size={18} className="text-amber-600 dark:text-amber-400" />
                Hızlı Özet
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{material.summary}</p>
            </div>
            
            {/* Gemini TTS ile Dinle */}
            <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
              <GeminiAudioPlayer 
                text={material.summary} 
                label="🎙️ Özeti Dinle (Gemini AI Sesi)"
              />
            </div>
          </div>
        )}

        {/* Video Transkript */}
        {material.transcript && material.type === 'video' && (
          <div className="mb-4 space-y-4">
            {/* Transkript Kartı */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-lg overflow-hidden">
              <div className="p-4 bg-purple-100 dark:bg-purple-800/30">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Video size={20} className="text-purple-600 dark:text-purple-400" />
                  🎬 Video Konuşma Transkripti (AI)
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Videodaki konuşmalar otomatik olarak metne çevrildi
                </p>
              </div>
              
              <div className="p-4">
                {/* Transkript Metni */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700 max-h-64 overflow-y-auto mb-4">
                  <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
{material.transcript}
                  </pre>
                </div>
                
                {/* Video Özeti */}
                {material.summary && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg mb-4">
                    <h5 className="font-semibold text-sm mb-2 text-indigo-700 dark:text-indigo-300">
                      📝 Özet
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {material.summary}
                    </p>
                  </div>
                )}
                
                {/* Gemini TTS ile Dinle */}
                <GeminiAudioPlayer 
                  text={material.transcript} 
                  label="🎙️ Transkripti Dinle (Gemini AI Sesi)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(material.extractedText || material.description) && speechEnabled && (
            <Button
              onClick={handleSpeak}
              variant="outline"
              size="sm"
            >
              <Volume2 size={18} />
              <span className="ml-2">Sesli Oku</span>
            </Button>
          )}
          
          {material.preview && (
            <a
              href={material.preview}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Eye size={18} />
                <span className="ml-2">Önizle</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* AI İşleme Bilgisi */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          ✨ Bu materyal yapay zeka tarafından analiz edildi ve erişilebilir hale getirildi
        </p>
      </div>
    </article>
  )
}

export default MaterialCard

