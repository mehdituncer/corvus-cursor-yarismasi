import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenAI } from '@google/genai'

class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Gemini API key bulunamadı. Lütfen .env dosyasını kontrol edin.')
      this.genAI = null
      this.genAINew = null
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.genAINew = new GoogleGenAI({ apiKey }) // Yeni SDK (TTS için)
    }
  }

  /**
   * Görseller için otomatik alt metin üretir
   * @param {File|string} image - Resim dosyası veya base64 string
   * @returns {Promise<string>} Alt metin
   */
  async generateImageAltText(imageBase64) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Bu görseli detaylı bir şekilde tanımla. Görme engelli bir kullanıcının görseli anlaması için kapsamlı bir açıklama yaz. Görseldeki nesneleri, renkleri, kişileri ve genel atmosferi tanımla. Türkçe olarak yanıt ver.`

      const imageParts = [
        {
          inlineData: {
            data: imageBase64.split(',')[1] || imageBase64,
            mimeType: 'image/jpeg',
          },
        },
      ]

      const result = await model.generateContent([prompt, ...imageParts])
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Alt metin üretilirken hata:', error)
      throw error
    }
  }

  /**
   * Doküman dosyalarını (PDF, PPTX, DOCX) analiz eder
   * @param {string} fileBase64 - Dosyanın base64 formatı
   * @param {string} mimeType - Dosya MIME tipi
   * @param {string} fileName - Dosya adı
   * @returns {Promise<Object>} Çıkarılan metin ve özet
   */
  async analyzeDocument(fileBase64, mimeType, fileName) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      // MIME type'a göre uygun format belirle
      let fileMimeType = mimeType
      if (mimeType.includes('pdf')) {
        fileMimeType = 'application/pdf'
      } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
        fileMimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        fileMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }

      const prompt = `Sen bir uzmansın ve bu dokümanı (${fileName}) bir öğrenciye öğreteceksin. 

GÖREVIN - Detaylı Öğretici Anlatım:

📚 KONUYU BAŞTAN SONA ÖĞRET:
- Dokümanın ana konusunu giriş yaparak açıkla
- Her önemli başlığı ve bölümü ayrı ayrı detaylı anlat
- Kavramları açıklarken örnekler ver
- Karmaşık terimleri basit dille açıkla
- Konular arasındaki bağlantıları kur
- Neden-sonuç ilişkilerini açıkla

🎯 ÖĞRETİM PRENSİPLERİ:
- Pedagojik (öğretici) bir dil kullan
- "Şimdi şunu anlatalım..." gibi öğretmen üslubu
- Her kavramı öğrenci kafasında canlandır
- Adım adım, mantıklı sırayla anlat
- Görme engelli öğrencinin tam olarak anlayabileceği açıklıkta

⚠️ ÖNEMLİ KURALLAR:
- Dokümanın metnini birebir KOPYALAMA
- Kendi cümlelerinle, kendi üslubunla öğret
- Detaylı ol, kısa geçme
- Her bölümü derinlemesine işle
- Öğrenci "Anladım!" diyecek kadar net ol

Lütfen yanıtını şu JSON formatında ver (sadece JSON, başka açıklama ekleme):
{
  "content": "Detaylı öğretici anlatım - En az 5-6 paragraf, her konuyu derinlemesine işle. Öğretmen gibi anlat, örnekler ver, açıkla, öğret.",
  "summary": "Kısa özet (2-3 cümle)",
  "mainTopics": ["Ana Konu 1", "Ana Konu 2", "Ana Konu 3", "..."],
  "keyPoints": ["Önemli kavram/nokta 1", "Önemli kavram/nokta 2", "Önemli kavram/nokta 3", "..."]
}

Türkçe yanıt ver. Detaylı ve öğretici ol - bu bir ders anlatımı!`

      const fileParts = [
        {
          inlineData: {
            data: fileBase64.split(',')[1] || fileBase64,
            mimeType: fileMimeType,
          },
        },
      ]

      const result = await model.generateContent([prompt, ...fileParts])
      const response = await result.response
      const responseText = response.text()
      
      // JSON'u parse et
      try {
        const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(jsonText)
        
        // Ana içerik oluştur - konuyu açıklayan metin
        let fullContent = parsed.content || ''
        
        // Ana konular varsa ekle
        if (parsed.mainTopics && parsed.mainTopics.length > 0) {
          fullContent += '\n\n📚 ANA KONULAR:\n'
          parsed.mainTopics.forEach((topic, index) => {
            fullContent += `${index + 1}. ${topic}\n`
          })
        }
        
        // Önemli noktalar varsa ekle
        if (parsed.keyPoints && parsed.keyPoints.length > 0) {
          fullContent += '\n\n💡 ÖNEMLİ NOKTALAR:\n'
          parsed.keyPoints.forEach((point, index) => {
            fullContent += `• ${point}\n`
          })
        }
        
        return {
          extractedText: fullContent,
          summary: parsed.summary || 'Özet oluşturulamadı',
          mainTopics: parsed.mainTopics || [],
          keyPoints: parsed.keyPoints || []
        }
      } catch (parseError) {
        // JSON parse edilemezse, yanıtı olduğu gibi kullan
        console.warn('JSON parse hatası, ham metin kullanılıyor:', parseError)
        return {
          extractedText: responseText,
          summary: responseText.substring(0, 300) + '...',
          mainTopics: [],
          keyPoints: []
        }
      }
    } catch (error) {
      console.error('Doküman analiz hatası:', error)
      throw error
    }
  }

  /**
   * Metni basitleştirir ve daha anlaşılır hale getirir
   * @param {string} text - Basitleştirilecek metin
   * @returns {Promise<string>} Basitleştirilmiş metin
   */
  async simplifyText(text) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Aşağıdaki metni daha basit ve anlaşılır bir dille yeniden yaz. Karmaşık terimleri açıkla ve cümleleri kısalt. Ancak önemli bilgileri kaybetme:

${text}

Basitleştirilmiş metin (sadece metni ver, başka açıklama ekleme):`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Metin basitleştirilirken hata:', error)
      throw error
    }
  }

  /**
   * Uzun metinlerin özetini çıkarır
   * @param {string} text - Özetlenecek metin
   * @returns {Promise<string>} Özet metin
   */
  async summarizeText(text) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Aşağıdaki metni özetle. Ana noktaları ve önemli bilgileri koru:

${text}

Özet (sadece özeti ver, başka açıklama ekleme):`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Metin özetlenirken hata:', error)
      throw error
    }
  }

  /**
   * Metinden soru-cevap çiftleri üretir
   * @param {string} text - Kaynak metin
   * @param {number} count - Üretilecek soru sayısı
   * @returns {Promise<Array>} Soru-cevap çiftleri
   */
  async generateQuestions(text, count = 5) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Aşağıdaki metne dayanarak ${count} adet çoktan seçmeli soru üret. Her soru için 4 seçenek ve doğru cevabı belirt. JSON formatında yanıt ver:

${text}

Format:
[
  {
    "question": "Soru metni",
    "options": ["A", "B", "C", "D"],
    "correct": 0
  }
]

Sadece JSON yanıtı ver, başka açıklama ekleme:`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const jsonText = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(jsonText)
    } catch (error) {
      console.error('Sorular üretilirken hata:', error)
      throw error
    }
  }

  /**
   * Video/ses dosyasının transkripsiyonunu oluşturur
   * @param {string} audioText - Ses metni (bu örnekte metin olarak)
   * @returns {Promise<string>} Transkript
   */
  async generateTranscript(audioText) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Aşağıdaki konuşma metnini düzenli bir transkript haline getir. Noktalama işaretleri ekle ve paragrafla:

${audioText}

Transkript:`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Transkript oluşturulurken hata:', error)
      throw error
    }
  }

  /**
   * Metin için işaret dili açıklaması üretir
   * @param {string} text - Açıklanacak metin
   * @returns {Promise<string>} İşaret dili açıklaması
   */
  async generateSignLanguageDescription(text) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Aşağıdaki metni işaret dili ile nasıl anlatılabileceğini açıkla. Önemli hareketleri ve işaretleri tanımla:

${text}

İşaret dili açıklaması:`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('İşaret dili açıklaması oluşturulurken hata:', error)
      throw error
    }
  }

  /**
   * Metni Gemini TTS ile sese çevirir (Yeni SDK)
   * @param {string} text - Seslendirilecek metin
   * @param {string} voiceName - Ses adı (Aoede, Charon, Fenrir, Kore, Puck, Zephyr)
   * @returns {Promise<Blob>} Ses dosyası blob'u
   */
  async textToSpeech(text, voiceName = 'Aoede') {
    if (!this.genAINew) {
      console.warn('Yeni Gemini SDK mevcut değil, fallback kullanılıyor')
      return this.fallbackTTS(text)
    }

    try {
      // Metni uygun uzunlukta parçala (TTS limitleri için)
      const maxLength = 5000
      let textToSpeak = text
      if (text.length > maxLength) {
        textToSpeak = text.substring(0, maxLength) + '...'
      }

      const model = 'gemini-2.5-flash-native-audio-dialog'
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: textToSpeak,
            },
          ],
        },
      ]

      const config = {
        temperature: 1,
        responseModalities: ['audio'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName, // Seçilen ses
            },
          },
        },
      }

      // Stream audio chunks
      const audioChunks = []
      
      const response = await this.genAINew.models.generateContentStream({
        model,
        config,
        contents,
      })

      for await (const chunk of response) {
        if (
          chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
        ) {
          const audioData = chunk.candidates[0].content.parts[0].inlineData.data
          const mimeType = chunk.candidates[0].content.parts[0].inlineData.mimeType
          
          // Base64'ten binary'ye çevir
          const byteCharacters = atob(audioData)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          audioChunks.push(byteArray)
        }
      }

      if (audioChunks.length === 0) {
        throw new Error('Ses verisi oluşturulamadı')
      }

      // Tüm chunk'ları birleştir
      const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const combinedArray = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of audioChunks) {
        combinedArray.set(chunk, offset)
        offset += chunk.length
      }

      // WAV formatına çevir
      const wavData = this.convertToWav(combinedArray)
      return new Blob([wavData], { type: 'audio/wav' })
      
    } catch (error) {
      console.error('TTS hatası:', error)
      console.warn('Fallback TTS kullanılıyor')
      return this.fallbackTTS(text)
    }
  }

  /**
   * Raw audio data'yı WAV formatına çevirir
   * @param {Uint8Array} audioData - Ham audio verisi
   * @returns {Uint8Array} WAV formatında audio
   */
  convertToWav(audioData) {
    const sampleRate = 24000 // Gemini TTS default
    const numChannels = 1
    const bitsPerSample = 16
    const dataSize = audioData.length
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8)
    const blockAlign = numChannels * (bitsPerSample / 8)
    const chunkSize = 36 + dataSize

    // WAV header oluştur
    const header = new ArrayBuffer(44)
    const view = new DataView(header)

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, chunkSize, true)
    this.writeString(view, 8, 'WAVE')

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // Subchunk1Size
    view.setUint16(20, 1, true) // AudioFormat (PCM)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitsPerSample, true)

    // data sub-chunk
    this.writeString(view, 36, 'data')
    view.setUint32(40, dataSize, true)

    // Header + data'yı birleştir
    const wavArray = new Uint8Array(header.byteLength + audioData.length)
    wavArray.set(new Uint8Array(header), 0)
    wavArray.set(audioData, header.byteLength)

    return wavArray
  }

  /**
   * DataView'a string yazar
   */
  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  /**
   * Fallback TTS (Web Speech API)
   * @param {string} text - Seslendirilecek metin
   * @returns {Promise<null>} Web Speech API kullanır, blob döndürmez
   */
  async fallbackTTS(text) {
    if (!('speechSynthesis' in window)) {
      throw new Error('Tarayıcınız sesli okuma özelliğini desteklemiyor')
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'tr-TR'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => resolve(null)
      utterance.onerror = (error) => reject(error)

      window.speechSynthesis.speak(utterance)
    })
  }

  /**
   * Video dosyasından sesi çıkarıp metne çevirir (Speech-to-Text)
   * @param {File} videoFile - Video dosyası
   * @returns {Promise<Object>} Transkript ve özet
   */
  async videoToText(videoFile) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      // Video dosyasını base64'e çevir
      const base64 = await this.fileToBase64(videoFile)
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Bu videodaki konuşmaları dinle ve detaylı bir transkript oluştur.

GÖREVIN:
- Videodaki tüm konuşmaları kelimesi kelimesine metne çevir
- Her cümleyi yeni satıra yaz
- Mümkünse zaman aralıkları belirt (örn: [0:00-0:15])
- Net, okunabilir format kullan
- Konuşmacı değişirse belirt (Konuşmacı 1:, Konuşmacı 2:)

FORMAT:
[Zaman] Konuşma metni...
[Zaman] Devam eden konuşma...

Sadece transkripti ver, JSON veya başka format kullanma. Düz metin olarak transkript yaz.
Türkçe yanıt ver.`

      const videoParts = [
        {
          inlineData: {
            data: base64.split(',')[1] || base64,
            mimeType: videoFile.type || 'video/mp4',
          },
        },
      ]

      const result = await model.generateContent([prompt, ...videoParts])
      const response = await result.response
      const transcript = response.text()
      
      // Özet için kısa bir özet oluştur
      let summary = ''
      try {
        const summaryPrompt = `Aşağıdaki video transkripsiyonunu 2-3 cümleyle özetle:

${transcript}

Kısa özet (sadece özeti ver):`
        
        const summaryResult = await model.generateContent(summaryPrompt)
        const summaryResponse = await summaryResult.response
        summary = summaryResponse.text()
      } catch (err) {
        console.warn('Özet oluşturulamadı:', err)
        summary = transcript.substring(0, 200) + '...'
      }
      
      return {
        transcript: transcript,
        summary: summary,
        topics: [],
        keyPoints: []
      }
    } catch (error) {
      console.error('Video transkript hatası:', error)
      throw error
    }
  }

  /**
   * YouTube videosunu analiz eder ve transkript oluşturur
   * @param {string} videoUrl - YouTube video URL'i
   * @returns {Promise<Object>} Transkript ve özet
   */
  async analyzeYouTubeVideo(videoUrl) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Bu YouTube videosunu analiz et: ${videoUrl}

GÖREVIN:
- Videodaki konuşmaları dinle ve metne çevir
- Detaylı bir transkript oluştur
- Mümkünse zaman damgaları ekle [0:00-0:15]
- Konuşmacı varsa belirt
- Anlaşılır, düz metin formatında yaz

FORMAT (düz metin):
[Zaman] Konuşma metni burada...
[Zaman] Devam eden konuşma...

JSON kullanma, sadece düz metin transkript ver.
Türkçe yanıt ver.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const transcript = response.text()
      
      // Özet oluştur
      let summary = ''
      try {
        const summaryResult = await this.summarizeText(transcript.substring(0, 3000))
        summary = summaryResult
      } catch (err) {
        console.warn('Özet oluşturulamadı:', err)
        summary = transcript.substring(0, 200) + '...'
      }
      
      return {
        transcript: transcript,
        summary: summary
      }
    } catch (error) {
      console.error('YouTube video analiz hatası:', error)
      
      // Hata mesajını kullanıcı dostu yap
      if (error.message?.includes('429')) {
        throw new Error('API limiti aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.')
      } else if (error.message?.includes('quota')) {
        throw new Error('Günlük API kotası doldu. Yarın tekrar deneyin.')
      } else {
        throw new Error('Video analiz edilemedi. Video çok uzun olabilir veya API erişimi sınırlı olabilir.')
      }
    }
  }

  /**
   * Chatbot ile sohbet et
   * @param {string} userMessage - Kullanıcı mesajı
   * @param {Array} chatHistory - Önceki mesajlar
   * @returns {Promise<string>} AI cevabı
   */
  async chatWithBot(userMessage, chatHistory = []) {
    if (!this.genAI) {
      throw new Error('Gemini API yapılandırılmamış')
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      // Sistem promptu - Chatbot'un rolü ve bilgisi
      const systemContext = `Sen Erişilebilir Akademi'nin yardımcı asistanısın. Görme ve işitme engelli öğrenciler için tasarlanmış bu platformun özelliklerini açıklıyorsun.

PLATFORM ÖZELLİKLERİ:

👁️ GÖRME ENGELLİLER İÇİN:
- Ekran okuyucu desteği (JAWS, NVDA, VoiceOver)
- Yazı boyutu kontrolü (12-24px)
- Yüksek kontrast modu
- Gemini AI ile sesli okuma (6 farklı ses)
- Tüm görseller için AI açıklaması
- Klavye ile tam navigasyon

👂 İŞİTME ENGELLİLER İÇİN:
- Video altyazıları
- Otomatik transkript (AI ile)
- Görsel bildirimler
- İnfografik ve görsel materyaller

🤖 AI ÖZELLİKLERİ:
- Görsel analizi ve alt metin
- PDF/PPTX analizi ve öğretici anlatım
- Video Speech-to-Text (konuşma → metin)
- İçerik basitleştirme ve özet
- Otomatik quiz üretimi
- Gemini TTS ile profesyonel sesli okuma

📤 MATERYAL YÜKLEME:
- PDF, PowerPoint, Word dosyaları
- Görseller (JPG, PNG, GIF, WebP)
- Videolar (MP4, WebM, MOV)
- AI ile otomatik analiz ve erişilebilir hale getirme

🎨 TEMAlar:
- Aydınlık tema
- Karanlık tema
- Yüksek kontrast modu

GÖREVIN:
- Dostça ve yardımsever ol
- Kısa ve öz cevaplar ver
- Emoji kullan ama abartma
- Örnekler ver
- Görme/işitme engelli kullanıcılar için empati göster
- Platform özelliklerini net açıkla

Türkçe yanıt ver.`

      // Chat history'yi Gemini formatına çevir
      const history = chatHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))

      // Chat session başlat
      const chat = model.startChat({
        history: history,
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          maxOutputTokens: 500,
        },
      })

      const result = await chat.sendMessage(systemContext + '\n\nKullanıcı sorusu: ' + userMessage)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Chatbot hatası:', error)
      throw error
    }
  }

  /**
   * Base64'e çevirme (dosyalar için)
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

// Singleton instance
const geminiService = new GeminiService()

export default geminiService
