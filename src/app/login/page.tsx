'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { login, type AuthFormState } from '@/app/actions/auth';

/**
 * Um componente interno para o botão de submit.
 * Ele usa o hook `useFormStatus` para saber quando o formulário está sendo enviado,
 * mostrando um feedback de "carregando" para o usuário.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}


/**
 * A página de Login principal, agora como um Client Component.
 */
export default function LoginPage() {
  const router = useRouter();
  
  // Define o estado inicial do formulário.
  const initialState: AuthFormState = { success: false, message: '' };
  
  // Conecta a Server Action 'login' ao estado do nosso componente.
  const [state, formAction] = useFormState(login, initialState);

  // Este 'efeito' observa a variável 'state'. 
  // Se o login for bem-sucedido (state.success se torna true), ele redireciona o usuário.
  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {/* Exibe a mensagem de erro que vem do 'state' se o login falhar. */}
        {!state.success && state.message && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 text-center text-sm">
            {state.message}
          </div>
        )}

        {/* O formulário agora usa o 'formAction' fornecido pelo hook. */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm">
          Não tem uma conta?{' '}
          <a href="/login/create-account" className="text-blue-500 hover:underline">
            Crie uma aqui
          </a>
        </p>
      </div>
    </div>
  );
}