'use client';

import { useState } from 'react';
import { Profile } from '@/lib/types/user';
import Modal from './modal';
import EditProfileForm from './edit-profile-form';

export default function DashboardClient({ profile }: { profile: Profile }) {
  // Estado para controlar a visibilidade do modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Informações do Perfil</h2>
            <p className="mt-2 text-gray-600">Nome: {profile.nome}</p>
            <p className="text-gray-600">Telefone: {profile.telefone}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* O Modal que será exibido */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
        <EditProfileForm profile={profile} />
      </Modal>
    </>
  );
}