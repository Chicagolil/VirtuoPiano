import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';
import { redirect } from 'next/navigation';
import AccountPage from '../../../features/account/AccountPage';

export default async function Account() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <AccountPage user={user.id} />;
}
