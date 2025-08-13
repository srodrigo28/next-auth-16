#### Dependências
npm install @supabase/supabase-js @supabase/ssr zustand

supabase github: rodrigoexer5

#### .env

NEXT_PUBLIC_SUPABASE_URL=https://SUA_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON

####    Passo 1: banco
💾 Passo 1: Configuração do Banco de Dados Supabase
Esta é a base de tudo. Precisamos de uma tabela profiles para guardar os dados extras do usuário.

Vá para o SQL Editor no seu painel do Supabase e execute os seguintes scripts:

Criar a tabela profiles:
Esta tabela irá armazenar nome, telefone e uma URL para o avatar. Ela é ligada ao usuário da autenticação pelo id.

##### SQL

-- Tabela para guardar os perfis dos usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  telefone TEXT,
  avatar_url TEXT
);

##### Opcional

```
-- Altera a tabela para que novos usuários possam ler
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
Criar Políticas de Acesso (RLS - Row Level Security):
Isso garante que um usuário só possa ver e editar o seu próprio perfil. É crucial para a segurança!

SQL

-- Política para permitir que usuários insiram seu próprio perfil
CREATE POLICY "Allow users to insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Política para permitir que usuários leiam seu próprio perfil
CREATE POLICY "Allow users to read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
(Opcional, mas recomendado) Criar Trigger para autoinserção:
Este trigger cria automaticamente uma linha na tabela profiles sempre que um novo usuário se cadastra na auth.users, simplificando nosso código de signup.

SQL

-- Função que será chamada pelo trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (new.id, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'telefone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- O trigger que chama a função acima após cada novo cadastro
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
Storage para Avatares:
No painel do Supabase, vá para Storage, crie um novo Bucket chamado avatars e torne-o público.
```
#### 📚 Passo 2: Configurando o Cliente Supabase e Tipos
lib/types/user.ts

> TypeScript
```
export interface Profile {
  id: string;
  nome: string | null;
  telefone: string | null;
  avatar_url: string | null;
}
```

> lib/supabase/client.ts (Cliente para o Lado do Navegador)

TypeScript
```
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```
#### 🧠 Passo 3: Gerenciamento de Estado com Zustand
Simples e direto, para guardar os dados do perfil do usuário no cliente.

stores/userStore.ts

TypeScript
```
import { create } from 'zustand';
import { Profile } from '@/lib/types/user';

interface UserState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
```

##### 🔐 Passo 4: Funções de Autenticação (Server Actions)
Em vez de app/login/login.ts, criaremos um arquivo de Server Actions. É o padrão moderno do Next.js para executar código de servidor a partir de componentes de cliente.

app/actions/auth.ts

TypeScript

```
'use server';

import { createServerActionClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passamos os dados extras aqui, que o nosso trigger vai usar
      data: {
        nome,
        telefone,
      },
    },
  });

  if (error) {
    return { error: { message: error.message } };
  }
  
  // Para fins de treinamento, redirecionamos para uma página de sucesso/verificação
  // Em um app real, você enviaria um e-mail de confirmação.
  revalidatePath('/', 'layout');
  redirect('/dashboard'); 
}
```
#### 🖥️ Passo 5: Páginas de Login e Criação de Conta
app/login/page.tsx

TypeScript

```
'use client';

import { login } from '@/app/actions/auth';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold" htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Entrar
          </button>
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
```

##### app/login/create-account/page.tsx

```
'use client';

import { signup } from '@/app/actions/auth';
import { useState } from 'react';

export default function CreateAccountPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="nome">Nome</label>
            <input id="nome" name="nome" type="text" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="telefone">Telefone</label>
            <input id="telefone" name="telefone" type="tel" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold" htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Criar Conta
          </button>
           <p className="mt-6 text-center text-sm">
            Já tem conta?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Faça login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
```
#### 🛡️ Passo 6: Protegendo Rotas com Middleware
Este arquivo garante que apenas usuários logados possam acessar o dashboard.

> * middleware.ts (na raiz do projeto, junto com app)

```
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Se o usuário não está logado e tenta acessar o dashboard, redireciona para login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```
####    Passo 7: Dashboard e Edição de Perfil
Server Action para atualizar o perfil

app/actions/profile.ts

TypeScript

```
'use server';

import { createServerActionClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const nome = formData.get('nome') as string;
  const telefone = formData.get('telefone') as string;
  const avatarFile = formData.get('avatar') as File;

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: 'Usuário não autenticado.' } };
  }

  const profileData: { nome: string; telefone: string; avatar_url?: string } = {
    nome,
    telefone,
  };

  // Upload de Avatar
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile);

    if (uploadError) {
      return { error: { message: `Erro no upload: ${uploadError.message}` } };
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    profileData.avatar_url = publicUrl;
  }

  // Atualiza a tabela 'profiles'
  const { error: updateError } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);

  if (updateError) {
    return { error: { message: `Erro ao atualizar perfil: ${updateError.message}` } };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
```

> * app/dashboard/page.tsx

```
import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Profile } from '@/lib/types/user';
import EditProfileForm from './edit-profile-form';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  let profile: Profile | null = null;
  if (session) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data;
  }

  return (
    <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="mb-8 text-lg">Bem-vindo, {profile?.nome || session?.user.email}!</p>

        <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
            {profile && <EditProfileForm profile={profile} />}
        </div>
    </div>
  );
}
```

> * app/dashboard/edit-profile-form.tsx (Componente do formulário)

```
'use client';

import { Profile } from '@/lib/types/user';
import { useState } from 'react';
import { updateProfile } from '../actions/profile';
import Image from 'next/image';

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const [message, setMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Atualizando...');
    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
        setMessage(`Erro: ${result.error.message}`);
    } else {
        setMessage('Perfil atualizado com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
            <div className="shrink-0">
                <Image
                    className="h-24 w-24 object-cover rounded-full"
                    src={avatarUrl || '/default-avatar.png'} // Adicione uma imagem padrão em /public
                    alt="Avatar atual"
                    width={96}
                    height={96}
                />
            </div>
            <label className="block">
                <span className="sr-only">Escolha uma foto de perfil</span>
                <input type="file" name="avatar" onChange={handleAvatarChange}
                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
            </label>
        </div>
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" name="nome" id="nome" defaultValue={profile.nome || ''} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" name="telefone" id="telefone" defaultValue={profile.telefone || ''}
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <button type="submit" className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Salvar Alterações
          </button>
        </div>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </form>
  );
}
```