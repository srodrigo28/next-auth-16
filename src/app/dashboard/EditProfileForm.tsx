'use client';

import { Profile } from '@/lib/types/user';
import { useState } from 'react';
import { updateProfile } from '../actions/profile';
import Image from 'next/image';

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const [message, setMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);

  const [telefone, setTelefone] = useState(() => {
    if (!profile.telefone) return '';
    const digits = profile.telefone.replace(/\D/g, '');
    if (digits.length > 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    if (digits.length > 6) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    if (digits.length > 2) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length > 0) return `(${digits}`;
    return '';
  });

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

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Atualizando...');
    
    const formData = new FormData(event.currentTarget);
    formData.set('telefone', telefone);

    const result = await updateProfile(formData);

    if (result.error) {
      setMessage(`Erro: ${result.error.message}`);
    } else {
      setMessage('Perfil atualizado com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-96 flex flex-col bg-slate-800 px-10 py-5 rounded-xl">
      <div className="shrink-0 mx-auto">
        <Image
          className="h-44 w-44 object-cover rounded-full"
          src={avatarPreview || '/default-avatar.png'}
          alt="Avatar atual"
          width={200}
          height={200}
        />
      </div>

      <div className="flex items-center space-x-6">
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
        <label htmlFor="nome" className="block text-sm font-medium text-gray-200">Nome</label>
        <input
          type="text"
          name="nome"
          id="nome"
          defaultValue={profile.nome || ''}
          required
          className="mt-1 block text-slate-200 tracking-wider w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-200">Telefone</label>
        <input
          type="tel"
          name="telefone"
          id="telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          required
          maxLength={15}
          className="mt-1 block text-slate-200 tracking-wider w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar Alterações
        </button>
      </div>
      
      {message && <p className="text-center text-sm text-gray-400 mt-4">{message}</p>}
    </form>
  );
}
