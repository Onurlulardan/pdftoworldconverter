# PDF to Word Converter Web Uygulaması

Bu proje, PDF dosyalarını Word (.docx) formatına dönüştüren kullanıcı dostu bir web uygulamasıdır. Node.js ve Express.js kullanılarak geliştirilmiştir.

## Özellikler

- Modern ve kullanıcı dostu web arayüzü
- Sürükle-bırak dosya yükleme desteği
- PDF dosyalarını sayfa sayfa Word formatına dönüştürme
- Otomatik dosya indirme
- İlerleme durumu gösterimi
- Hata yönetimi ve kullanıcı bildirimleri

## Teknolojiler

- **Backend:**
  - Node.js
  - Express.js
  - pdf-parse (PDF okuma)
  - docx (Word dosyası oluşturma)
  - multer (Dosya yükleme)

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap 5
  - EJS (Template Engine)

## Proje Yapısı

```
pdf-to-word/
├── app.js              # Ana uygulama dosyası
├── converter.js        # PDF'den Word'e dönüştürme mantığı
├── views/
│   └── index.ejs      # Ana sayfa template'i
├── uploads/           # Geçici PDF dosyaları
└── output/            # Oluşturulan Word dosyaları
```

## Nasıl Çalışır?

1. Kullanıcı web arayüzünden bir PDF dosyası seçer veya sürükler
2. Dosya sunucuya yüklenir ve geçici olarak `uploads` klasöründe saklanır
3. PDF dosyası okunur ve içeriği sayfalara ayrılır
4. Her sayfa için Word dökümanında yeni bir sayfa oluşturulur
5. Oluşturulan Word dosyası `output` klasörüne kaydedilir
6. Dosya kullanıcıya otomatik olarak indirilir
7. Geçici dosyalar temizlenir

## Kurulum

1. Projeyi klonlayın
2. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```
3. Uygulamayı başlatın:
   ```bash
   node app.js
   ```
4. Tarayıcıda `http://localhost:3000` adresine gidin

## Güvenlik

- Sadece PDF dosyalarının yüklenmesine izin verilir
- Yüklenen dosyalar işlem sonrası otomatik silinir
- Geçici dosyalar için ayrı klasörler kullanılır

## Notlar

- Büyük PDF dosyaları için dönüştürme işlemi biraz zaman alabilir
- Dönüştürme işlemi PDF'in sayfa yapısını korumaya çalışır
- Her sayfa ayrı bir Word sayfası olarak oluşturulur
