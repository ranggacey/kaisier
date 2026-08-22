'use client';

import { useState, useEffect } from 'react';
import { BarChart, DollarSign, Package, ShoppingCart, Loader2 } from 'lucide-react';

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

interface SummaryData {
  totalRevenue: number;
  totalTransactions: number;
  itemsSold: number;
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

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData>({
    totalRevenue: 0,
    totalTransactions: 0,
    itemsSold: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        const transactions = data.data as Transaction[];
        
        // Calculate summary
        const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
        const totalTransactions = transactions.length;
        const itemsSold = transactions.reduce(
          (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
          0
        );

        setSummary({
          totalRevenue,
          totalTransactions,
          itemsSold,
        });

        // Get recent 5 transactions
        setRecentTransactions(transactions.slice(0, 5));
      } else {
        setError(data.error || 'Gagal memuat data laporan');
      }
    } catch {
      setError('Terjadi kesalahan saat memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500">Ringkasan aktivitas penjualan hari ini.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <p className="text-xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-xl font-bold">{summary.totalTransactions}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Item Terjual</p>
            <p className="text-xl font-bold">{summary.itemsSold}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="h-5 w-5 text-gray-600" />
            Transaksi Terakhir
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID Transaksi</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Waktu</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Jumlah Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{tx.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatDate(tx.createdAt)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{formatCurrency(tx.total)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {tx.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}