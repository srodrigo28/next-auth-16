'use client';

import { useState, ReactNode } from 'react';
import { Profile } from '@/lib/types/user';
import EditProfileForm from './EditProfileForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ProfileSection({ profile }: { profile: Profile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Componente interno do Modal
  function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-lg shadow-xl p-6 z-50 w-full max-w-md relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-200 hover:text-gray-800"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 bg-slate-500 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Informações do Perfil</h2>
          <p className="mt-2 text-gray-300">Nome: {profile.nome}</p>
          <p className="text-gray-300">Telefone: {profile.telefone}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Editar Perfil
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl text-slate-300 font-bold mb-6">Editar</h2>
        <EditProfileForm profile={profile} />
      </Modal>
    </>
  );
}
