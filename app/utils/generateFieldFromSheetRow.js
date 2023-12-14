const rowTypes = {
  text: 'text',
  'fill-in': 'fill-in',
  'single-select': 'single-select',
  condition: 'condition',
  therapy: 'therapy',
};

export const generateFieldFromInputSheet = (row) => {
  const type = row[2];
  switch (type) {
    case rowTypes.text:
      return {
        screen: row[0],
        type: +row[0] === 1 ? 'welcome-text' : rowTypes[type],
        text: row[4],
      };

    case rowTypes['fill-in']:
      return {
        screen: row[0],
        type: rowTypes[type],
        questionId: row[3],
        label: row[4],
      };
    case rowTypes['single-select']:
      return {
        screen: row[0],
        type: rowTypes[type],
        label: row[4],
        questionId: row[3],
        options: row
          .splice(5, row.length)
          .map((item, i) => ({ value: item, label: item })),
      };
    case rowTypes.condition:
      return {
        screen: row[0],
        type: rowTypes[type],
        label: row[4],
        questionId: row[3],
        options: row
          .splice(5, row.length)
          .map((item) => ({ value: item, label: item })),
      };

    default:
      break;
  }
};
