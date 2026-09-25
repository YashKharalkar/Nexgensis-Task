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

export function getIndianName(originalName, fallbackIndex = 0) {
  if (!originalName || typeof originalName !== 'string' || !originalName.trim()) {
    return INDIAN_NAMES_POOL[fallbackIndex % INDIAN_NAMES_POOL.length];
  }

  const trimmed = originalName.trim();

  if (INDIAN_NAMES_POOL.includes(trimmed)) {
    return trimmed;
  }

  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % INDIAN_NAMES_POOL.length;
  return INDIAN_NAMES_POOL[index];
}

export function getIndianAdminName(user) {
  if (!user) return 'Aarav Sharma';
  return 'Aarav Sharma (Admin)';
}
