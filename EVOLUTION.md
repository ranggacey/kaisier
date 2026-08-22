## [2026-08-20 13:00] Penyempurnaan UI Halaman Manajemen Produk
- Menambahkan kolom "Aksi" pada tabel daftar produk di halaman `/produk`.
- Menambahkan tombol ikon "Ubah" (Pencil) dan "Hapus" (Trash2) untuk setiap baris produk.
- Fungsionalitas tombol belum diimplementasikan, fokus pada penyempurnaan antarmuka.

## [2026-08-22 03:15] Implementasi CRUD Produk & Integrasi Database MongoDB
- Membuat utilitas koneksi database MongoDB di `lib/db.ts` dengan connection pooling.
- Membuat model Produk di `lib/models/Product.ts` dengan tipe TypeScript dan generator ID.
- Membuat API RESTful untuk produk:
  - `GET /api/products` - Ambil daftar produk
  - `POST /api/products` - Tambah produk baru
  - `GET /api/products/[id]` - Ambil detail produk
  - `PUT /api/products/[id]` - Perbarui produk
  - `DELETE /api/products/[id]` - Hapus produk
- Mengubah halaman Manajemen Produk (`/produk`) menjadi client component yang fetch data dari API.
- Implementasi fungsi hapus produk dengan konfirmasi dan loading state.
- Membuat halaman Edit Produk (`/produk/ubah/[id]`) dengan form pre-filled dari API.
- Memperbarui halaman Tambah Produk (`/produk/tambah`) untuk menyimpan ke database via API.
- Memperbarui halaman Kasir (`/`) untuk mengambil produk dari API, validasi stok real-time, dan proses checkout yang mengurangi stok otomatis.
- Menambahkan indikator stok rendah (≤10) dan stok habis pada tabel produk.
- Menambahkan navigasi kembali (back button) pada halaman tambah/edit produk.
- Memperbaiki semua warning ESLint (unused variables).