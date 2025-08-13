'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signup, type AuthFormState } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
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
    let value = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>
        
        {state.message && (
          <div 
            className={`mb-4 p-3 rounded-md text-center text-sm ${
              state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-black" htmlFor="nome">Nome</label>
            <input 
              id="nome" 
              name="nome" 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg text-black" 
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 border rounded-lg text-black" 
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black" htmlFor="telefone">Telefone</label>
            <input 
              id="telefone" 
              name="telefone" 
              type="tel" 
              required 
              className="w-full px-3 py-2 border rounded-lg text-black" 
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black" htmlFor="password">Senha</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 border rounded-lg text-black" 
            />
          </div>
          <SubmitButton />
        </form>
        <p className="mt-6 text-center text-sm">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
