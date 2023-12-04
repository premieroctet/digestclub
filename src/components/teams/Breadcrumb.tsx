import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

type Props = {
  paths?: {
    name: string;
    href?: string;
  }[];
};

export const Breadcrumb = ({ paths }: Props) => {
  return (
    <nav className="flex my-5" aria-label="Breadcrumb">
      {paths && paths?.length > 1 && (
        <ol role="list" className="flex items-center space-x-4">
          {paths.map((path, index) => (
            <li key={path.name}>
              <div className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                {path.href ? (
                  <Link
                    href={path.href}
                    className={clsx(
                      'text-md font-medium text-gray-500 hover:text-gray-700',
                      index > 0 ? 'ml-3' : 'ml-0'
                    )}
                    aria-current={
                      index === paths.length - 1 ? 'page' : undefined
                    }
                  >
                    {path.name}
                  </Link>
                ) : (
                  <span
                    className="ml-3 text-md font-medium text-gray-500"
                    aria-current={
                      index === paths.length - 1 ? 'page' : undefined
                    }
                  >
                    {path.name}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};
