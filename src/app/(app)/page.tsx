import Homepage from '@/components/pages/Homepage';
import { getCurrentUser } from '@/lib/sessions';
export const dynamic = 'force-dynamic';

const Home = async () => {
  const user = await getCurrentUser();

  return <Homepage user={user} />;
};

export default Home;
