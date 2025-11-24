
/**
 * Basic Input Sanitization and Security Utilities
 * Note: In a real production app, use a robust library like DOMPurify
 */

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '&': return '&amp;';
      default: return match;
    }
  });
};

export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validatePasswordStrength = (password: string): { score: number; message: string } => {
  let score = 0;
  if (password.length > 8) score++;
  if (password.length > 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let message = 'Weak';
  if (score > 2) message = 'Medium';
  if (score > 4) message = 'Strong';

  return { score, message };
};

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
