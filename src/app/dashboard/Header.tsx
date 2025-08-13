import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import { logout } from "../actions/auth"; // 1. O Header (servidor) importa a action

export default async function Header() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Meu Painel</h1>
        <div className="flex items-center space-x-4">
          <span>Olá, {user?.email}</span>
          
          {/* 2. A action 'logout' é passada como prop para o botão */}
          <LogoutButton logoutAction={logout} />

        </div>
      </div>
    </header>
  );
}