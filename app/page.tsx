"use client";
import { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  Wallet, 
  History, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  category?: string;
}

interface Transaction {
  id: string;
  type: 'masuk' | 'keluar' | 'penjualan';
  amount: number;
  note: string;
  date: string;
}

export default function KaisierApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produk' | 'kas' | 'laporan'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const savedProd = localStorage.getItem('kaisier_products');
    const savedTx = localStorage.getItem('kaisier_transactions');
    if (savedProd) setProducts(JSON.parse(savedProd));
    if (savedTx) setTransactions(JSON.parse(savedTx));
  }, []);

  useEffect(() => {
    localStorage.setItem('kaisier_products', JSON.stringify(products));
    localStorage.setItem('kaisier_transactions', JSON.stringify(transactions));
  }, [products, transactions]);

  const [pName, setPName] = useState('');
  const [pBuy, setPBuy] = useState('');
  const [pSell, setPSell] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCategory, setPCategory] = useState('Umum');

  const [cType, setCType] = useState<'masuk' | 'keluar'>('masuk');
  const [cAmount, setCAmount] = useState('');
  const [cNote, setCNote] = useState('');

  const categories = ['Semua', ...Array.from(new Set(products.map(p => p.category || 'Umum')))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Semua' || (p.category || 'Umum') === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalMasuk = transactions.filter(t => t.type === 'masuk' || t.type === 'penjualan').reduce((s, t) => s + t.amount, 0);
  const totalKeluar = transactions.filter(t => t.type === 'keluar').reduce((s, t) => s + t.amount, 0);
  const saldoKas = totalMasuk - totalKeluar;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pSell) return;
    const newP: Product = {
      id: Date.now().toString(),
      name: pName,
      buyPrice: Number(pBuy) || 0,
      sellPrice: Number(pSell),
      stock: Number(pStock) || 0,
      category: pCategory || 'Umum'
    };
    setProducts([newP, ...products]);
    setPName(''); setPBuy(''); setPSell(''); setPStock(''); setPCategory('Umum');
  };

  const handleAddCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cAmount || Number(cAmount) <= 0) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: cType,
      amount: Number(cAmount),
      note: cNote || (cType === 'masuk' ? 'Uang Masuk / Modal' : 'Pengeluaran Toko'),
      date: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    setTransactions([newTx, ...transactions]);
    setCAmount(''); setCNote('');
  };

  const deleteProduct = (id: string) => {
    if (confirm('Hapus barang ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col font-sans pb-36 shadow-2xl antialiased selection:bg-[#4A6278] selection:text-[#E5D3B3]">
      {/* Header Premium LI-NING Style */}
      <header className="bg-gradient-to-br from-[#2D3748] via-[#4A6278] to-[#3B4D60] text-[#E5D3B3] p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#E5D3B3]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E5D3B3] text-[#4A6278] flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-white/20">
              K
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-white flex items-center gap-1.5">
                KAISIER <Sparkles className="w-4 h-4 text-[#E5D3B3] fill-[#E5D3B3]" />
              </h1>
              <p className="text-[11px] text-[#E5D3B3]/80 font-medium">Finansial & Stok Toko</p>
            </div>
          </div>
          <span className="bg-[#E5D3B3]/20 border border-[#E5D3B3]/30 text-[#E5D3B3] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#E5D3B3]" /> PRO
          </span>
        </div>

        {/* Total Saldo Card */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/15 text-white shadow-2xl relative z-10">
          <p className="text-[10px] text-[#E5D3B3] uppercase tracking-widest font-bold">Total Saldo Kas Toko</p>
          <p className="text-3xl font-black mt-1 text-[#E5D3B3] tracking-tight">
            Rp {saldoKas.toLocaleString('id-ID')}
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 bg-black/10 p-2.5 rounded-2xl border border-white/5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-300 block font-medium">Masuk</span>
                <p className="font-bold text-emerald-300 text-xs">Rp {totalMasuk.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-black/10 p-2.5 rounded-2xl border border-white/5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-300 block font-medium">Keluar</span>
                <p className="font-bold text-rose-300 text-xs">Rp {totalKeluar.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="p-4 flex-1 space-y-4">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-sm text-[#4A6278] mb-1">Akses Cepat Menu</h3>
              <p className="text-xs text-gray-400 mb-4">Pilih navigasi untuk kelola toko Mas:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveTab('produk')} 
                  className="p-4 bg-slate-50 hover:bg-[#4A6278]/5 rounded-2xl border border-slate-200/80 text-left transition-all active:scale-95 group flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4A6278]/10 text-[#4A6278] flex items-center justify-center mb-3 group-hover:bg-[#4A6278] group-hover:text-white transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Kelola Produk</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{products.length} Barang terdaftar</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('kas')} 
                  className="p-4 bg-slate-50 hover:bg-[#4A6278]/5 rounded-2xl border border-slate-200/80 text-left transition-all active:scale-95 group flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4A6278]/10 text-[#4A6278] flex items-center justify-center mb-3 group-hover:bg-[#4A6278] group-hover:text-white transition-colors">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Catat Kas</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Uang Masuk / Keluar</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-xs text-[#4A6278] uppercase tracking-wider">Aktivitas Terakhir</h3>
                <button onClick={() => setActiveTab('laporan')} className="text-[11px] font-bold text-[#4A6278] hover:underline">Lihat Semua</button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-300">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">Belum ada transaksi tercatat</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {transactions.slice(0, 4).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100/80 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${t.type === 'keluar' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {t.type === 'keluar' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{t.note}</p>
                          <p className="text-[10px] text-slate-400">{t.date}</p>
                        </div>
                      </div>
                      <p className={`font-black ${t.type === 'keluar' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {t.type === 'keluar' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUK TAB */}
        {activeTab === 'produk' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Form Tambah Produk */}
            <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="font-bold text-xs text-[#4A6278] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Tambah Produk Baru
              </h3>
              
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Nama Barang</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Kemeja Polos, Sabun Mandi" 
                  value={pName} 
                  onChange={e => setPName(e.target.value)} 
                  className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Harga Modal (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="10000" 
                    value={pBuy} 
                    onChange={e => setPBuy(e.target.value)} 
                    className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Harga Jual (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="15000" 
                    value={pSell} 
                    onChange={e => setPSell(e.target.value)} 
                    className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Stok Awal</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    value={pStock} 
                    onChange={e => setPStock(e.target.value)} 
                    className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Kategori</label>
                  <input 
                    type="text" 
                    placeholder="Minuman, Makanan..." 
                    value={pCategory} 
                    onChange={e => setPCategory(e.target.value)} 
                    className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4A6278] text-[#E5D3B3] py-3.5 rounded-2xl font-bold text-xs shadow-lg hover:bg-[#3B4D60] transition-all active:scale-95 mt-2 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Simpan Produk
              </button>
            </form>

            {/* List & Filter Produk */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-[#4A6278] uppercase tracking-wider">Daftar Produk ({filteredProducts.length})</h3>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama barang..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6278]"
                />
              </div>

              {/* Filter Category Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#4A6278] text-[#E5D3B3] shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-300">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">Tidak ada produk ditemukan</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl text-xs border border-slate-100/80 hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{p.category || 'Umum'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Stok: <span className="font-bold text-slate-700">{p.stock}</span> | Modal: Rp {p.buyPrice.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-black text-[#4A6278] text-sm">Rp {p.sellPrice.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => deleteProduct(p.id)} 
                          className="text-rose-500 p-2 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                          title="Hapus Barang"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATAT KAS TAB */}
        {activeTab === 'kas' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <form onSubmit={handleAddCash} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-xs text-[#4A6278] uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Catat Arus Kas
              </h3>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setCType('masuk')} 
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${cType === 'masuk' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> + Uang Masuk
                </button>
                <button 
                  type="button" 
                  onClick={() => setCType('keluar')} 
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${cType === 'keluar' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <TrendingDown className="w-3.5 h-3.5" /> - Uang Keluar
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Nominal (Rp)</label>
                <input 
                  type="number" 
                  placeholder="50000" 
                  value={cAmount} 
                  onChange={e => setCAmount(e.target.value)} 
                  className="w-full p-3 border rounded-2xl text-base font-bold text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Keterangan / Catatan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Beli bensin, Penjualan tunai" 
                  value={cNote} 
                  onChange={e => setCNote(e.target.value)} 
                  className="w-full p-3 border rounded-2xl text-xs border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6278] bg-slate-50/50" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4A6278] text-[#E5D3B3] py-3.5 rounded-2xl font-bold text-xs shadow-lg hover:bg-[#3B4D60] transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Simpan Catatan Kas
              </button>
            </form>
          </div>
        )}

        {/* HISTORI TAB */}
        {activeTab === 'laporan' && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
            <h3 className="font-bold text-xs text-[#4A6278] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4" /> Riwayat Kas Toko
            </h3>

            {transactions.length === 0 ? (
              <div className="text-center py-10 text-slate-300">
                <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">Belum ada riwayat transaksi</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {transactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${t.type === 'keluar' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {t.type === 'keluar' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t.note}</p>
                        <p className="text-[10px] text-slate-400">{t.date}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm ${t.type === 'keluar' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === 'keluar' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation Modern Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-200/80 p-2 flex justify-around text-[10px] font-bold text-slate-400 shadow-2xl z-50 rounded-t-3xl">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-[#4A6278] bg-[#4A6278]/10 font-extrabold' : 'hover:text-slate-600'}`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('produk')} 
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all ${activeTab === 'produk' ? 'text-[#4A6278] bg-[#4A6278]/10 font-extrabold' : 'hover:text-slate-600'}`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Produk</span>
        </button>

        <button 
          onClick={() => setActiveTab('kas')} 
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all ${activeTab === 'kas' ? 'text-[#4A6278] bg-[#4A6278]/10 font-extrabold' : 'hover:text-slate-600'}`}
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span>Kas</span>
        </button>

        <button 
          onClick={() => setActiveTab('laporan')} 
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all ${activeTab === 'laporan' ? 'text-[#4A6278] bg-[#4A6278]/10 font-extrabold' : 'hover:text-slate-600'}`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span>Histori</span>
        </button>
      </footer>
    </div>
  );
}
