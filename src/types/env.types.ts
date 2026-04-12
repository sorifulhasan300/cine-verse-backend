export interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  AUTH_API_KEY: string;
  MONTHLY_PLAN_PRICE_ID: string;
  YEARLY_PLAN_PRICE_ID: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  CLIENT_URL: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}
