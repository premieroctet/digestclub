import { ReactNode } from 'react';

const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="font-bold text-3xl lg:text-4xl text-center flex flex-col max-w-2xl">
      {children}
    </h2>
  );
};

export default SectionTitle;
