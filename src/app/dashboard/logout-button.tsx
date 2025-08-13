'use client';

// Ação de logout agora é recebida como uma propriedade (prop)
export default function LogoutButton({ logoutAction }: { logoutAction: () => Promise<never> }) {
  return (
    // Usa a ação recebida na prop
    <form action={logoutAction}>
      <button
        type="submit"
        className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600"
      >
        Sair
      </button>
    </form>
  );
}