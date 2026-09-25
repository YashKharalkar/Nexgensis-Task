/**
 * Indian Names Utility
 * Replaces foreign or missing names with authentic Indian names
 * to adhere to Indian localization requirements.
 */

const INDIAN_NAMES_POOL = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Verma',
  'Ananya Iyer',
  'Vikram Malhotra',
  'Sneha Reddy',
  'Aditya Joshi',
  'Kavya Nair',
  'Rajesh Kumar',
  'Pooja Mehta',
  'Siddharth Rao',
  'Divya Deshmukh',
  'Arjun Kapoor',
  'Meera Chawla',
  'Karan Singhania',
  'Ishita Sengupta',
  'Nikhil Pillai',
  'Ritu Bansal',
];

/**
 * Deterministically maps any given original name to an Indian name.
 * Uses a string hash so the same input name always yields the same Indian name.
 *
 * @param {string} originalName - Original name from API
 * @param {number} [fallbackIndex=0] - Fallback index if name is empty
 * @returns {string} Indian name
 */
export function getIndianName(originalName, fallbackIndex = 0) {
  if (!originalName || typeof originalName !== 'string' || !originalName.trim()) {
    return INDIAN_NAMES_POOL[fallbackIndex % INDIAN_NAMES_POOL.length];
  }

  const trimmed = originalName.trim();

  // If it's already one of our Indian names, return as is
  if (INDIAN_NAMES_POOL.includes(trimmed)) {
    return trimmed;
  }

  // Generate deterministic hash
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % INDIAN_NAMES_POOL.length;
  return INDIAN_NAMES_POOL[index];
}

/**
 * Returns Indian admin name for the logged-in dashboard session.
 *
 * @param {object} user - User object from AuthContext
 * @returns {string}
 */
export function getIndianAdminName(user) {
  if (!user) return 'Aarav Sharma';
  return 'Aarav Sharma (Admin)';
}
