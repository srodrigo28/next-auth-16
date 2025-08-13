import { logout } from "@/app/actions/auth";
import LogoutButton from "./logout-button";

interface HeaderProps {
  title?: string;
  userEmail?: string | null;
}

export default function Header({ title = "Meu Painel", userEmail }: HeaderProps) {
  return (
    <header
      className="w-full bg-gray-800 text-white p-4 shadow-md"
      aria-label={`Cabeçalho do ${title}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center space-x-4">
          {userEmail && <span>Olá, {userEmail}</span>}
          <LogoutButton logoutAction={logout} />
        </div>
      </div>
    </header>
  );
}
