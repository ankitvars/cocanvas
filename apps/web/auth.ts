import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';

// Auth.js v5 automatically reads AUTH_GITHUB_ID, AUTH_GITHUB_SECRET,
// AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and AUTH_SECRET from env vars.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
