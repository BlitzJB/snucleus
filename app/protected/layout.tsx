import { ReactNode } from 'react';
import { protectRoute } from '../lib/authUtils';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await protectRoute();

  return <>{children}</>;
}
