import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main className="p-4 max-w-screen-xl mx-auto w-full max-h-full h-full">
      {children}
    </main>
  );
};

export default Layout;
