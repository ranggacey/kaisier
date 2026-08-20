import { BarChart, DollarSign, Package, ShoppingCart } from 'lucide-react';

// Dummy data for demonstration
const summaryData = {
  totalRevenue: 5230000,
  totalTransactions: 142,
  itemsSold: 320,
};

const recentTransactions = [
  { id: 'TRX001', date: '2026-08-20 10:30', total: 75000, items: 3 },
  { id: 'TRX002', date: '2026-08-20 10:25', total: 45000, items: 2 },
  { id: 'TRX003', date: '2026-08-20 10:18', total: 120000, items: 5 },
  { id: 'TRX004', date: '2026-08-20 10:12', total: 36000, items: 2 },
  { id: 'TRX005', date: '2026-08-20 10:05', total: 88000, items: 4 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function ReportsPage() {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500">Ringkasan aktivitas penjualan hari ini.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <p className="text-xl font-bold">{formatCurrency(summaryData.totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-xl font-bold">{summaryData.totalTransactions}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Item Terjual</p>
            <p className="text-xl font-bold">{summaryData.itemsSold}</p>
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
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{tx.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{formatCurrency(tx.total)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">{tx.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
