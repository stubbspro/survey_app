'use client';
import React from 'react';
import { useParams } from 'next/navigation';

const SurveyPage = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default SurveyPage;
