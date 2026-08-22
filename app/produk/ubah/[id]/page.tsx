'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setName(data.data.name);
          setPrice(data.data.price.toString());
          setStock(data.data.stock.toString());
        } else {
          setError(data.error || 'Produk tidak ditemukan');
        }
      } catch {
        setError('Terjadi kesalahan saat memuat produk');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseInt(price, 10),
          stock: parseInt(stock, 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/produk');
      } else {
        setError(data.error || 'Gagal memperbarui produk');
      }
    } catch {
      setError('Terjadi kesalahan saat memperbarui produk');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Ubah Produk</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Harga (IDR)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            min="0"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stok
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            min="0"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}