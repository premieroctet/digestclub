import React from 'react';

interface IProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionContainer = ({ title, children, className = '' }: IProps) => (
  <div
    className={`flex flex-col p-5 bg-white rounded-lg shadow-md ${className}`}
  >
    {/* {title && <h2 className="font-bold text-3xl">{title}</h2>} */}
    <div className="mt-2">{children}</div>
  </div>
);

export default SectionContainer;
