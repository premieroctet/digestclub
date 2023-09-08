import React from 'react';

export default function Divider() {
  return (
    <div className="relative py-2 h-[1px]">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <hr className="w-full border-t border-gray-200" />
      </div>
    </div>
  );
}
