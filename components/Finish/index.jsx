import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import getMasterGoogleSpreadsheetsRows from '@/app/services/getMasterGoogleSpreadsheetsRows';

const Finish = ({ handleTakeAnotherSurvey }) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data, userId, screensInfo, surveySpreadsheetId } =
        await getMasterGoogleSpreadsheetsRows(params.route);
      handleTakeAnotherSurvey({
        data,
        userId,
        screensInfo,
        surveySpreadsheetId,
      });
    } catch (error) {
      console.log('handle take another survey error:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-[100%] sm:min-h-[418px] max-w-[846px] mx-auto bg-content-wrapper-bg rounded-[6px] border-[1px] border-solid py-[32px] px-[42px] sm:p-[42px]'>
        <h1 className='text-[18px] sm:text-[26px] font-semibold text-dark-blue'>
          Thank you for your answers!{' '}
        </h1>
        <p className='mt-[30px] text-[16px] sm:text-[21px]'>
          You have completed the survey.
        </p>
        <p className='mt-[12px] text-[16px] sm:text-[21px]'>
          You can close the page or take a survey on a different topic by
          clicking the button below.
        </p>
      </div>
      <div className='flex justify-center items-end flex-1'>
        <Button onClick={handleClick} disabled={loading}>
          Take another survey
          {loading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </div>
    </>
  );
};

export default Finish;
