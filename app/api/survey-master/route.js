import path from 'path';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import {
  INPUT_PRIMARY_SHEET_NAME,
  INPUT_THERAPY_SHEETY_NAME,
  OUTPUT_RESULTS_SHEET_NAME,
} from '@/constants';
import { generateFieldFromInputSheet } from '@/app/utils/generateFieldFromSheetRow';
import { createScreensInfo } from '@/app/utils/createScreensInfo';
import { createHeaders } from '@/app/utils/createHeaders';
import { checkAndCreateSheet } from '@/app/utils/checkAndCreateSheet';

async function getMasterGoogleSpreadSheetRows(route) {
  const jsonPath = path.join(process.cwd(), 'credentials.json');

  const auth = new google.auth.GoogleAuth({
    keyFile: jsonPath,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: 'v4',
    auth: client,
  });

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId: process.env.MASTER_SPREADSHEET_ID,
  });

  const masterInputSheetName = metaData.data.sheets[0].properties.title;

  const getMasterInputSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.MASTER_SPREADSHEET_ID,
    range: masterInputSheetName,
  });

  const surveySpreadsheetRow = getMasterInputSheet?.data.values.find(
    (row) => row[0] === route
  );

  const [_, surveyName, surveySpreadsheetId] = surveySpreadsheetRow;

  if (!surveySpreadsheetRow) {
    throw new Error('Spreadsheet id is not found');
  }

  const getSurveyInputSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: INPUT_PRIMARY_SHEET_NAME,
  });

  await checkAndCreateSheet(
    googleSheets,
    surveySpreadsheetId,
    OUTPUT_RESULTS_SHEET_NAME
  );

  const getSurveyOutputSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: OUTPUT_RESULTS_SHEET_NAME,
  });

  const getInputTherapySheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: INPUT_THERAPY_SHEETY_NAME,
  });

  const data = getSurveyInputSheet.data.values;
  const outputData = getSurveyOutputSheet.data.values;
  const lastUserNumber = outputData
    ? outputData.slice(1, outputData.length).length
    : 0;

  const therapiesData = getInputTherapySheet.data.values;

  const screensInfo = createScreensInfo(data.filter((row) => row[0]));
  const totalScreens = Object.keys(screensInfo).length;

  if (!outputData) {
    const headers = createHeaders(
      data.slice(1, data.length).filter((row) => row[0] && row[3]),
      totalScreens,
      therapiesData
    );

    await googleSheets.spreadsheets.values.update({
      spreadsheetId: surveySpreadsheetId,
      range: OUTPUT_RESULTS_SHEET_NAME,
      valueInputOption: 'RAW',
      resource: {
        values: [headers],
      },
    });
  }

  const transformedData = data
    .slice(1, data.length) // REMOVE HEADERS
    .filter((row) => row[0])
    .map((row) => {
      const field = generateFieldFromInputSheet(row);
      return field;
    })
    .filter((item) => item)
    .reduce((acc, curr) => {
      (acc[+curr.screen] = acc[+curr.screen] || []).push(curr);
      return acc;
    }, {});

  return {
    data: transformedData,
    userId: +lastUserNumber === 0 ? 1 : +lastUserNumber + 1,
    surveySpreadsheetId,
    screensInfo,
    surveyName,
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
    const response = await getMasterGoogleSpreadSheetRows(
      req.nextUrl.searchParams.get('route')
    );

    return NextResponse.json(response);
  } catch (e) {
    console.log('survey-master-router-error:',e);
    return new NextResponse.json({}, {status:500});
  }
}
