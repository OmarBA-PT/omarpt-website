import React from 'react';
import type { PropsWithChildren } from 'react';
import Heading from './Heading';

const Title = ({ children }: PropsWithChildren) => {
  return (
    <Heading
      level='h1'
      className='text-h6 md:text-h4 lg:text-h2 font-semibold text-slate-800 text-pretty max-w-3xl'>
      {children}
    </Heading>
  );
};

export default Title;
