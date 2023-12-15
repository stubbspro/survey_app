import React from 'react';
import getMasterGoogleSpreadsheetsRows from '@/app/services/getMasterGoogleSpreadsheetsRows';
import ClientForm from '@/components/ClientForm';
import Header from '@/components/Header';

export default async function SurveyPage(props) {
  const route = props.params?.route;

  const {
    data,
    userId,
    surveySpreadsheetId,
    screensInfo,
    totalScreens,
    surveyName,
  } = await getMasterGoogleSpreadsheetsRows(route);

  return (
    <>
      <Header survey={surveyName} />
      <main className='flex flex-col justify-between h-[100%] pb-[10px] px-[28px] pt-[36px] sm:pb-[10px] sm:px-[28px] sm:pt-[36px]'>
        <div className='w-[100%] max-w-[846px] mx-auto h-[100%] flex flex-col'>
          <ClientForm
            data={data}
            userId={userId}
            surveySpreadsheetId={surveySpreadsheetId}
            screensInfo={screensInfo}
            totalScreens={totalScreens}
          />
        </div>
      </main>
    </>
  );
}
