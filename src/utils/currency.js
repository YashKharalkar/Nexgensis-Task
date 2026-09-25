export function formatINR(price) {
  if (price === undefined || price === null || price === '' || isNaN(Number(price))) {
    return '₹0.00';
  }

  const numericValue = Number(price);

  return `₹${numericValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
