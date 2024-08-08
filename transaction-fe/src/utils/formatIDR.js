export const formatIDR = (price) => {
  const result = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return result;
};

export const parseIDR = (formattedString) => {
  return parseInt(formattedString?.replace(/[^\d]/g, ""), 10);
};

