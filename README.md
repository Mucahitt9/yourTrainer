# 💪 YourTrainer – PT Üye Kayıt Sistemi

Bu proje, kişisel antrenörlerin üyelerini kolayca yönetebilmesi için hazırlanmış basit ama işlevsel bir sistemdir. React, Vite ve TailwindCSS kullanılarak geliştirildi.

## Özellikler

### Giriş Sistemi
- PT giriş ekranı (şimdilik basit bir login)
- Oturum sonrası yönlendirme
- Tüm cihazlarda uyumlu görünüm

### Üye Kayıt Süreci
Üye kayıt ekranı 3 adımdan oluşur:
1. **Temel Bilgiler:** Ad-soyad, ders sayısı, ders ücreti gibi alanlar
2. **Vücut Ölçüleri:** Boy, kilo, kol, omuz vs.
3. **Önizleme:** Girilen tüm bilgiler özetlenir ve onaylanır

> Kayıt sırasında otomatik olarak toplam ücret ve tahmini bitiş tarihi hesaplanır.

### Üye Listesi
- Kayıtlı üyeleri tablo halinde gösterir
- Detay sayfası ile üyeye ait bilgileri görüntüleyebilirsin
- Üye bilgilerini düzenleyebilir, silebilirsin
- Arama ve filtreleme desteği var

### PT Profil Sayfası
- Antrenör bilgilerini güncelleyebilir
- Profil fotoğrafı eklenebilir
- Ders ücreti ve uzmanlık alanı tanımlanabilir

### Bildirim Sistemi (Toast)
- Başarı, hata, bilgi, uyarı gibi 4 farklı türde toast mesajı
- Zaman çubuğu, üst üste bildirimler, mobil uyum ve erişilebilirlik desteği

## Kullanılan Teknolojiler
- React 18
- Vite 5
- TailwindCSS 3
- React Router
- Context API
- Lucide Icons
- LocalStorage (şimdilik backend yok)

## Kurulum

> Aşağıdaki adımları takip ederek projeyi çalıştırabilirsin:

```bash
**git clone https://github.com/Mucahitt9/yourTrainer.git
cd yourTrainer
npm install
npm run dev
Demo Hesap
Test için kullanabileceğin bir demo hesap var:

Kullanıcı adı: admin

Şifre: admin123

Tasarım Notları
Mobil öncelikli (responsive)

Inter fontu kullanıldı (Google Fonts)

Renkler: Indigo/Mavi ağırlıklı, success-green, error-red, info-blue, warning-yellow

Klasör Yapısı (Özet)
cpp
Kopyala
Düzenle
src/
├── components/          // Ortak bileşenler
│   ├── client-form/     // Üye kayıt adımları
│   └── Navbar, Layout, Modals
├── pages/               // Tüm sayfalar (Login, Profil, Üye listesi vs.)
├── utils/               // Context, helper fonksiyonlar
└── styles/              // Global CSS
Planlanan Geliştirmeler
Takvim entegrasyonu (haftalık ders programı için)

Gerçek veritabanı bağlantısı

Ödeme takibi

Dashboard & analiz ekranları

Bildirim sistemi (push notification)

Katkıda Bulunmak İstersen
Projeyi fork'la, bir branch oluştur, geliştir ve PR aç. Yardımcı olursan süper olur 🙌

Lisans
MIT

👨‍💻 Geliştirici: @Mucahitt9

Eğer proje işine yaradıysa bir ⭐ bırakman yeterli, moral olur :)

yaml
Kopyala
Düzenle
