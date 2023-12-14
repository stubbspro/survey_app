import React from 'react';
import getMasterGoogleSpreadsheetsRows from '@/app/services/getMasterGoogleSpreadsheetsRows';
import ClientForm from '@/components/ClientForm';

export default async function SurveyPage(props) {
  const route = props.params?.route;

  const { data, userId, surveySpreadsheetId, screensInfo, totalScreens } =
    await getMasterGoogleSpreadsheetsRows(route);

  return (
    <main className='flex flex-col justify-between h-[100%] pb-[10px] px-[28px] pt-[36px] sm:pb-[10px] sm:px-[28px] sm:pt-[36px]'>
      <ClientForm
        data={data}
        userId={userId}
        surveySpreadsheetId={surveySpreadsheetId}
        screensInfo={screensInfo}
        totalScreens={totalScreens}
      />
    </main>
  );
}
