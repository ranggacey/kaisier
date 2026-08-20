'use client';

import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

// Data produk dummy (konsisten dengan halaman produk)
const products = [
  { id: 'PROD001', name: 'Kopi Susu Gula Aren', price: 18000, stock: 50 },
  { id: 'PROD002', name: 'Americano', price: 15000, stock: 30 },
  { id: 'PROD003', name: 'Croissant', price: 12000, stock: 25 },
  { id: 'PROD004', name: 'Teh Melati', price: 10000, stock: 100 },
  { id: 'PROD005', name: 'Pain au Chocolat', price: 15000, stock: 20 },
  { id: 'PROD006', name: 'Latte', price: 20000, stock: 40 },
  { id: 'PROD007', name: 'Muffin Cokelat', price: 14000, stock: 15 },
  { id: 'PROD008', name: 'Air Mineral', price: 5000, stock: 200 },
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CashierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart((currentCart) => {
      return currentCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Product Grid */}
      <div className="w-3/5 p-4">
        <h2 className="text-xl font-bold mb-4">Pilih Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <p className="font-semibold text-sm">{product.name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-2/5 bg-white p-4 shadow-lg flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" /> Keranjang
        </h2>
        
        {cart.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Keranjang kosong
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-md">
                <div className="w-3/5">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                  -</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2 font-semibold">
            <span>Subtotal</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
          </div>
          <div className="flex justify-between items-center mb-4 font-bold text-lg">
            <span>Total</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700">
            <CreditCard /> Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
