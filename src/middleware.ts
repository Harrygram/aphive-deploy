// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // This skips all static files & Next internals
    '/(api|trpc)(.*)',        // Always run for API & TRPC routes
  ],
};