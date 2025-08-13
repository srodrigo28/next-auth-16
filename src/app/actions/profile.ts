'use server';

import { createSupabaseServerActionClient, createSupabaseServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Profile, UserProfile, ProfileActionResult } from '@/lib/types/user';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getUserProfile(): Promise<UserProfile> {
  const supabase = createSupabaseServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

export async function updateProfile(formData: FormData): Promise<ProfileActionResult> {
  const supabase = createSupabaseServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: { message: 'Usuário não autenticado.' } };

  const nome = (formData.get('nome') as string)?.trim();
  const telefone = (formData.get('telefone') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const avatarFile = formData.get('avatar') as File | null;

  const profileData: Partial<Profile> = { nome, telefone, email };

  if (avatarFile && avatarFile.size > 0) {
    const uploadResult = await uploadAvatar(supabase, user.id, avatarFile);
    if (uploadResult.error) return uploadResult;
    profileData.avatar_url = uploadResult.url!;
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

async function uploadAvatar(supabase: SupabaseClient, userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `perfil/${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('box')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Erro no upload:', uploadError);
    return { error: { message: 'Erro ao fazer upload da imagem.' } };
  }

  const { data } = supabase.storage.from('box').getPublicUrl(filePath);
  return { url: data.publicUrl } as { url?: string; error?: { message: string } };
}
