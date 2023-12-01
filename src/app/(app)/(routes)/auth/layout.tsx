import { ReactNode } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const features = [
    'Collect links',
    'Design your digest',
    'Share your digests with tech folks!',
  ];
  return (
    <div className="max-w-5xl mx-auto h-full flex">
      <div className="flex flex-col md:flex-row gap-8 w-full my-auto">
        <section className="flex flex-col flex-1">
          <span className="mb-4 text-5xl font-[900]">Join the Club 👋</span>
          <span className="mb-4 text-xl">
            Digest Club helps your team to share the knowledge!
          </span>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircleIcon className="h-6 w-6" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
        <section className="flex-1">
          <div className="shadow-xl p-10 bg-white rounded-xl">{children}</div>
        </section>
      </div>
    </div>
  );
}
