'use client';

import { Profile } from '@/lib/types/user';
import { useState } from 'react';
import { updateProfile } from '../actions/profile';
import Image from 'next/image';

// Este componente recebe os dados do perfil atual como 'props'
export default function EditProfileForm({ profile }: { profile: Profile }) {
  // Estado para mostrar mensagens de sucesso ou erro para o usuário
  const [message, setMessage] = useState<string | null>(null);
  // Estado para a pré-visualização do avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);

  // Função para atualizar a pré-visualização quando o usuário escolhe uma nova imagem
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Atualizando...');
    
    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
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
            src={avatarPreview || '/default-avatar.png'} // Adicione uma imagem padrão em /public
            alt="Avatar atual"
            width={96}
            height={96}
          />
        </div>
        <label className="block">
          <span className="sr-only">Escolha uma foto de perfil</span>
          <input
            type="file"
            name="avatar"
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg"
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
        <input
          type="text"
          name="nome"
          id="nome"
          defaultValue={profile.nome || ''}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          name="telefone"
          id="telefone"
          defaultValue={profile.telefone || ''}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <button type="submit" className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Salvar Alterações
        </button>
      </div>
      
      {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
    </form>
  );
}