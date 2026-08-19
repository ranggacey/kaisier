"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Store } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (email === 'admin@kaisier.id' && password === 'password') {
      // In a real app, you'd use authentication and sessions
      router.push('/');
    } else {
      setError('Email atau password salah. Coba: admin@kaisier.id / password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl mb-3">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kaisier POS</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masuk ke akun kasir Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                placeholder="admin@kaisier.id"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-sm"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Demo Credential: <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">admin@kaisier.id</code> / <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">password</code>
        </div>
      </div>
    </div>
  );
}
