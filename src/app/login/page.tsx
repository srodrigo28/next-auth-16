'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { login, type AuthFormState } from '@/app/actions/auth';
import { Mail, Lock } from 'lucide-react'; // Ícones

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-blue-500 tracking-wider text-white font-semibold rounded-xl shadow hover:bg-blue-400 transition disabled:bg-gray-600"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const initialState: AuthFormState = { success: false, message: '' };
  const [state, formAction] = useFormState(login, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-10">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Bem-vindo de volta
        </h1>

        {!state.success && state.message && (
          <div className="mb-4 p-3 rounded-lg bg-red-600/20 text-red-400 text-center text-sm">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-gray-200 tracking-wide">
          Não tem uma conta?{' '}
          <a href="/login/create-account" className="text-blue-400 font-semibold hover:underline">
            Crie uma aqui
          </a>
        </p>
      </div>
    </div>
  );
}
