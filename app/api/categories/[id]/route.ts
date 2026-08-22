import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Category, CategoryInput } from '@/lib/models/Category';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const category = await db.collection<Category>('categories').findOne({ id });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        _id: category._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: CategoryInput = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check duplicate name (excluding current category)
    const existing = await db.collection<Category>('categories').findOne({
      name: body.name.trim(),
      id: { $ne: id },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Kategori dengan nama ini sudah ada' },
        { status: 400 }
      );
    }

    const result = await db.collection<Category>('categories').findOneAndUpdate(
      { id },
      {
        $set: {
          name: body.name.trim(),
          description: body.description?.trim() || '',
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
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
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui kategori' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    // Check if any products use this category
    const productCount = await db.collection('products').countDocuments({ categoryId: id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Tidak dapat menghapus kategori. ${productCount} produk masih menggunakan kategori ini.` },
        { status: 400 }
      );
    }

    const result = await db.collection<Category>('categories').deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus kategori' },
      { status: 500 }
    );
  }
}