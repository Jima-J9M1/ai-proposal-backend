export function generateUsername(fullName: string): string {
  // Convert to lowercase and replace spaces with underscores
  let baseUsername = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .trim();

  // If empty after cleaning, use 'user'
  if (!baseUsername) {
    baseUsername = 'user';
  }

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${baseUsername}_${randomSuffix}`;
}

export function generateUniqueUsername(fullName: string, existingUsernames: string[]): string {
  let username = generateUsername(fullName);
  let counter = 1;

  // Keep trying until we find a unique username
  while (existingUsernames.includes(username)) {
    username = `${generateUsername(fullName)}_${counter}`;
    counter++;
  }

  return username;
} 