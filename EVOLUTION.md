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

## [2026-08-22 15:30] Implementasi Transaksi & Laporan Real-time dari Database
- Membuat model Transaksi di `lib/models/Transaction.ts` dengan item detail, total, metode pembayaran, dan kasir.
- Membuat API `/api/transactions` (GET untuk riwayat, POST untuk membuat transaksi baru dengan transaksi database atomic).
- Transaksi checkout sekarang menggunakan MongoDB session untuk atomicity: insert transaksi + kurangi stok produk dalam satu transaksi ACID.
- Memperbarui halaman Kasir (`/`): tambah pemilihan metode pembayaran (Tunai/QRIS/Debit/Kredit) dan input nama kasir.
- Mengubah halaman Transaksi (`/transactions`) dari data dummy ke fetch real-time dari API dengan loading state.
- Mengubah halaman Laporan (`/laporan`) dari data dummy ke agregasi real-time dari API transaksi (total pendapatan, total transaksi, item terjual, 5 transaksi terakhir).
- Memperbaiki ESLint warning (unused imports).

## [2026-08-22 18:45] Implementasi Detail Transaksi & Cetak Struk
- Membuat API `GET /api/transactions/[id]` untuk mengambil detail transaksi tunggal.
- Menambahkan modal detail transaksi pada halaman `/transactions` dengan tombol "Lihat Detail" (ikon Eye) pada kolom Aksi.
- Modal menampilkan: ID transaksi, tanggal, kasir, metode pembayaran, daftar item (nama, harga, jumlah, subtotal), dan total.
- Menambahkan tombol "Cetak Struk" (ikon Printer) yang memanggil `window.print()` untuk mencetak struk transaksi.
- Menambahkan tombol "Tutup" dan klik overlay untuk menutup modal.
- Memperbaiki ESLint warning (unused imports: ObjectId, MoreVertical).