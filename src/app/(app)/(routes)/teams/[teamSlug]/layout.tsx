import authOptions from '@/app/api/auth/[...nextauth]/options';
import { getCurrentUser } from '@/lib/sessions';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages!.signIn!);
  }

  return children as JSX.Element;
}
