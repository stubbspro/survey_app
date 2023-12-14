import { OUTPUT_RESULTS_SHEET_NAME } from '@/constants';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import {
  generateRangeString,
  getColumnName,
} from '@/app/utils/generateRangeString';
import { updateCellValue } from '@/app/utils/updateCellValues';

async function updateSpreadSheetAfterFirstScreen({
  range,
  values,
  spreadsheetId,
}) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
      version: 'v4',
      auth: client,
    });

    await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: values,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

async function updateSpreadSheetAfterQuestionScreen({
  range,
  answers,
  spreadsheetId,
  userId,
  timeSpent,
  screen,
}) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
      version: 'v4',
      auth: client,
    });

    const getSurveyOutputSheet = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: OUTPUT_RESULTS_SHEET_NAME,
    });
    const outputData = getSurveyOutputSheet.data.values;
    let currentHeaders = outputData[0];

    const headersNamesToUpdate = Object.keys(answers);

    const spentTimeRangeString = `${range}!${getColumnName(
      screen + 1
    )}${userId}`;

    await updateCellValue(
      googleSheets,
      spentTimeRangeString,
      timeSpent,
      spreadsheetId
    );

    const rangeToUpdate = generateRangeString(
      range,
      headersNamesToUpdate,
      currentHeaders,
      userId
    );

    await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: rangeToUpdate,
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(answers)],
      },
    });
  } catch (e) {
    console.log(e);
  }
}

async function updateSpreadSheetAfterConditionScreen({
  range,
  spreadsheetId,
  userId,
  timeSpent,
  screen,
}) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
      version: 'v4',
      auth: client,
    });

    const rangeString = `${range}!${getColumnName(screen + 1)}${userId}`;
    await updateCellValue(googleSheets, rangeString, timeSpent, spreadsheetId);
  } catch (e) {
    console.log(e);
  }
}

export async function POST(req) {
  try {
    const { data } = await req.json();

    if (data.answerType === 'condition') {
      await updateSpreadSheetAfterConditionScreen({
        range: OUTPUT_RESULTS_SHEET_NAME,
        spreadsheetId: data.spreadsheetId,
        userId: data.userId + 1,
        timeSpent: data.timeSpent,
        screen: data.screen,
      });
    } else {
      if (data.screen === 1) {
        await updateSpreadSheetAfterFirstScreen({
          range: OUTPUT_RESULTS_SHEET_NAME,
          values: [[data.userId, data.timeSpent]],
          spreadsheetId: data.spreadsheetId,
        });
      } else {
        await updateSpreadSheetAfterQuestionScreen({
          range: OUTPUT_RESULTS_SHEET_NAME,
          answers: data.answers,
          spreadsheetId: data.spreadsheetId,
          userId: data.userId + 1,
          timeSpent: data.timeSpent,
          screen: data.screen,
        });
      }
    }

    return NextResponse.json({ message: 'ok' });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: 'not ok' });
  }
}
