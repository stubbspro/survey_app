export const generateUpdateRangeStringForTherapy = (
  sheetName,
  allHeaders,
  targetHeader,
  userRow
) => {
  const columnIndex = allHeaders.indexOf(targetHeader) + 1;

  if (columnIndex === 0) {
    return '';
  }

  const sheetRange = `${sheetName}!`;
  const rangeString = `${getColumnName(columnIndex)}${userRow}`;

  return `${sheetRange}${rangeString}`;
};

export const generateRangeString = (sheetName, columns, headers, userRow) => {
  const columnIndices = columns.map((column) => headers.indexOf(column) + 1);

  const minIndex = Math.min(...columnIndices);
  const maxIndex = Math.max(...columnIndices);

  const sheetRange = `${sheetName}!`;
  const rangeString = `${getColumnName(minIndex)}${userRow}:${getColumnName(
    maxIndex
  )}${userRow}`;

  return `${sheetRange}${rangeString}`;
};

export const getColumnName = (index) => {
  let columnName = '';
  while (index > 0) {
    const modulo = (index - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    index = Math.floor((index - 1) / 26);
  }
  return columnName;
};
