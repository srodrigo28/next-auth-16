import { create } from 'zustand';
import { Profile } from '@/lib/types/user';

interface UserState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));