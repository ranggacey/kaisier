'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Loader2, AlertTriangle, Filter } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
  categoryName?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Category = {
  id: string;
  name: string;
};

type PaymentMethod = 'Tunai' | 'QRIS' | 'Debit' | 'Kredit';

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [cashier, setCashier] = useState('Yuna');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Gagal memuat produk');
      }
    } catch {
      setError('Terjadi kesalahan saat memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.categoryId === categoryFilter)
    : products;

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Stok produk ini habis');
      return;
    }
    
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`Stok tidak mencukupi. Maksimal ${product.stock} item.`);
          return currentCart;
        }
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart((currentCart) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return currentCart;

      return currentCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            if (newQuantity > product.stock) {
              alert(`Stok tidak mencukupi. Maksimal ${product.stock} item.`);
              return item;
            }
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const transactionItems = cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: transactionItems,
          total,
          paymentMethod,
          cashier,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Transaksi berhasil! ID: ${data.data.id}`);
        setCart([]);
        // Refresh produk
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        if (productsData.success) setProducts(productsData.data);
      } else {
        setError(data.error || 'Gagal memproses transaksi');
      }
    } catch {
      setError('Gagal memproses transaksi');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Product Grid */}
      <div className="w-3/5 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pilih Produk</h2>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`p-3 bg-white rounded-lg shadow-sm transition-shadow text-left ${
                product.stock <= 0
                  ? 'opacity-50 cursor-not-allowed border border-red-200'
                  : 'hover:shadow-md'
              }`}
            >
              <p className="font-semibold text-sm truncate">{product.name}</p>
              {product.categoryName && (
                <p className="text-xs text-gray-400 mt-0.5">{product.categoryName}</p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
              </p>
              <p className={`text-xs mt-1 ${product.stock <= 10 && product.stock > 0 ? 'text-yellow-600' : product.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                Stok: {product.stock}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-2/5 bg-white p-4 shadow-lg flex flex-col border-l">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" /> Keranjang
        </h2>

        {cart.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Keranjang kosong
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-md">
                <div className="w-3/5 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2 font-semibold">
            <span>Subtotal</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
          </div>
          <div className="flex justify-between items-center mb-4 font-bold text-lg">
            <span>Total</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
          </div>
          
          {/* Payment Method Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Tunai', 'QRIS', 'Debit', 'Kredit'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Cashier Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kasir</label>
            <input
              type="text"
              value={cashier}
              onChange={(e) => setCashier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama kasir"
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard /> Bayar Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}