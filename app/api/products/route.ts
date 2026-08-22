import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { Product, ProductInput, generateProductId } from '@/lib/models/Product';

export async function GET() {
  try {
    const db = await getDatabase();
    const products = await db.collection<Product>('products').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductInput = await request.json();
    
    if (!body.name || !body.price || body.stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Nama, harga, dan stok wajib diisi' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const newProduct: Product = {
      id: generateProductId(),
      name: body.name,
      price: body.price,
      stock: body.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Product>('products').insertOne(newProduct);
    
    return NextResponse.json({
      success: true,
      data: {
        ...newProduct,
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}