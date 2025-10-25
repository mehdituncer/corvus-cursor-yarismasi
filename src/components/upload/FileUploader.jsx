import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'
import Button from '../common/Button'
import fileProcessingService from '../../services/fileProcessingService'

/**
 * Dosya yükleme bileşeni
 * - Drag & drop desteği
 * - Çoklu dosya yükleme
 * - AI ile otomatik işleme
 */
function FileUploader({ onUploadComplete, onUploadStart, onUploadEnd }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadQueue, setUploadQueue] = useState([])
  const fileInputRef = useRef(null)

  const acceptedTypes = {
    // Dokümanlar
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    // Görseller
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    // Videolar
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov'],
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const processFiles = async (files) => {
    if (files.length === 0) return

    onUploadStart?.()

    // Her dosya için queue oluştur
    const newQueue = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'processing', // processing, success, error
      progress: 0,
      result: null,
      error: null
    }))

    setUploadQueue(newQueue)

    // Dosyaları sırayla işle
    for (let i = 0; i < newQueue.length; i++) {
      const item = newQueue[i]
      
      try {
        // İlerleme güncelle
        updateQueueItem(item.id, { progress: 10 })

        // Dosya tipini belirle
        const fileType = determineFileType(item.file)
        updateQueueItem(item.id, { progress: 20 })

        let result = null

        // Dosya tipine göre işle
        if (fileType === 'image') {
          result = await fileProcessingService.processImage(item.file)
        } else if (fileType === 'document') {
          result = await fileProcessingService.processDocument(item.file)
        } else if (fileType === 'video') {
          result = await fileProcessingService.processVideo(item.file)
        }

        updateQueueItem(item.id, { 
          progress: 100, 
          status: 'success',
          result: {
            id: Date.now() + i,
            fileName: item.file.name,
            fileSize: item.file.size,
            type: fileType,
            uploadDate: new Date().toISOString(),
            ...result
          }
        })

        // Başarılı yüklemeyi bildir
        if (result && onUploadComplete) {
          onUploadComplete({
            id: Date.now() + i,
            fileName: item.file.name,
            fileSize: item.file.size,
            type: fileType,
            uploadDate: new Date().toISOString(),
            ...result
          })
        }

      } catch (error) {
        console.error('File processing error:', error)
        updateQueueItem(item.id, { 
          status: 'error',
          error: error.message || 'Dosya işlenirken bir hata oluştu'
        })
      }
    }

    onUploadEnd?.()

    // Queue'yu 3 saniye sonra temizle
    setTimeout(() => {
      setUploadQueue([])
    }, 3000)
  }

  const updateQueueItem = (id, updates) => {
    setUploadQueue(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }

  const determineFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.includes('pdf') || 
        file.type.includes('powerpoint') || 
        file.type.includes('presentation') ||
        file.type.includes('word') ||
        file.type.includes('document')) return 'document'
    return 'other'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const removeFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Yükleme Alanı */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Dosya yükleme alanı"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          Dosyaları buraya sürükleyin veya tıklayın
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          PDF, PowerPoint, Word, görsel veya video dosyaları yükleyebilirsiniz
        </p>
        <Button variant="primary" size="md" type="button">
          Dosya Seç
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.keys(acceptedTypes).join(',')}
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Dosya seçici"
        />
      </div>

      {/* Yükleme Queue'su */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            İşleniyor ({uploadQueue.length} dosya)
          </h3>
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {/* Durum İkonu */}
                <div className="flex-shrink-0">
                  {item.status === 'processing' && (
                    <Loader2 size={24} className="animate-spin text-primary-600" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle size={24} className="text-green-600" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle size={24} className="text-red-600" />
                  )}
                </div>

                {/* Dosya Bilgisi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{item.file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                  
                  {/* İlerleme Çubuğu */}
                  {item.status === 'processing' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                        role="progressbar"
                        aria-valuenow={item.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  )}

                  {/* Başarı Mesajı */}
                  {item.status === 'success' && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Başarıyla yüklendi ve işlendi
                    </p>
                  )}

                  {/* Hata Mesajı */}
                  {item.status === 'error' && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ✗ {item.error}
                    </p>
                  )}
                </div>

                {/* Kaldır Butonu */}
                {item.status !== 'processing' && (
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    aria-label="Listeden kaldır"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploader

