import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Home, Package, BarChart3, History } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kaisier POS',
  description: 'Point of Sale for modern business',
};

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center text-center text-xs font-medium text-gray-500 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex h-full flex-col">
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-white shadow-t">
          <div className="grid h-16 grid-cols-4">
            <NavItem href="/">
              <Home className="h-6 w-6" />
              <span>Kasir</span>
            </NavItem>
            <NavItem href="/produk">
              <Package className="h-6 w-6" />
              <span>Produk</span>
            </NavItem>
            <NavItem href="/transactions">
              <History className="h-6 w-6" />
              <span>Transaksi</span>
            </NavItem>
            <NavItem href="/laporan">
              <BarChart3 className="h-6 w-6" />
              <span>Laporan</span>
            </NavItem>
          </div>
        </nav>
      </body>
    </html>
  );
}

