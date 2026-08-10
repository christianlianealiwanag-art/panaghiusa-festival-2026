import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedRoute({ children } : { children: React.ReactNode }){
  const cookieStore = await cookies();
  const admin = cookieStore.get('admin_session');
  if (!admin) {
    redirect('/admin/login');
  }
  return <>{children}</>;
}
