'use client';

import { useState, useEffect } from 'react';
import { CreditCard, MoreVertical, Loader2 } from 'lucide-react';

interface TransactionItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Transaction {
  _id: string;
  id: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit' | 'Kredit';
  cashier: string;
  createdAt: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      } else {
        setError(data.error || 'Gagal memuat transaksi');
      }
    } catch {
      setError('Terjadi kesalahan saat memuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500">
            Lihat semua transaksi penjualan yang telah terjadi.
          </p>
        </div>
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
                ID Transaksi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tanggal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Metode Bayar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Kasir
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {trx.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(trx.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-800">
                    {formatCurrency(trx.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                    {trx.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <CreditCard className="h-3 w-3" />
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {trx.cashier}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                    <button className="text-gray-500 hover:text-gray-800">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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