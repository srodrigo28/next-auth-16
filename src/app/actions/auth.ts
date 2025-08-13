'use server';

// MUDANÇA AQUI: Importa a função específica para actions.
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AuthFormState {
  success: boolean;
  message: string;
}

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  // MUDANÇA AQUI: Usa a função específica para actions.
  const supabase = createSupabaseServerActionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro de Login:', error.message);
    return {
      success: false,
      message: 'Credenciais inválidas. Tente novamente.',
    };
  }
  return {
    success: true,
    message: 'Login realizado com sucesso!',
  };
}

export async function signup(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const password = formData.get('password') as string;
  // MUDANÇA AQUI: Usa a função específica para actions.
  const supabase = createSupabaseServerActionClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome, telefone } },
  });

  if (error) {
    console.error('Erro de Cadastro:', error.message);
    return {
      success: false,
      message: 'Não foi possível completar o cadastro. Tente outro e-mail.',
    };
  }
  
  return {
    success: true,
    message: 'Cadastro realizado com sucesso! Redirecionando...',
  };
}

export async function logout() {
  // MUDANÇA AQUI: Usa a função específica para actions.
  const supabase = createSupabaseServerActionClient();
  await supabase.auth.signOut();
  return redirect('/login');
}