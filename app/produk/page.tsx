'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus produk');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus produk');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product: Product) => {
    window.location.href = `/produk/ubah/${product.id}`;
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-sm text-gray-500">Kelola daftar produk dan stok Anda.</p>
        </div>
        <Link
          href="/produk/tambah"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nama Produk
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Harga
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Stok
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat produk...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Belum ada produk. Klik <span className="text-blue-600 underline">Tambah Produk</span> untuk memulai.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                    {product.stock}
                    {product.stock <= 10 && product.stock > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Stok Rendah
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Habis
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ubah"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}