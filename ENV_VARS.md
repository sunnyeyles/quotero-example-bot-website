Environment variables

Required for estimate magic link flow:

- APP_BASE_URL: Base URL for generating links (e.g., http://localhost:3000 or your prod domain)
- ESTIMATE_JWT_SECRET: Long random string for signing/validating tokens

Optional (email sending via Resend):

- RESEND_API_KEY: API key for Resend (omit in dev to log emails instead)
- EMAIL_FROM: Sender email address. For testing without domain verification, omit this or use "onboarding@resend.dev". For production, use a verified domain (e.g., quotes@yourdomain.com)
- NEXT_PUBLIC_DEFAULT_BUSINESS_EMAIL: Default business email to pre-fill in the estimate form (can still be changed)

Example (.env.local):

APP_BASE_URL=http://localhost:3000
ESTIMATE_JWT_SECRET=replace_with_long_random_string
RESEND_API_KEY=your_resend_key
EMAIL_FROM=quotes@example.com
