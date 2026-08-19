import { CreditCard, MoreVertical } from 'lucide-react';

const transactions = [
  {
    id: 'TRX001',
    date: '2026-08-19 10:05',
    total: 33000,
    items: 2,
    paymentMethod: 'QRIS',
    cashier: 'Yuna',
  },
  {
    id: 'TRX002',
    date: '2026-08-19 10:02',
    total: 18000,
    items: 1,
    paymentMethod: 'Tunai',
    cashier: 'Yuna',
  },
  {
    id: 'TRX003',
    date: '2026-08-19 09:58',
    total: 45000,
    items: 3,
    paymentMethod: 'QRIS',
    cashier: 'Rangga',
  },
  {
    id: 'TRX004',
    date: '2026-08-19 09:55',
    total: 12000,
    items: 1,
    paymentMethod: 'Debit',
    cashier: 'Yuna',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function TransactionsPage() {
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
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {trx.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {trx.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-800">
                  {formatCurrency(trx.total)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                  {trx.items}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
