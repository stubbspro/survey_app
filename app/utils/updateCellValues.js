export const updateCellValue = async (googlesheets, range, value, id) => {
  const updateData = {
    values: [[value]],
  };

  try {
    await googlesheets.spreadsheets.values.update({
      spreadsheetId: id,
      range,
      valueInputOption: 'RAW',
      resource: updateData,
    });
  } catch (error) {
    console.error(`Error updating cell: ${error.message}`);
  }
};
