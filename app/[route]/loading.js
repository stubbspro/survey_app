import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div>
      <Loader2 className='ml-2 h-4 w-4 animate-spin' />
    </div>
  );
};

export default Loading;
