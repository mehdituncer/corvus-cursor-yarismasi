# 🚀 Deployment Rehberi

Bu dokümanda Erişilebilir Akademi projesini farklı platformlara nasıl deploy edeceğinizi bulabilirsiniz.

## Vercel (Önerilen)

Vercel, React uygulamaları için en kolay ve hızlı deployment çözümüdür.

### Adımlar:

1. **Vercel hesabı oluşturun**: [vercel.com](https://vercel.com)

2. **Projeyi GitHub'a push edin**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. **Vercel Dashboard'dan "New Project"** seçin

4. **GitHub repository'nizi import edin**

5. **Environment Variables ekleyin**:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key

6. **Deploy** butonuna tıklayın

✨ Tamamdır! Projeniz birkaç dakika içinde canlıya alınacak.

### CLI ile Deployment:

```bash
# Vercel CLI'yi yükleyin
npm i -g vercel

# Deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

## Netlify

Netlify de popüler bir alternatiftir.

### Adımlar:

1. **Netlify hesabı oluşturun**: [netlify.com](https://netlify.com)

2. **"Add new site" > "Import an existing project"** seçin

3. **GitHub repository'nizi seçin**

4. **Build ayarlarını yapın**:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Environment variables ekleyin**:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key

6. **Deploy** edin

### netlify.toml (Opsiyonel)

Proje root'una `netlify.toml` dosyası ekleyin:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## GitHub Pages

Ücretsiz hosting için GitHub Pages kullanabilirsiniz.

### Adımlar:

1. **package.json'a base ekleyin**:
```json
{
  "name": "erislebilir-akademi",
  "homepage": "https://<username>.github.io/<repo-name>"
}
```

2. **vite.config.js'e base ekleyin**:
```javascript
export default defineConfig({
  base: '/<repo-name>/',
  plugins: [react()],
})
```

3. **gh-pages paketini yükleyin**:
```bash
npm install --save-dev gh-pages
```

4. **package.json'a script ekleyin**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

5. **Deploy edin**:
```bash
npm run deploy
```

## Firebase Hosting

Google'ın hosting hizmeti.

### Adımlar:

1. **Firebase CLI yükleyin**:
```bash
npm install -g firebase-tools
```

2. **Firebase'e login olun**:
```bash
firebase login
```

3. **Firebase projesini initialize edin**:
```bash
firebase init hosting
```

Ayarlar:
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deployment: `No` (şimdilik)

4. **Build edin**:
```bash
npm run build
```

5. **Deploy edin**:
```bash
firebase deploy
```

## Docker ile Deployment

Docker kullanarak her yerde çalışabilir.

### Dockerfile

Proje root'una `Dockerfile` ekleyin:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build ve Run:

```bash
# Docker image build et
docker build -t erislebilir-akademi .

# Container çalıştır
docker run -p 80:80 erislebilir-akademi
```

## Ortam Değişkenleri (Production)

Production'da API anahtarlarını güvenli bir şekilde saklayın:

### Vercel/Netlify:
Dashboard > Settings > Environment Variables

### GitHub Actions Secret:
Repository > Settings > Secrets > Actions

### Firebase:
```bash
firebase functions:config:set gemini.key="YOUR_API_KEY"
```

## Performance Optimizasyonları

Production deployment'tan önce:

1. **Bundle analizi**:
```bash
npm run build
```

2. **Lighthouse testi çalıştırın**:
   - Chrome DevTools > Lighthouse
   - Performance, Accessibility, SEO skorlarını kontrol edin

3. **Erişilebilirlik testi**:
   - NVDA/JAWS ile test edin
   - Klavye navigasyonunu test edin
   - Renk kontrastlarını kontrol edin

## Güvenlik Kontrol Listesi

- ✅ API anahtarları environment variables'da
- ✅ `.env` dosyası `.gitignore`'da
- ✅ HTTPS kullanımı (Vercel/Netlify otomatik sağlar)
- ✅ Content Security Policy headers
- ✅ CORS ayarları kontrol edildi

## İzleme ve Analitik (Opsiyonel)

### Google Analytics

```javascript
// src/main.jsx
import ReactGA from 'react-ga4'

ReactGA.initialize('YOUR_GA_ID')
```

### Sentry (Error Tracking)

```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
})
```

## Yardım

Deployment ile ilgili sorun yaşarsanız:
- Vercel/Netlify build logs'unu kontrol edin
- Browser console'da hata olup olmadığına bakın
- Environment variables'ın doğru ayarlandığından emin olun

---

Başarılı deploymentlar! 🚀

