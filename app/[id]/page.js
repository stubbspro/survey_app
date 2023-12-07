'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SurveyPage = () => {
  const { id } = useParams();
  return (
    <div>
      {id}
      <Button variant='default'>руддщ</Button>
      <p className='text-red'>helo</p>
    </div>
  );
};

export default SurveyPage;
