export const findTherapiesForUser = (therapiesArray, lastShown, screens) => {
  const startIndex = therapiesArray.findIndex(
    (therapyRow) => therapyRow[0] === lastShown
  );

  if (startIndex === -1) {
    return [];
  }

  const result = [];
  let currentIndex = startIndex + 1;

  while (result.length < screens) {
    result.push(therapiesArray[currentIndex % therapiesArray.length]);
    currentIndex++;
  }

  return result;
};
