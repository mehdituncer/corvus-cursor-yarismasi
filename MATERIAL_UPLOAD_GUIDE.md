# 📤 Materyal Yükleme Özelliği Rehberi

## Genel Bakış

Erişilebilir Akademi, kullanıcıların kendi eğitim materyallerini yükleyip AI ile otomatik olarak erişilebilir hale getirmelerini sağlar.

## Desteklenen Dosya Formatları

### 📄 Dokümanlar
- **PDF** (.pdf) - Metin çıkarma, özet oluşturma, sesli okuma
- **PowerPoint** (.pptx, .ppt) - Slayt içeriği çıkarma, metin analizi
- **Word** (.docx, .doc) - Metin çıkarma, yapılandırma

### 🖼️ Görseller
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)

**AI İşlemleri:**
- Otomatik görsel açıklaması (alt metin)
- Görsel içeriğinin detaylı tanımı
- Ekran okuyucu uyumlu açıklamalar

### 🎥 Videolar
- **MP4** (.mp4)
- **WebM** (.webm)
- **MOV** (.mov)

**AI İşlemleri:**
- Video metadata çıkarma
- Transkript oluşturma (gelecek güncellemelerde)
- Alt yazı üretimi

## Özellikler

### 1. Drag & Drop Yükleme
```javascript
// Kullanıcılar dosyaları sürükleyip bırakabilir
// Veya tıklayarak dosya seçebilir
```

### 2. Çoklu Dosya Desteği
- Birden fazla dosya aynı anda yüklenebilir
- Her dosya bağımsız olarak işlenir
- İlerleme göstergesi ile takip

### 3. AI ile Otomatik İşleme

#### Görseller için:
```javascript
// Gemini Vision API kullanılarak:
- Görsel içeriğinin detaylı açıklaması
- Alt metin üretimi
- Görsel içindeki nesnelerin tanımlanması
```

#### Dokümanlar için:
```javascript
// Metin çıkarma ve analiz:
- PDF/PPTX/DOCX'ten metin çıkarma
- AI ile özet oluşturma
- Kelime sayısı hesaplama
- Sesli okuma için hazırlama
```

#### Videolar için:
```javascript
// Video analizi:
- Süre, çözünürlük gibi metadata
- Transkript oluşturma (gelecek)
- Alt yazı üretimi (gelecek)
```

## Kullanım

### 1. Materyal Yükleme Sayfasına Git
```
http://localhost:3000/materyal-yukle
```

### 2. Dosya Yükle
- Dosyayı sürükle-bırak alanına bırak
- Veya "Dosya Seç" butonuna tıkla
- Birden fazla dosya seçilebilir

### 3. İşleme Süreci
1. Dosya yüklenir
2. AI analizi başlar
3. İlerleme çubuğu ile takip
4. Sonuç gösterilir

### 4. Yüklenen Materyalleri Kullan
- Görseller: Açıklama, önizleme
- Dokümanlar: Metin, özet, sesli okuma
- Videolar: Oynatıcı, transkript

## Teknik Detaylar

### FileUploader Bileşeni
```jsx
<FileUploader
  onUploadComplete={(material) => {
    // Yükleme tamamlandığında
  }}
  onUploadStart={() => {
    // Yükleme başladığında
  }}
  onUploadEnd={() => {
    // Tüm işlemler bittiğinde
  }}
/>
```

### Dosya İşleme Servisi
```javascript
// fileProcessingService.js

// Görsel işleme
processImage(file) -> {
  preview: URL,
  description: string,
  processedAt: timestamp
}

// Doküman işleme
processDocument(file) -> {
  extractedText: string,
  summary: string,
  wordCount: number,
  processedAt: timestamp
}

// Video işleme
processVideo(file) -> {
  preview: URL,
  duration: number,
  width: number,
  height: number,
  transcript: string,
  processedAt: timestamp
}
```

### Material Card Bileşeni
```jsx
<MaterialCard
  material={materialData}
  onDelete={(id) => {
    // Materyal silme
  }}
/>
```

## Gemini API Kullanımı

### Görsel Analizi
```javascript
geminiService.generateImageAltText(base64Image)
// Returns: Detaylı görsel açıklaması
```

### Metin İşleme
```javascript
geminiService.summarizeText(text)
// Returns: Metnin özeti
```

## Gelecek Geliştirmeler

### Kısa Vadede:
- [ ] Gerçek PDF metin çıkarma (pdf.js entegrasyonu)
- [ ] PPTX içerik okuma (backend API)
- [ ] DOCX içerik okuma (mammoth.js)

### Orta Vadede:
- [ ] Video ses çıkarma
- [ ] Speech-to-text entegrasyonu
- [ ] Otomatik alt yazı senkronizasyonu
- [ ] OCR desteği (el yazısı tanıma)

### Uzun Vadede:
- [ ] Materyal koleksiyonları
- [ ] Paylaşım özellikleri
- [ ] İşbirlikçi düzenleme
- [ ] Versiyon kontrolü
- [ ] Cloud storage entegrasyonu

## Performans Optimizasyonu

### Dosya Boyutu Limitleri
```javascript
const limits = {
  image: 10 * 1024 * 1024,    // 10 MB
  document: 20 * 1024 * 1024,  // 20 MB
  video: 100 * 1024 * 1024     // 100 MB
}
```

### Önbellekleme
- İşlenmiş materyaller localStorage'da saklanabilir
- Tekrar yüklemeden önizleme

### Sıkıştırma
- Görseller otomatik sıkıştırılabilir
- Video transcoding (gelecek)

## Güvenlik

### Dosya Validasyonu
```javascript
// MIME type kontrolü
// Dosya boyutu kontrolü
// Kötü amaçlı içerik taraması (gelecek)
```

### API Key Güvenliği
```javascript
// .env dosyasında saklanır
// Production'da backend proxy kullanılmalı
```

## Erişilebilirlik Özellikleri

### Görme Engelliler için:
- ✅ Ekran okuyucu uyumlu
- ✅ Klavye navigasyonu
- ✅ ARIA etiketleri
- ✅ İlerleme duyuruları

### İşitme Engelliler için:
- ✅ Görsel geri bildirimler
- ✅ İlerleme göstergeleri
- ✅ Durum bildirileri

## Troubleshooting

### Gemini API Hatası
```
Error: Gemini API yapılandırılmamış
Çözüm: .env dosyasında VITE_GEMINI_API_KEY'i kontrol edin
```

### Dosya İşleme Hatası
```
Error: Dosyadan metin çıkarılamadı
Çözüm: Dosya formatının desteklendiğinden emin olun
```

### CORS Hatası
```
Error: Network request failed
Çözüm: Backend proxy kullanın veya Gemini API ayarlarını kontrol edin
```

## Örnek Kullanım

```jsx
// UploadMaterialPage.jsx'de
const [materials, setMaterials] = useState([])

const handleUpload = (newMaterial) => {
  setMaterials([newMaterial, ...materials])
  
  // LocalStorage'a kaydet
  localStorage.setItem('materials', JSON.stringify(materials))
}

// Sesli okuma
const handleSpeak = (material) => {
  if (material.extractedText) {
    speak(material.extractedText)
  }
}
```

## Test Senaryoları

### 1. Görsel Yükleme
- [ ] JPEG görsel yükle
- [ ] AI açıklaması kontrol et
- [ ] Sesli okumayı test et

### 2. PDF Yükleme
- [ ] PDF doküman yükle
- [ ] Metin çıkarımını kontrol et
- [ ] Özet üretimini test et

### 3. Video Yükleme
- [ ] MP4 video yükle
- [ ] Metadata'yı kontrol et
- [ ] Oynatıcıyı test et

---

Bu özellik, platformu daha esnek ve kullanıcı odaklı hale getiriyor. Kullanıcılar artık kendi materyallerini yükleyip AI ile otomatik olarak erişilebilir hale getirebiliyorlar! 🎉

