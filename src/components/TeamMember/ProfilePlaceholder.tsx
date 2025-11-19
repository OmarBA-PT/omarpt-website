import React from 'react';
import { UserIcon } from '@sanity/icons';

const ProfilePlaceholder = () => {
  return (
    <div className='w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
      <UserIcon className='w-1/2 h-1/2 text-gray-400 dark:text-gray-500' />
    </div>
  );
};

export default ProfilePlaceholder;
