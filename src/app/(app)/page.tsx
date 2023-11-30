import Homepage from '@/components/pages/Homepage';
import { getCurrentUser } from '@/lib/sessions';
export const dynamic = 'force-dynamic';

const Home = async () => {
  await getCurrentUser();
  return <Homepage />;
};

export default Home;
