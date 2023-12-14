import { notFound } from 'next/navigation';

export default async function getGoogleSpreadSheetsRows(route) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + `/api/survey-master?route=${route}`,
      { cache: 'no-store' }
    );
    const res = await response.json();

    return {
      data: res?.data,
      userId: res?.userId,
      surveySpreadsheetId: res?.surveySpreadsheetId,
      screensInfo: res?.screensInfo,
      totalScreens: res?.totalScreens,
    };
  } catch (e) {
    return notFound();
  }
}
