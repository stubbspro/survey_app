export const createScreensInfo = (array) => {
  const resultObject = {};

  for (let i = 1; i < array.length; i++) {
    const [screenNum, minTime, questionType] = array[i];
    if (screenNum !== '' && minTime !== '' && questionType !== '') {
      resultObject[screenNum] = {
        minTime: +minTime,
        questionType,
      };
    }
  }

  return resultObject;
};
