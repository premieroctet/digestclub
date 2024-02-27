import Hero from '@/components/home/Hero';
import { Session } from 'next-auth';
import HomeDigests from '../home/HomeDigests';
import HomeFeatures from '../home/HomeFeatures';
import HomeFooter from '../home/HomeFooter';
import HomeOpenSource from '../home/HomeOpenSource';
import HomeSteps from '../home/HomeSteps';

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
        <HomeFeatures />
      </section>
      <section className="bg-slate-100 flex flex-1 justify-center">
        <HomeDigests />
      </section>
      <section className="bg-white flex flex-1 justify-center">
        <HomeOpenSource />
      </section>
      <HomeFooter />
    </div>
  );
};

export default Homepage;
