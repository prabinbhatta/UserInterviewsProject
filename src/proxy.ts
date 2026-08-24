import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const PORTFOLIO_HOSTS = new Set(["prabinbhatta.com.np", "www.prabinbhatta.com.np"]);

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (PORTFOLIO_HOSTS.has(host) && !request.nextUrl.pathname.startsWith("/portfolio")) {
    const url = request.nextUrl.clone();
    url.pathname = "/portfolio";
    return NextResponse.rewrite(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
