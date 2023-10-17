import { mainNavigation, routes } from '@/core/constants';
import { memo, PropsWithChildren } from 'react';
import Logo from '../layout/Logo';
import Link from 'next/link';

const MainSection = ({ children }: PropsWithChildren) => {
  return (
    <section className="xs:max-lg:row-span-2 lg:col-span-2 place-content-center">
      {children}
    </section>
  );
};

const ListSection = ({
  title,
  children,
}: PropsWithChildren & { title: string }) => {
  return (
    <section className="place-self-start lg:place-self-end flex h-full">
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
    <div className="bg-gray-900 py-12 text-white">
      <div className="max-w-5xl m-auto px-4 grid xs:grid-cols-2 lg:grid-cols-4 w-full gap-4">
        <MainSection>
          <div className="flex flex-col">
            <Logo className="text-white" />
            <Link href="https://www.premieroctet.com/" target="_blank">
              <span className="text-sm mt-2">
                Premier Octet © {currentYear}
              </span>
            </Link>
          </div>
        </MainSection>
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
            <Link href="https://github.com/premieroctet/digestclub" target="_blank">
              GitHub
            </Link>
          </li>
        </ListSection>
      </div>
    </div>
  );
};

export default memo(HomeFooter);
