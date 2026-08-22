'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Eye, Printer, X } from 'lucide-react';

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

const paymentMethodLabels: Record<Transaction['paymentMethod'], string> = {
  Tunai: 'Tunai',
  QRIS: 'QRIS',
  Debit: 'Debit',
  Kredit: 'Kredit',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const fetchTransactionDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const res = await fetch(`/api/transactions/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedTransaction(data.data);
      } else {
        alert(data.error || 'Gagal memuat detail transaksi');
      }
    } catch {
      alert('Terjadi kesalahan saat memuat detail transaksi');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetail = (transaction: Transaction) => {
    fetchTransactionDetail(transaction.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const closeModal = () => {
    setSelectedTransaction(null);
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
                    <button
                      onClick={() => handleViewDetail(trx)}
                      disabled={detailLoading}
                      className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                      title="Lihat Detail"
                    >
                      {detailLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        <Eye className="h-4 w-4 mx-auto" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={closeModal} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Detail Transaksi</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[70vh]">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">ID Transaksi</span>
                    <span className="font-medium">{selectedTransaction.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium">{formatDate(selectedTransaction.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Kasir</span>
                    <span className="font-medium">{selectedTransaction.cashier}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Metode Pembayaran</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <CreditCard className="h-3 w-3" />
                      {paymentMethodLabels[selectedTransaction.paymentMethod]}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-3 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Item Transaksi</h3>
                  <div className="space-y-2">
                    {selectedTransaction.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.productName}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-right whitespace-nowrap">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end text-lg font-bold">
                  <span>Total: {formatCurrency(selectedTransaction.total)}</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Struk
                </button>
                <button
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print-only styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          @page {
            margin: 0;
            size: 80mm auto;
          }
        }
      `}</style>
    </div>
  );
}