'use client';

import { useRef } from 'react';
import { useUserStore } from './userStore';
import { Profile } from '@/lib/types/user';

// Este componente não renderiza nada. Sua única função é popular a store.
function StoreInitializer({ profile }: { profile: Profile }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useUserStore.setState({ profile });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;