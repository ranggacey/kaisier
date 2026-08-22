import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Transaction, TransactionInput, generateTransactionId } from '@/lib/models/Transaction';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    const db = await getDatabase();
    const transactions = await db.collection<Transaction>('transactions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: transactions.map((t) => ({
        ...t,
        _id: t._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data transaksi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionInput = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keranjang kosong' },
        { status: 400 }
      );
    }

    if (!body.total || !body.paymentMethod || !body.cashier) {
      return NextResponse.json(
        { success: false, error: 'Total, metode pembayaran, dan kasir wajib diisi' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verify stock availability for all items before creating transaction
    for (const item of body.items) {
      const product = await db.collection<Product>('products').findOne({ id: item.productId });
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Produk ${item.productName} tidak ditemukan` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Stok ${item.productName} tidak mencukupi (tersedia: ${product.stock})` },
          { status: 400 }
        );
      }
    }

    const itemsWithSubtotal: Transaction['items'] = body.items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));

    const newTransaction: Transaction = {
      id: generateTransactionId(),
      items: itemsWithSubtotal,
      total: body.total,
      paymentMethod: body.paymentMethod,
      cashier: body.cashier,
      createdAt: new Date(),
    };

    const session = db.client.startSession();
    try {
      await session.withTransaction(async () => {
        // Insert transaction
        await db.collection<Transaction>('transactions').insertOne(newTransaction, { session });

        // Update product stock
        for (const item of body.items) {
          await db.collection<Product>('products').updateOne(
            { id: item.productId },
            { $inc: { stock: -item.quantity }, $set: { updatedAt: new Date() } },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newTransaction,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat transaksi' },
      { status: 500 }
    );
  }
}