// src/components/ClientOnly.tsx
import { useEffect, useState, type ReactNode } from 'react';

export function ClientOnly({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null; // SSR-en nem renderelünk semmit
  return <>{children}</>;
}
