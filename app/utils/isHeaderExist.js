export const isHeadersExist = (currentHeaders, newHeaders) => {
  if (currentHeaders.length > 0) {
    return newHeaders.every((header) => currentHeaders.includes(header));
  }
  return false;
};
