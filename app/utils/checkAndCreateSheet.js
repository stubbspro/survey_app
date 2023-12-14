export const checkAndCreateSheet = async (
  googlesheets,
  spreadsheetId,
  sheetNameToCheck
) => {
  try {
    const sheetExists = await doesSheetExist(
      googlesheets,
      spreadsheetId,
      sheetNameToCheck
    );

    if (!sheetExists) {
      await createSheet(googlesheets, spreadsheetId, sheetNameToCheck);
    }
  } catch (error) {
    console.error('checkAndCreateSheet error:', error);
  }
};

const createSheet = async (googlesheets, spreadsheetId, sheetName) => {
  try {
    const sheetProperties = {
      title: sheetName,
    };

    await googlesheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: sheetProperties,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error('create sheet error:', error);
    throw error;
  }
};

const doesSheetExist = async (googlesheets, spreadsheetId, sheetName) => {
  try {
    const response = await googlesheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    const sheetsInfo = response.data.sheets;
    return sheetsInfo.some((sheet) => sheet.properties.title === sheetName);
  } catch (error) {
    console.error('check sheet exist error', error);
    throw error;
  }
};
