import { clerkMiddleware } from "@clerk/nextjs/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!isPublic) {
    await auth.protect({ unauthenticatedUrl: new URL("/sign-in", req.url).toString() });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};
