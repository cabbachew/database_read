import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth) {
    const [, encoded] = auth.split(" ");
    const [user, pass] = atob(encoded ?? "").split(":");

    if (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASS
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected Site"' },
  });
}

export const config = {
  // Gate everything except framework internals and the favicon.
  // /api/* is gated too: once the browser has authed, the site's own
  // same-origin fetches resend the header automatically.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
