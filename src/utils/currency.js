/**
 * Utility functions for Indian Rupee (INR) currency formatting.
 */

/**
 * Format a number into Indian Rupee (INR) format with the ₹ symbol.
 * Example: 2499 -> "₹2,499.00"
 * @param {number|string} price
 * @returns {string} Formatted INR currency string
 */
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
