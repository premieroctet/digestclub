import { routes } from '@/core/constants';
import Link from 'next/link';
import Logo from './Logo';
import NavList from './NavList';

export default function HeaderSkeleton() {
  return (
    <div className="flex items-center bg-white relative z-50">
      <div className="max-w-screen-xl w-full p-4 mx-auto flex justify-between items-center">
        <div className="flex flex-row gap-8 items-center">
          <Link className="hidden sm:flex" href={routes.HOME}>
            <Logo />
          </Link>
          <NavList />
        </div>
        <div className=" flex flex-row items-center"></div>
      </div>
    </div>
  );
}
