<p align="center">
<img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
width="300" height="300">
</p>

<h3 align="center">Kütüphane Yönetim Sistemi</h3>



# 📖 İçindekiler
- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Klasör Yapısı](#klasör-yapısı)
- [Veritabanı Şeması](#veritabanı-şeması)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Ekip Üyeleri](#ekip-üyeleri)

# Genel Bakış
**Kütüphane Uygulaması**, TypeScript ile yazılmış bir front-end ve C# (.NET) ile geliştirilmiş bir back-end içeren full-stack bir kütüphane yönetim uygulamasıdır. Kitaplar üzerinde CRUD işlemleri, ödünç alma/geri verme, kullanıcı yönetimi ve listeleme gibi temel kütüphane fonksiyonlarını sağlar.



# Özellikler
## Login/Register Paneli
- 📝 İsim-soyisim, e-mail, telefon numarası, doğum tarihi ile kayıt
- 🔒 Güvenli şifre belirleme
- 🚪 E-mail ve şifre ile kolay giriş
## Kullanıcı Paneli
- 🔍 Kitap arama
- 👁️ Kitap detaylarını görme 
- 📚 Kitap listeleme, filtreleme 
- 🔄 Kitap ödünç alma ve iade etme
- 📜 Aktif kitaplar,geçmiş kitaplar,ödenmemiş cezalar, ceza geçmişi görüntüleme

## Admin Paneli
- 🛠️  Kitapları görüntüleme, ekleme, düzenleme, silme
- 👮  Üyeleri görüntüleme, ceza atama
- 📜  Aktif ödünç, geçmiş işlem gecikmiş iade görüntüleme
- 📍 Salon, raf ekleme
- 🏷️ Kitap kategorisi ekleme
- 🏢 Yayınevi ekleme,düzenleme, silme
- ✍️ Yazar ekleme, düzenleme, silme
  

# Teknolojiler

## **Back-end**
- **Framework:** ASP.NET Core (.NET 8)
- **ORM:** Entity Framework Core (SQL Server)
- **Kimlik Doğrulama:** ASP.NET Identity + JWT Bearer Authentication
- **Mapping:** AutoMapper
- **Loglama:** Serilog (Console + File sink, günlük log dosyaları)
- **Dokümantasyon:** Swagger (JWT güvenlik tanımları ile)
- **JSON İşleme:** Newtonsoft.Json (ReferenceLoopHandling.Ignore ile)
- **Katmanlı Mimari:**
- Controllers → API endpoint’leri
- Services → iş mantığı
- Repositories → veri erişim katmanı
- DTOs → veri transfer objeleri



## **Front-end**
- **Framework:** Next.js 16
- **Dil:** TypeScript 5
- **UI Kütüphanesi:** React 19
- **Stil:** TailwindCSS 4 (PostCSS ile entegre)
- **API İletişimi:** Axios
- **Bildirim Sistemi:** React Hot Toast
- **Linting:** ESLint (Next.js core-web-vitals + TypeScript kuralları)

# Klasör Yapısı
```
Root
├─ backend                          # Backend kaynak kodları
│  ├─ LibrarySystem                 # ASP.NET Core Web API projesi
│  │   └─ LibrarySystem             # Uygulama mantığı ve servis katmanları
│  │       ├─ Controllers           # API uç noktaları (Auth, Book, Loan, Fine, vb.)
│  │       ├─ DataContext           # EF Core DbContext ve veritabanı konfigürasyonu
│  │       ├─ Dtos                  # Veri transfer objeleri(Auth,Author,BookCopy,Book,Category,Dashboard,Error,Fine,FineType,Loan,Publisher,Room,Shelf,User için)
│  │       ├─ Mapper                # AutoMapper profilleri (DTO ↔ Model dönüşümleri)
│  │       ├─ Migrations            # EF Core migration dosyaları (veritabanı evrimleri)
│  │       ├─ Properties            # Uygulama başlatma ayarları (launchSettings.json)
│  │       ├─ Repositories          # Veri erişim katmanı (EF sorguları)
│  │       ├─ RepositoryInterfaces  # Repository arayüzleri 
│  │       ├─ ServiceInterfaces     # Servis arayüzleri (iş mantığı soyutlaması)
│  │       └─ Services              # İş mantığı servisleri 
│  └─ LibrarySystem.Models          # Ortak model katmanı
│      └─ Models                    # Entity modelleri (Book, Author, Loan, Fine, vb.)
└─ frontend                          # Next.js tabanlı frontend uygulaması
   ├─ app                            # App Router sayfaları
   │   ├─ admin                      # Yönetim paneli sayfaları
   │   │   ├─ authors                # Yazar yönetimi
   │   │   ├─ books                  # Kitap yönetimi
   │   │   │   └─ add                # Yeni kitap ekleme sayfası
   │   │   ├─ categories             # Kategori yönetimi
   │   │   ├─ loans                  # Ödünç alma işlemleri
   │   │   │   ├─ active             # Aktif ödünçler
   │   │   │   ├─ history            # Geçmiş ödünçler
   │   │   │   └─ overdue            # Gecikmiş ödünçler
   │   │   ├─ publishers             # Yayıncı yönetimi
   │   │   ├─ shelves                # Raf yönetimi
   │   │   └─ users                  # Kullanıcı yönetimi
   │   │       └─ banned             # Yasaklı kullanıcılar
   │   ├─ api                        # API endpoint proxy’leri(auth,author,book,book-copy,category,dashboard,fine,loans,publisher,room,shelf,user için)
   │   ├─ book                       # Kitap detay sayfası
   │   │   └─ [id]                   # Dinamik kitap sayfası
   │   ├─ login                      # Kullanıcı giriş sayfası
   │   ├─ profile                    # Kullanıcı profil sayfası
   │   └─ register                   # Kullanıcı kayıt sayfası
   ├─ public                         # Statik dosyalar 
   └─ src                            # Kaynak kodlar
       ├─ components                 # UI bileşenleri
       │   └─ ui                     # Genel UI parçaları
       │       ├─ Admin              # Admin paneli bileşenleri
       │       │   ├─ Common         # Ortak admin bileşenleri
       │       │   ├─ Modals         # Modal pencereler
       │       │   │   └─ Update     # Güncelleme modalları
       │       │   ├─ Shelves        # Raf bileşenleri
       │       │   └─ Users          # Kullanıcı bileşenleri
       │       ├─ Book               # Kitap bileşenleri
       │       ├─ BookDetail         # Kitap detay bileşenleri
       │       ├─ Home               # Ana sayfa bileşenleri
       │       ├─ Profile            # Profil bileşenleri
       │       └─ Skeletons          # Yükleme iskeletleri 
       ├─ context                    # React context dosyaları (global state yönetimi)
       ├─ hooks                      # Custom React hook’ları
       ├─ services                   # API servis çağrıları
       ├─ types                      # TypeScript tip tanımları
       └─ utils                      # Yardımcı fonksiyonlar 
                 
 ```


# Veritabanı Şeması
```
┌────────────────────┐
│      AppUser       │
├────────────────────┤
│ Id (PK)            │
│ FirstName          │
│ LastName           │
│ DateOfBirth        │
│ Email              │
│ RefreshToken       │
│ RefreshTokenExpiry │
└───────┬────────────┘
        │ 1
        │
        ▼ N
┌───────────────┐           ┌──────────────┐           ┌──────────────┐
│     Loan      │           │   BookCopy   │           │ BookComment  │
├───────────────┤           ├──────────────┤           ├──────────────┤
│ Id (PK)       │           │ Id (PK)      │           │ Id (PK)      │
│ UserId (FK)   │◄──────────│ BookId (FK)  │◄──────────│ BookId (FK)  │
│ BookCopyId(FK)│    1:N    │ ShelfId (FK) │    N:1    │ UserId (FK)  │
│ LoanDate      │           │ BarcodeNum   │           │ CommentText  │
│ ExpectedReturn│           │ IsAvailable  │           │ Rating       │
│ ActualReturn  │           └──────┬───────┘           │ CreatedDate  │
└──────┬────────┘                  │ N                 └──────────────┘
       │ 1                         │
       │                           ▼ 1
       ▼ N                  ┌──────────────┐
┌──────────────┐            │    Shelf     │
│     Fine     │            ├──────────────┤
├──────────────┤            │ Id (PK)      │
│ Id (PK)      │            │ ShelfCode    │
│ UserId (FK)  │            │ RoomId (FK)  │
│ LoanId (FK)  │            └──────┬───────┘
│ FineTypeId(FK)│                  │ N
│ Amount       │                   │
│ Description  │                   ▼ 1
│ Status       │            ┌──────────────┐
│ IsActive     │            │     Room     │
│ IssuedDate   │            ├──────────────┤
└──────┬───────┘            │ Id (PK)      │
       │ N                  │ RoomCode     │
       │                    │ Description  │
       ▼ 1                  └──────────────┘
┌──────────────┐
│   FineType   │
├──────────────┤
│ Id (PK)      │
│ Name         │
│ DailyRate    │
└──────────────┘

                     N:M
┌──────────────┐◄───────────►┌──────────────┐       ┌──────────────┐
│     Book     │             │  BookAuthor  │◄─────►│    Author    │
├──────────────┤             ├──────────────┤       ├──────────────┤
│ Id (PK)      │             │ BookId (FK)  │       │ Id (PK)      │
│ Title        │             │ AuthorId (FK)│       │ FirstName    │
│ ISBN         │             └──────────────┘       │ LastName     │
│ PageCount    │                                    └──────────────┘
│ PublicationY │
│ Language     │
│ ImageUrl     │
│ Summary      │
│ CategoryId(FK)│──────────┐
│ PublisherId(FK)│         │
└──────▲───────┘           │ (Book -> BookCopy ilişkisi
       │ N                 │  yukarıdaki BookCopy tablosuna gider)
       │                   │
       │ 1                 │
┌──────┴───────┐           │
│   Category   │           │
├──────────────┤           │
│ Id (PK)      │           │
│ Name         │           │
└──────────────┘           │
                           │
       ┌───────────────────┘
       │ 1
       ▼ N
┌──────────────┐
│  Publisher   │
├──────────────┤
│ Id (PK)      │
│ Name         │
└──────────────┘
```

# API Dokümantasyonu

## 🔑 Kimlik Doğrulama
- `POST /api/auth/register` → Yeni kullanıcı kaydı  
- `POST /api/auth/login` → Giriş işlemi, JWT token döner  
- `POST /api/auth/refresh-token` → Token yenileme

## 📚 Kitap Yönetimi
- `POST /api/book/add-book` → Yeni kitap ekle  
- `GET /api/book/get-book/{id}` → Kitap detaylarını getir  
- `GET /api/book/get-all-books` → Tüm kitapları listele  
- `PUT /api/book/update-book/{id}` → Kitap güncelle  
- `DELETE /api/book/delete-book/{id}` → Kitap sil  
- `POST /api/book/add-book-copy` → Yeni kitap kopyası ekle  
- `PUT /api/book/update-book-copy/{id}` → Kitap kopyası güncelle  
- `DELETE /api/book/delete-book-copy/{id}` → Kitap kopyası sil
- `GET /api/book/get-book-details/{id}` → Kitap + kopya + yazar detayları  
- `GET /api/book/get-by-name` → Kitap adına göre arama  
- `GET /api/book/other-by-author` → Aynı yazarın diğer kitapları  
- `GET /api/book/all-book-copies` → Tüm kitap kopyaları

## 👤 Kullanıcı Yönetimi
- `GET /api/user/me` → Giriş yapan kullanıcının bilgileri  
- `GET /api/user/stats` → Kullanıcıya özel istatistikler  
- `GET /api/user` → Tüm kullanıcıları listele (Admin)  
- `GET /api/user/{id}` → Belirli kullanıcıyı getir (Admin)  
- `GET /api/user/email/{email}` → E-posta ile kullanıcı arama (Admin)

## 📦 Ödünç Alma / İade
- `GET /api/loan/my-active-loans` → Kullanıcının aktif ödünçleri  
- `GET /api/loan/my-returned-loans` → Kullanıcının iade ettiği kitaplar  
- `GET /api/loan/can-borrow` → Kullanıcı ödünç alabilir mi?  
- `POST /api/loan` → Kitap ödünç alma  
- `PUT /api/loan/update-loan` → Ödünç bilgisi güncelle  
- `POST /api/loan/return-book` → Kitap iade et  
- `GET /api/loan/get-all-loans` → Tüm ödünç kayıtları (Admin)  
- `GET /api/loan/overdue` → Geciken ödünçler (Admin)  
- `GET /api/loan/returned` → İade edilenler (Admin)

## 💰 Ceza Yönetimi
- `POST /api/fine/issue` → Yeni ceza oluştur (Admin)  
- `GET /api/fine/by-email` → Kullanıcıya ait cezalar (Admin)  
- `GET /api/fine/my-active-fines` → Kullanıcının aktif cezaları  
- `GET /api/fine/my-history-fines` → Kullanıcının geçmiş cezaları  
- `POST /api/fine/revoke/{fineId}` → Ceza iptali (Admin)  
- `POST /api/fine/pay` → Ceza ödeme (Kullanıcı)

## 📁 Diğer Yönetim Alanları
- **Yazarlar**: `GET /api/author`, `POST`, `DELETE`, `PUT`, `GET by-name`, `GET pageable`  
- **Kategoriler**: `GET /api/category/list`, `POST`, `DELETE`, `PUT`, `GET by-name`, `GET pageable`  
- **Yayıncılar**: `GET`, `POST`, `DELETE`, `PUT`, `GET by-name`, `GET pageable`  
- **Odalar & Raflar**: `GET`, `POST`, `PUT`, `GET room/{roomId}`, `GET search`  
- **Dashboard**: `GET` → Admin panel verileri  
- **Ceza Türleri**: `GET`, `POST`, `PUT update`, `GET by id`  
- **Kitap Yorumları**: `GET`, `POST`, `DELETE`



## Ekip Üyeleri
 👤 213301129-Kaan Pulat

 👤 223301006-Ataberk Bakır

👤 223301007-Serdar Aşlakcı

👤 223301031-Taha Yasin Uruç

👤 223301157-Ömerhan Sezgin





