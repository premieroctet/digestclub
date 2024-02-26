import { mainNavigation } from '@/core/constants';
import Link from 'next/link';
import { PropsWithChildren, memo } from 'react';
import Logo from '../layout/Logo';

const ListSection = ({
  title,
  children,
}: PropsWithChildren & { title: string }) => {
  return (
    <section className="flex h-full flex-1 sm:flex-initial">
      <div className="py-6 xs:py-0">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="bg-white w-10 h-0.5 mb-3" />
        <ul className="flex flex-col items-start gap-2 text-sm">{children}</ul>
      </div>
    </section>
  );
};

const HomeFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-black py-12 text-white px-8 lg:px-4">
      <div className="max-w-5xl flex flex-col m-auto xs:flex-row">
        <section className="flex-1">
          <div className="flex flex-col">
            <Logo className="text-white" isWhite />
            <Link href="https://www.premieroctet.com/" target="_blank">
              <span className="text-sm mt-2">
                Premier Octet © {currentYear}
              </span>
            </Link>
          </div>
        </section>
        <div className="flex flex-row gap-8 flex-1 justify-start xs:justify-end">
          <ListSection title="Navigation">
            {mainNavigation.map((item) => (
              <li key={item.route}>
                <Link href={item.route}>{item.label}</Link>
              </li>
            ))}
          </ListSection>
          <ListSection title="Social">
            <li>
              <Link href="https://twitter.com/DigestClub" target="_blank">
                Twitter
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/premieroctet/digestclub"
                target="_blank"
              >
                GitHub
              </Link>
            </li>
          </ListSection>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeFooter);
