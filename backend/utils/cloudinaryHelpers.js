export const getPublicId = (url) => {
  const parts = url.split("/");
  const folder = parts[parts.length - 2];
  const file = parts[parts.length - 1].split(".")[0];
  return `${folder}/${file}`;
};
