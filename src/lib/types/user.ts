import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface UserProfile {
  user: User | null;
  profile: Profile | null;
}

export interface ProfileActionResult {
  success?: boolean;
  error?: { message: string };
}
