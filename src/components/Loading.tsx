import React from 'react';
import Loader from './Loader';

interface ILoading {
  isLoading: boolean;
  children: React.ReactNode;
  fullPage?: boolean;
}
const Loading = ({ isLoading, children, fullPage = false }: ILoading) => {
  if (isLoading) return <Loader fullPage={fullPage} />;
  return <>{children}</>;
};

export default Loading;
