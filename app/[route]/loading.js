import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className='w-[100%] h-[100vh] flex items-center justify-center'>
      <Loader2 className='h-20 w-20 animate-spin' />
    </div>
  );
};

export default Loading;
