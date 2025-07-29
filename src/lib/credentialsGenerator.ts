/**
 * Utility functions for generating secure login credentials for private accounts
 */

// Generate a random username with prefix based on role
export const generateUsername = (role: string, schoolId?: string): string => {
  const prefixes = {
    administrator: 'admin',
    head_teacher: 'head',
    class_teacher: 'class',
    subject_teacher: 'subj',
    student: 'stud'
  };
  
  const prefix = prefixes[role as keyof typeof prefixes] || 'user';
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const schoolPrefix = schoolId ? schoolId.substring(0, 3) : 'sys';
  
  return `${schoolPrefix}_${prefix}_${randomSuffix}`;
};

// Generate a secure random password
export const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate complete credentials for a user
export interface GeneratedCredentials {
  username: string;
  password: string;
  role: string;
  schoolId?: string;
}

export const generateCredentials = (role: string, schoolId?: string): GeneratedCredentials => {
  return {
    username: generateUsername(role, schoolId),
    password: generatePassword(),
    role,
    schoolId
  };
};

// Format credentials for display
export const formatCredentialsForDisplay = (credentials: GeneratedCredentials): string => {
  return `Username: ${credentials.username}\nPassword: ${credentials.password}\nRole: ${credentials.role}${credentials.schoolId ? `\nSchool ID: ${credentials.schoolId}` : ''}`;
};