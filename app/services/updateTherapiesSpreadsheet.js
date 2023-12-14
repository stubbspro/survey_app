export default async function updateTherapiesSpreadsheet(data) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + '/api/therapy',
      {
        method: 'PUT',
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
