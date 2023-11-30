import LoginForm from '@/components/auth/LoginForm';
import { routes } from '@/core/constants';
import { getSession } from '@/lib/sessions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Login',
};

const Login = async () => {
  const session = await getSession();

  if (session) {
    redirect(routes.TEAMS);
  }

  return <LoginForm />;
};

export default Login;
