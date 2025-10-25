# 🎓 Erişilebilir Akademi

Görme ve işitme engelli öğrenciler için tasarlanmış, tamamen erişilebilir dijital eğitim platformu. Modern web teknolojileri ve yapay zeka destekli çözümlerle herkes için kapsayıcı bir öğrenme deneyimi sunar.

## ✨ Özellikler

### 👁️ Görme Engelliler İçin
- ✅ **Ekran Okuyucu Desteği**: JAWS, NVDA, VoiceOver ile tam uyumlu
- ✅ **Ayarlanabilir Yazı Boyutu**: 12px - 24px arası dinamik boyutlandırma
- ✅ **Yüksek Kontrast Modu**: WCAG AA standartlarına uygun
- ✅ **Sesli Okuma (TTS)**: Web Speech API ile metinden sese dönüştürme
- ✅ **Alt Metinler**: Tüm görseller için detaylı açıklamalar
- ✅ **Klavye Navigasyonu**: Fare kullanmadan tam erişim

### 👂 İşitme Engelliler İçin
- ✅ **Video Altyazıları**: Tüm videolar için senkronize alt yazı desteği
- ✅ **Transkriptler**: Ses içeriklerinin metin dökümü
- ✅ **Görsel İçerik**: Infografikler ve görsel materyaller
- ✅ **Görsel Bildirimler**: Ses uyarıları yerine görsel geri bildirim

### 🤖 Yapay Zeka Özellikleri (Gemini AI)
- ✅ **Otomatik Alt Metin**: Görseller için AI destekli açıklama üretimi
- ✅ **İçerik Basitleştirme**: Karmaşık metinleri anlaşılır hale getirme
- ✅ **Otomatik Özet**: Uzun içeriklerden anahtar noktaları çıkarma
- ✅ **Quiz Üretimi**: Ders içeriğinden otomatik soru-cevap oluşturma
- ✅ **Transkript Oluşturma**: Ses/video içeriklerinin metne dönüştürülmesi
- ✅ **Materyal Yükleme**: PDF, PPTX, görsel, video yükleme ve AI ile işleme

### 🎨 Erişilebilirlik Özellikleri
- ✅ **3 Tema Modu**: Aydınlık, Karanlık, Yüksek Kontrast
- ✅ **Semantic HTML**: Doğru etiket hiyerarşisi
- ✅ **ARIA Etiketleri**: Gelişmiş erişilebilirlik desteği
- ✅ **Skip Links**: İçeriğe hızlı atlama
- ✅ **Animasyon Kontrolü**: Hareket hassasiyeti olan kullanıcılar için

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Google Gemini API anahtarı

### Adım Adım Kurulum

1. **Projeyi Klonlayın**
```bash
git clone <repository-url>
cd cursor-yarisma
```

2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

3. **Ortam Değişkenlerini Ayarlayın**

`.env` dosyası oluşturun:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve Gemini API anahtarınızı ekleyin:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> **Not**: Gemini API anahtarı almak için [Google AI Studio](https://makersuite.google.com/app/apikey) adresini ziyaret edin.

4. **Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📦 Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Lint kontrolü
npm run lint
```

## 🏗️ Proje Yapısı

```
cursor-yarisma/
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── common/         # Ortak bileşenler (Button, SkipLink)
│   │   ├── accessibility/  # Erişilebilirlik bileşenleri
│   │   ├── course/         # Ders ile ilgili bileşenler
│   │   ├── upload/         # Materyal yükleme bileşenleri
│   │   └── Layout/         # Layout bileşenleri
│   ├── contexts/           # React Context'ler
│   │   ├── ThemeContext.jsx
│   │   └── AccessibilityContext.jsx
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── HomePage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── CourseDetailPage.jsx
│   │   ├── UploadMaterialPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── AccessibilityPage.jsx
│   ├── services/           # API servisleri
│   │   ├── geminiService.js
│   │   └── fileProcessingService.js
│   ├── App.jsx            # Ana uygulama bileşeni
│   ├── main.jsx           # Giriş noktası
│   └── index.css          # Global stiller
├── public/                # Statik dosyalar
├── index.html            # HTML şablonu
├── package.json          # Proje bağımlılıkları
├── vite.config.js        # Vite yapılandırması
├── tailwind.config.js    # Tailwind CSS yapılandırması
└── README.md             # Bu dosya
```

## 🎯 Kullanım

### Erişilebilirlik Paneli
Sağ üst köşedeki "Erişilebilirlik" butonuna tıklayarak:
- Yazı boyutunu ayarlayın
- Tema değiştirin (Aydınlık/Karanlık/Yüksek Kontrast)
- Sesli okumayı açın/kapatın
- Animasyonları azaltın

### Klavye Kısayolları
- `Tab` - Sonraki elemana git
- `Shift + Tab` - Önceki elemana git
- `Enter` veya `Space` - Aktif et
- `Esc` - Modalları kapat

### Ders İçeriği Özellikleri
Bir ders sayfasında:
- **İçerik** sekmesi: Ders metnini okuyun ve sesli okuma özelliğini kullanın
- **Video** sekmesi: Altyazılı video izleyin
- **Basitleştir** sekmesi: AI ile içeriği daha anlaşılır hale getirin
- **Test** sekmesi: AI tarafından oluşturulan sorularla pratik yapın

## 🛠️ Teknolojiler

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Accessibility**: WCAG 2.1 AA

## ♿ Erişilebilirlik Standartları

Bu proje **WCAG 2.1 Level AA** standartlarına uygun olarak geliştirilmiştir:

- ✅ Algılanabilir (Perceivable)
- ✅ İşletilebilir (Operable)
- ✅ Anlaşılabilir (Understandable)
- ✅ Sağlam (Robust)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Erişilebilirlik Testleri

Katkıda bulunurken lütfen:
- Ekran okuyucu ile test edin (NVDA önerilir, ücretsiz)
- Sadece klavye ile navigasyon test edin
- Renk kontrast oranlarını kontrol edin
- ESLint jsx-a11y kurallarına uyun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

- **E-posta**: info@erisilebilirakademi.com
- **Erişilebilirlik Sorunları**: erisilebilirlik@erisilebilirakademi.com

## 🙏 Teşekkürler

Bu proje, eğitimde fırsat eşitliği için geliştirilmiştir. Görme ve işitme engelli bireylerin eğitime eşit erişimini sağlamak için teknolojinin gücünü kullanıyoruz.

---

**Not**: Bu bir eğitim projesidir ve sürekli geliştirilmektedir. Önerileriniz ve geri bildirimleriniz bizim için çok değerlidir.

