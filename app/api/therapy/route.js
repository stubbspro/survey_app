import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import {
  ASSESMENTS_FOR_THERAPY,
  INPUT_PRIMARY_SHEET_NAME,
  INPUT_THERAPY_SHEETY_NAME,
  OTPUT_THERAPY_COUNT_SHEETY_NAME,
  OUTPUT_RESULTS_SHEET_NAME,
} from '@/constants';
import { checkAndCreateSheet } from '@/app/utils/checkAndCreateSheet';
import { createTherapyCountStructure } from '@/app/utils/createTherapyCountStructure';
import { findTherapiesForEmotion } from '@/app/utils/findTherapiesForEmotion';
import { getColumnName } from '@/app/utils/generateRangeString';
import { updateCellValue } from '@/app/utils/updateCellValues';
import { getCellValue } from '@/app/utils/getCellValue';
import { findTherapiesForUser } from '@/app/utils/findTherapiesForUser';

async function getTherapy(emotion, surveySpreadsheetId, therapyScreensCount) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: 'v4',
    auth: client,
  });

  const getListOfTherapies = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: INPUT_THERAPY_SHEETY_NAME,
  });

  const therapiesSheetData = getListOfTherapies.data.values;
  const therapiesList = therapiesSheetData
    .slice(1, therapiesSheetData.length)
    .map((row) => row[0]);
  const matchedTherapies = findTherapiesForEmotion(therapiesSheetData, emotion);
  const sheetName = OTPUT_THERAPY_COUNT_SHEETY_NAME;

  await checkAndCreateSheet(
    googleSheets,
    surveySpreadsheetId,
    OTPUT_THERAPY_COUNT_SHEETY_NAME
  );

  const getTherapyCountOuput = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: OTPUT_THERAPY_COUNT_SHEETY_NAME,
  });

  let therapyCountData = getTherapyCountOuput.data.values;
  let therapisToSend = [];
  if (!therapyCountData) {
    await createTherapyCountStructure(
      googleSheets,
      INPUT_PRIMARY_SHEET_NAME,
      INPUT_THERAPY_SHEETY_NAME,
      OTPUT_THERAPY_COUNT_SHEETY_NAME,
      surveySpreadsheetId,
      auth
    );

    const getTherapyCountOuput = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: surveySpreadsheetId,
      range: OTPUT_THERAPY_COUNT_SHEETY_NAME,
    });

    therapyCountData = getTherapyCountOuput.data.values;
    therapisToSend = matchedTherapies.slice(0, therapyScreensCount);
    const conditionIndex = therapyCountData[1].findIndex(
      (cell) => cell === emotion
    );

    if (conditionIndex !== -1) {
      const rangeString = `${sheetName}!${getColumnName(conditionIndex + 1)}1`;

      await updateCellValue(
        googleSheets,
        rangeString,
        matchedTherapies[0][0],
        surveySpreadsheetId
      );
    }
  } else {
    const conditionIndex = therapyCountData[1].findIndex(
      (cell) => cell === emotion
    );
    const rangeString = `${sheetName}!${getColumnName(conditionIndex + 1)}1`;

    const lastShownTherapy = await getCellValue(
      googleSheets,
      rangeString,
      surveySpreadsheetId
    );
    if (therapiesList.includes(lastShownTherapy)) {
      const sliceNumForTherapies =
        matchedTherapies.length > therapyScreensCount
          ? therapyScreensCount
          : matchedTherapies.length;
      therapisToSend = findTherapiesForUser(
        matchedTherapies,
        lastShownTherapy,
        sliceNumForTherapies
      );
    } else {
      therapisToSend = matchedTherapies.slice(0, therapyScreensCount);
    }
  }

  const therapiesScreenData = Array.from(
    { length: therapisToSend.length },
    (_, i) => {
      const therapy = therapisToSend[i];
      return [
        {
          type: 'text',
          text: `<p>Recall the last instance when you felt ${emotion} then please read the following emotional wellness guide.</p>`,
        },
        {
          type: 'divider',
        },
        {
          type: 'therapy-text',
          text: therapy[1],
        },
        {
          type: 'divider',
        },
        {
          type: 'therapy-assessment',
          text: `<p>On a scale of 1 to 5, where 1 is "not helpful at all" and 5 is "extremely helpful," how beneficial did you find this guide?</p>`,
        },
        {
          type: 'therapy-assessment-buttons',
          questionId: therapy[0],
          options: ASSESMENTS_FOR_THERAPY,
        },
      ];
    }
  );

  return {
    data: {
      therapiesScreenData,
    },
  };
}

export async function OPTIONS(request) {
  const allowedOrigin = request.headers.get('origin');
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Max-Age': '86400',
    },
  });

  return response;
}

export async function GET(req) {
  try {
    const response = await getTherapy(
      req.nextUrl.searchParams.get('emotion'),
      req.nextUrl.searchParams.get('surveySpreadsheetId'),
      req.nextUrl.searchParams.get('therapyScreensCount')
    );

    return NextResponse.json(response);
  } catch (e) {
    console.log('get-therapy-router-error:',e);
    return NextResponse.json({});
  }
}

export async function PUT(req) {
  try {
    const { data } = await req.json();

    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
      version: 'v4',
      auth: client,
    });

    const getTherapyCountOuput = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: data.spreadsheetId,
      range: OTPUT_THERAPY_COUNT_SHEETY_NAME,
    });
    const therapyCountData = getTherapyCountOuput.data.values;

    const therapyRowIndex = therapyCountData.findIndex(
      (row) => row[0] === data.currentTherapy
    );

    const condititonIndex = therapyCountData[1].findIndex(
      (cell) => cell === data.condition
    );

    const conditionRangeString = `${OTPUT_THERAPY_COUNT_SHEETY_NAME}!${getColumnName(
      condititonIndex + 1
    )}1`;

    const countRangeString = `${OTPUT_THERAPY_COUNT_SHEETY_NAME}!${getColumnName(
      condititonIndex + 1
    )}${therapyRowIndex + 1}`;

    const therapyCountValue = await getCellValue(
      googleSheets,
      countRangeString,
      data.spreadsheetId
    );

    await updateCellValue(
      googleSheets,
      countRangeString,
      (+therapyCountValue || 0) + 1,
      data.spreadsheetId
    );

    await updateCellValue(
      googleSheets,
      conditionRangeString,
      data.currentTherapy,
      data.spreadsheetId
    );

    const getSurveyOutputSheet = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: data.spreadsheetId,
      range: OUTPUT_RESULTS_SHEET_NAME,
    });
    const outputData = getSurveyOutputSheet.data.values;

    const currentOutputResultsHeaders = outputData[0];
    const therapyIndex = currentOutputResultsHeaders.findIndex(
      (cell) => cell === data.currentTherapy
    );

    const outputResultRangeString = `${OUTPUT_RESULTS_SHEET_NAME}!${getColumnName(
      therapyIndex + 1
    )}${+data.userId + 1}`;

    await updateCellValue(
      googleSheets,
      outputResultRangeString,
      data.assessment,
      data.spreadsheetId
    );

    const screenTimeRangeString = `${OUTPUT_RESULTS_SHEET_NAME}!${getColumnName(
      data.screen + 1
    )}${data.userId + 1}`;

    await updateCellValue(
      googleSheets,
      screenTimeRangeString,
      data.timeSpent,
      data.spreadsheetId
    );

    return NextResponse.json({ message: 'ok' });
  } catch (e) {
    console.log('put-therapy-router-error:',e);
    return NextResponse.json({ message: 'not ok' });
  }
}
