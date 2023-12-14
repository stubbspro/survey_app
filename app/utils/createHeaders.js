export const createHeaders = (array, totalScreens, therapiesData) => {
  const result = [];

  const therapiesIds = therapiesData
    .slice(1, therapiesData.length)
    .map((row) => row[0]);

  const staticHeaders = [
    'User',
    ...Array.from(
      { length: totalScreens },
      (_, index) => `Screen ${index + 1} Total Time`
    ),
  ];

  for (const subarray of array) {
    if (subarray[3] === '$CONDITION') {
      break;
    }

    result.push(subarray[3]);
  }

  return [...staticHeaders, ...result, ...therapiesIds];
};
