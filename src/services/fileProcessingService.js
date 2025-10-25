import geminiService from './geminiService'

/**
 * Dosya işleme servisi
 * - Görselleri analiz eder
 * - PDF/PPTX'ten metin çıkarır
 * - Video için transkript oluşturur
 */
class FileProcessingService {
  
  /**
   * Görsel dosyasını işler
   * - AI ile görsel analizi
   * - Alt metin üretimi
   */
  async processImage(file) {
    try {
      // Dosyayı base64'e çevir
      const base64 = await this.fileToBase64(file)
      
      // Preview URL oluştur
      const preview = URL.createObjectURL(file)
      
      // Gemini ile görsel açıklaması al
      const description = await geminiService.generateImageAltText(base64)
      
      return {
        preview,
        description,
        processedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Image processing error:', error)
      throw new Error('Görsel işlenirken bir hata oluştu: ' + error.message)
    }
  }

  /**
   * Doküman dosyasını işler (PDF, PPTX, DOCX)
   * - Gemini AI ile direkt dosya analizi
   * - Metin çıkarma
   */
  async processDocument(file) {
    try {
      // Dosyayı base64'e çevir
      const base64 = await this.fileToBase64(file)
      
      // Gemini'ye dosyayı gönder ve analiz et
      const result = await geminiService.analyzeDocument(base64, file.type, file.name)
      
      return {
        extractedText: result.extractedText,
        summary: result.summary,
        wordCount: result.extractedText.split(/\s+/).filter(w => w.length > 0).length,
        processedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Document processing error:', error)
      throw new Error('Doküman işlenirken bir hata oluştu: ' + error.message)
    }
  }

  /**
   * Video dosyasını işler
   * - Video bilgileri
   * - Gemini AI ile Speech-to-Text
   */
  async processVideo(file) {
    try {
      // Video preview oluştur
      const preview = URL.createObjectURL(file)
      
      // Video metadata
      const video = document.createElement('video')
      video.src = preview
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })
      
      const duration = video.duration
      const width = video.videoWidth
      const height = video.videoHeight
      
      // Gemini AI ile ses analizi ve transkript
      let transcriptData = {
        transcript: `Video süresi: ${Math.round(duration)} saniye, çözünürlük: ${width}x${height}. Transkript oluşturuluyor...`,
        summary: '',
        topics: [],
        keyPoints: []
      }

      try {
        transcriptData = await geminiService.videoToText(file)
      } catch (err) {
        console.error('Video transkript hatası:', err)
        transcriptData.transcript = `Video transkripti oluşturulamadı. Video bilgileri: ${Math.round(duration)} saniye, ${width}x${height}`
      }
      
      return {
        preview,
        duration,
        width,
        height,
        transcript: transcriptData.transcript,
        summary: transcriptData.summary,
        topics: transcriptData.topics,
        keyPoints: transcriptData.keyPoints,
        processedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Video processing error:', error)
      throw new Error('Video işlenirken bir hata oluştu: ' + error.message)
    }
  }

  /**
   * Dosyayı Base64'e çevirir
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

}

// Singleton instance
const fileProcessingService = new FileProcessingService()

export default fileProcessingService

