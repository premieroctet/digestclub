import Hero from '@/components/home/Hero';
import HomeFooter from '../home/HomeFooter';
import HomeSteps from '../home/HomeSteps';
import { Session } from 'next-auth';
import HomeDigests from '../home/HomeDigests';

const Homepage = ({ user }: { user?: Session['user'] }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <section className="bg-white flex flex-1 justify-center">
        <Hero isConnected={Boolean(user)} />
      </section>
      <section className="flex-1 flex justify-center pb-8 bg-slate-100">
        <HomeSteps />
      </section>
      <section className="bg-white flex flex-1 justify-center">
        <HomeDigests />
      </section>
      <HomeFooter />
    </div>
  );
};

export default Homepage;
