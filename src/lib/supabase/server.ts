import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente para uso EXCLUSIVO em Server Components (somente leitura de cookies).
 * Use este em Pages, Layouts e outros Componentes de Servidor.
 */
export function createSupabaseServerComponentClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Apenas o método 'get' é fornecido, tornando-o somente leitura.
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );
}

/**
 * Cliente para uso EXCLUSIVO em Server Actions e Route Handlers (leitura e escrita).
 * Use este em seus arquivos dentro de `app/actions`.
 */
export function createSupabaseServerActionClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          (await cookieStore).set({ name, value: '', ...options });
        },
      },
    }
  );
}