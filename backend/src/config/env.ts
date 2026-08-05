import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

export const env = {
  PORT: parseInt(getEnvVar('PORT', false) || '3000', 10),
  GITHUB_TOKEN: getEnvVar('GITHUB_TOKEN', true),
  REDIS_URL: getEnvVar('REDIS_URL', false), // Optional for MVP
};
