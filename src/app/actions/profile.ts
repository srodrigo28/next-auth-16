'use server';

// MUDANÇA AQUI: Importa a função específica para actions.
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  // MUDANÇA AQUI: Usa a função específica para actions.
  const supabase = createSupabaseServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'Usuário não autenticado.' } };
  }

  const nome = formData.get('nome') as string;
  const telefone = formData.get('telefone') as string;
  const avatarFile = formData.get('avatar') as File;
  const email = formData.get('email') as string;

  const profileData: { nome: string; telefone: string; email: string; avatar_url?: string } = {
    nome,
    telefone,
    email: email
  };

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `perfil/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('box') // Lembre-se de usar o nome correto do seu bucket
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return { error: { message: 'Erro ao fazer upload da imagem.' } };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('box')
      .getPublicUrl(filePath);
      
    profileData.avatar_url = publicUrl;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);

  if (updateError) {
    console.error('Erro ao atualizar perfil:', updateError);
    return { error: { message: 'Erro ao atualizar o perfil.' } };
  }

  revalidatePath('/dashboard');
  return { success: true };
}