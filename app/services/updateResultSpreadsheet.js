export default async function updateResultSpreadsheet(data) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + '/api/emotional-wellness',
      {
        method: 'POST',
        body: JSON.stringify({
          data,
        }),
      }
    );
    const res = await response.json();

    return res;
  } catch (e) {
    console.log(e);

    return null;
  }
}
