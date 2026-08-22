import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Transaction } from '@/lib/models/Transaction';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    const transaction = await db.collection<Transaction>('transactions').findOne({ id });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        _id: transaction._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data transaksi' },
      { status: 500 }
    );
  }
}