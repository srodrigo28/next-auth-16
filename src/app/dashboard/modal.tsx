'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop (fundo semi-transparente)
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
    >
      {/* Conteúdo do Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Evita que o clique dentro do modal o feche
        className="bg-white rounded-lg shadow-xl p-6 z-50 w-full max-w-md relative"
      >
        {/* Botão para fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          &times; {/* Símbolo de 'X' */}
        </button>
        {children}
      </div>
    </div>
  );
}