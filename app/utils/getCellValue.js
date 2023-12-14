export const getCellValue = async (googlesheets, range, spreadsheetId) => {
  try {
    const response = await googlesheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range,
    });

    let value;
    if (response.data.values?.[0]?.[0]) {
      value = response.data.values[0][0];
    } else {
      value = '';
    }

    return value;
  } catch (error) {
    console.error(
      `Error getting cell value on range ${range}: ${error.message}`
    );
    return null;
  }
};
