export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isValidAdminToken } from '@/lib/constants';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import { AdminRealtimeProvider } from './context/AdminRealtimeProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = isValidAdminToken(token);

  // If not authenticated, show children (login page) without sidebar
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated - show sidebar layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminRealtimeProvider>
        <AdminSidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <AdminTopBar />
          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">{children}</main>
        </div>
      </AdminRealtimeProvider>
    </div>
  );
}
