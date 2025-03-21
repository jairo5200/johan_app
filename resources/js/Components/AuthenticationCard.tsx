import React, { PropsWithChildren } from 'react';
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo';

export default function AuthenticationCard({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center px-4 pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <div className='animate-small-flicker relative rounded-full animate-flicker'>
        <div className='relative z-40 p-4'>
          <AuthenticationCardLogo />
        </div>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800  overflow-hidden sm:rounded-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 pt-4 border-2 border-gray-400 shadow-blue-500/50">
        {children}
      </div>
    </div>
  );
}
