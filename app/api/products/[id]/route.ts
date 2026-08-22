import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Product, ProductInput } from '@/lib/models/Product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    const product = await db.collection<Product>('products').findOne({ id });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        _id: product._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<ProductInput> = await request.json();
    
    const db = await getDatabase();
    
    const updateData: Partial<Product> = {
      updatedAt: new Date(),
    };
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.stock !== undefined) updateData.stock = body.stock;

    const result = await db.collection<Product>('products').findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui produk' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    const result = await db.collection<Product>('products').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}