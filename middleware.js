import { NextResponse } from "next/server";
import { sign, verify } from "./app/lib/utils";
import { SignJWT, jwtVerify, base64url, jwtDecrypt } from "jose";

// This function can be marked `async` if using `await` inside
export default async function middleware(request) {
  const jwt = request.cookies.get("token");
  const url = request.url;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    //if there is jwt token we will verify it.
    try {
      const tokenValue = await verify(jwt.value, "zoho");
      console.log({ tokenValue });
      request.nextUrl.pathname = tokenValue.go_to;
      return NextResponse.redirect(request.nextUrl);
    } catch (error) {
      request.nextUrl.pathname = "/login";
      return NextResponse.redirect(request.nextUrl);
    }
  }
  if (pathname === "/login" || pathname === "/reset_password") {
    //if there is jwt token we will verify it.
    try {
      console.log("RESETTTTTT");
      const tokenValue = await verify(jwt.value, "zoho");
      console.log({ tokenValue });

      if (tokenValue.go_to === "/reset_password") {
        request.nextUrl.pathname = "/reset_password";
        return NextResponse.next();
      }

      request.nextUrl.pathname = "/dashboard";
      return NextResponse.redirect(request.nextUrl);
    } catch (error) {
      return NextResponse.next();
    }
  }

  if (pathname !== "/login") {
    //if there is jwt token we will verify it.
    try {
      const tokenValue = await verify(jwt.value, "zoho");
      console.log({ tokenValue });
      if (tokenValue.go_to === "/reset_password") {
        request.nextUrl.pathname = "/reset_password";
        return NextResponse.redirect(request.nextUrl);
      }
      return NextResponse.next();
    } catch (error) {
      request.nextUrl.pathname = "/login";
      return NextResponse.redirect(request.nextUrl);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
