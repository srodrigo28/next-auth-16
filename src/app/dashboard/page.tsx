import { redirect } from 'next/navigation';
// MUDANÇA AQUI: Importando a função correta para Componentes de Servidor.
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import Header from './Header';
import EditProfileForm from './edit-profile-form';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // MUDANÇA AQUI: Usando a função correta para Componentes de Servidor.
  const supabase = createSupabaseServerComponentClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
     console.error(`Perfil não encontrado para o usuário: ${user.id}. Redirecionando...`);
     // Se o perfil não for encontrado, um simples redirect é a ação mais limpa.
     // O middleware garantirá que a sessão seja tratada na próxima navegação.
     redirect('/login?message=Perfil não encontrado. Por favor, faça o login novamente.');
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-8">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
          <EditProfileForm profile={profile} />
        </div>
      </main>
    </div>
  );
}