import React from 'react';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0B2E] to-[#392064] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}