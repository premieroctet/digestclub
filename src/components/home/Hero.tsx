import { routes } from '@/core/constants';
import { getCurrentUser } from '@/lib/sessions';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../Button';

export default function Hero({ isConnected }: { isConnected: boolean }) {
  return (
    <div className=" p-4 m-auto max-w-5xl pt-10 pb-20 text-gray-900 w-full h-full flex max-lg:flex-col">
      <section className="flex justify-center lg:text-start text-center flex-col flex-1 h-full">
        <h1 className=" leading-[1.1] text-4xl xl:text-6xl font-black ">
          The Frontpage of Teams Knowledge
        </h1>
        <h2 className="mt-4 text-2xl font-[300]">
          {"Save and share your team's curation"}
        </h2>
        <div className="pt-10 justify-center lg:justify-start flex">
          {isConnected ? (
            <Link href="/teams">
              <Button type="button" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href={routes.LOGIN}>
              <Button type="button" size="lg">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </section>
      <section className="flex-1 flex justify-center lg:justify-end max-lg:mt-12">
        <Image
          priority
          src="/hero.svg"
          className=" object-cover h-auto relative w-full max-w-[496px]"
          width={100}
          height={0}
          alt="Hero svg"
        />
      </section>
    </div>
  );
}
