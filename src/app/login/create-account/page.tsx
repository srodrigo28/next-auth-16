'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signup, type AuthFormState } from '@/app/actions/auth';
import { User, Mail, Phone, Lock } from 'lucide-react'; // ícones

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-400 transition disabled:bg-gray-600"
    >
      {pending ? 'Criando conta...' : 'Criar Conta'}
    </button>
  );
}

export default function CreateAccountPage() {
  const router = useRouter();
  const initialState: AuthFormState = { success: false, message: '' };
  const [state, formAction] = useFormState(signup, initialState);
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setTelefone(value);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-10">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Criar Conta
        </h1>
        
        {state.message && (
          <div 
            className={`mb-4 p-3 rounded-lg text-center text-sm ${
              state.success 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-red-600/20 text-red-400'
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-300 mb-1">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                id="nome" 
                name="nome" 
                type="text" 
                required 
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" 
                placeholder="Seu nome completo"
              />
            </div>
          </div>

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
            <label htmlFor="telefone" className="block text-sm font-semibold text-gray-300 mb-1">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                id="telefone" 
                name="telefone" 
                type="tel" 
                required 
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition" 
                placeholder="(99) 99999-9999"
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

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-400 font-semibold hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
