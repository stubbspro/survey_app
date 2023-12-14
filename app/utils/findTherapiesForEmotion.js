export const findTherapiesForEmotion = (data, emotion) => {
  const headers = data[0];
  const therapies = [];

  const emotionIndex = headers.indexOf(emotion);

  if (emotionIndex !== -1) {
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const therapyRow = data[rowIndex];

      if (therapyRow[emotionIndex] === '1') {
        therapies.push(therapyRow);
      }
    }
  }

  return therapies.length > 0 ? therapies : null;
};
