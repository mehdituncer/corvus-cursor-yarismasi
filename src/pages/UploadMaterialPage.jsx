import { useState } from 'react'
import { Upload, FileText, Image, Video, File, Trash2, Eye, Volume2 } from 'lucide-react'
import Button from '../components/common/Button'
import FileUploader from '../components/upload/FileUploader'
import MaterialCard from '../components/upload/MaterialCard'

/**
 * Materyal yükleme sayfası
 * - Kullanıcılar PDF, PPTX, görsel, video yükleyebilir
 * - AI ile içerik analizi
 * - Sesli okuma
 */
function UploadMaterialPage() {
  const [uploadedMaterials, setUploadedMaterials] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (processedMaterial) => {
    setUploadedMaterials([processedMaterial, ...uploadedMaterials])
  }

  const handleDelete = (id) => {
    setUploadedMaterials(uploadedMaterials.filter(m => m.id !== id))
  }

  const stats = {
    total: uploadedMaterials.length,
    documents: uploadedMaterials.filter(m => m.type === 'document').length,
    images: uploadedMaterials.filter(m => m.type === 'image').length,
    videos: uploadedMaterials.filter(m => m.type === 'video').length,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Başlık */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Materyal Yükle</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          PDF, PowerPoint, görsel veya video dosyalarınızı yükleyin. Yapay zeka ile otomatik olarak 
          erişilebilir hale getirilir.
        </p>
      </section>

      {/* İstatistikler */}
      {uploadedMaterials.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <File size={24} className="text-primary-600 dark:text-primary-400" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{stats.documents}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Doküman</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Image size={24} className="text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold">{stats.images}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Görsel</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Video size={24} className="text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{stats.videos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Video</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dosya Yükleme */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Upload size={28} />
          Yeni Materyal Yükle
        </h2>
        <FileUploader 
          onUploadComplete={handleFileUpload}
          onUploadStart={() => setIsUploading(true)}
          onUploadEnd={() => setIsUploading(false)}
        />
      </section>

      {/* Desteklenen Formatlar */}
      <section className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-semibold mb-3">Desteklenen Dosya Formatları:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong className="text-blue-600 dark:text-blue-400">📄 Dokümanlar:</strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• PDF (.pdf)</li>
              <li>• PowerPoint (.pptx, .ppt)</li>
              <li>• Word (.docx, .doc)</li>
            </ul>
          </div>
          <div>
            <strong className="text-green-600 dark:text-green-400">🖼️ Görseller:</strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• JPEG (.jpg, .jpeg)</li>
              <li>• PNG (.png)</li>
              <li>• GIF (.gif)</li>
              <li>• WebP (.webp)</li>
            </ul>
          </div>
          <div>
            <strong className="text-purple-600 dark:text-purple-400">🎥 Videolar:</strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• MP4 (.mp4)</li>
              <li>• WebM (.webm)</li>
              <li>• MOV (.mov)</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <strong>AI İşlemleri:</strong> Yüklediğiniz tüm materyaller yapay zeka ile analiz edilir:
          görseller için açıklama, dokümanlar için metin çıkarma ve sesli okuma, videolar için transkript oluşturma.
        </p>
      </section>

      {/* Yüklenen Materyaller */}
      {uploadedMaterials.length > 0 ? (
        <section>
          <h2 className="text-2xl font-bold mb-4">Yüklenen Materyaller ({uploadedMaterials.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadedMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      ) : (
        !isUploading && (
          <section className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Upload size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Henüz materyal yüklemediniz</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yukarıdaki alandan ilk materyalinizi yükleyerek başlayın
            </p>
          </section>
        )
      )}
    </div>
  )
}

export default UploadMaterialPage

