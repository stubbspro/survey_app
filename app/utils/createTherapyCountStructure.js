export const createTherapyCountStructure = async (
  googleSheets,
  primaryInputName,
  therapyInputName,
  therapyCountName,
  surveySpreadsheetId,
  auth
) => {
  const getInputTherapySheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: therapyInputName,
  });
  const therapiesData = getInputTherapySheet.data.values;
  const therapiesIds = therapiesData.map((row) => row[0]);

  const getSurveyInputSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: surveySpreadsheetId,
    range: primaryInputName,
  });

  const primaryInputData = getSurveyInputSheet.data.values;
  const conditionsRow = primaryInputData.find((row) => row[3] === '$CONDITION');
  const conditions = conditionsRow.slice(5, conditionsRow.length);
  const therapiesRowToAdd = therapiesIds
    .slice(1, therapiesIds.length)
    .map((row) => [row]);

  const initStructure = [
    [
      'Last one shown',
      ...Array.from({ length: conditions.length }, () => '$Therapy ID'),
    ],
    ['Therapy ID', ...conditions],
    ...therapiesRowToAdd,
  ];

  await googleSheets.spreadsheets.values.update({
    spreadsheetId: surveySpreadsheetId,
    range: therapyCountName,
    valueInputOption: 'RAW',
    resource: {
      values: initStructure,
    },
  });
};
