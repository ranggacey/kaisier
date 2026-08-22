import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Category, CategoryInput, generateCategoryId } from '@/lib/models/Category';

export async function GET() {
  try {
    const db = await getDatabase();
    const categories = await db.collection<Category>('categories').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        _id: c._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CategoryInput = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check duplicate name
    const existing = await db.collection<Category>('categories').findOne({ name: body.name.trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Kategori dengan nama ini sudah ada' },
        { status: 400 }
      );
    }

    const newCategory: Category = {
      id: generateCategoryId(),
      name: body.name.trim(),
      description: body.description?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Category>('categories').insertOne(newCategory);

    return NextResponse.json({
      success: true,
      data: {
        ...newCategory,
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan kategori' },
      { status: 500 }
    );
  }
}