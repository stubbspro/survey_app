export default async function getTherapy(
  emotion,
  surveySpreadsheetId,
  therapyScreensCount
) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN +
        `/api/therapy?emotion=${emotion}&surveySpreadsheetId=${surveySpreadsheetId}&therapyScreensCount=${therapyScreensCount}`,
      { cache: 'no-store' }
    );
    const res = await response.json();

    return {
      data: res?.data,
    };
  } catch (e) {
    console.log(e);

    return {
      data: null,
    };
  }
}
