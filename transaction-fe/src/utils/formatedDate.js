export const formatedDate = (dateString) => {
  const date = new Date(dateString);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-GB", options)
    .replace(",", "");
  return formattedDate;
};
