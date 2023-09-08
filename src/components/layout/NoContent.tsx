import React, { ReactNode } from 'react';

interface IProps {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
}
const NoContent = ({ icon, title, subtitle }: IProps) => (
  <div className="py-10 w-full flex justify-center items-center">
    <div className="space-y-2 flex justify-center flex-col items-center">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-200 text-3xl">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      {subtitle && (
        <p className="text-center max-w-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  </div>
);

export default NoContent;
