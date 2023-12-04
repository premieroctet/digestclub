import React from 'react';

export default function TeamMenuContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-4 max-w-[600px]">{children}</div>;
}
