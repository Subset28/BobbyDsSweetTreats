import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let supabaseUrl: string;
  let supabaseKey: string;

  try {
    ({ supabaseUrl, supabaseKey } = getSupabaseConfig());
  } catch {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // Create a headers object we can mutate. We'll collect cookies written by
  // Supabase during auth operations and apply them to both the downstream
  // request headers and the outgoing response.
  const reqHeaders = new Headers(request.headers);
  const originalCookies = request.cookies.getAll() || [];
  const cookieQueue: Array<{ name: string; value: string; options?: any }> = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        // Merge original cookies with any that were queued (queue wins by name)
        const merged = [...originalCookies];
        for (const c of cookieQueue) {
          const idx = merged.findIndex((m) => m.name === c.name);
          if (idx !== -1) merged[idx] = c as any;
          else merged.push(c as any);
        }
        return merged as any;
      },
      setAll(cookiesToSet) {
        // Defer applying to the response until after auth completes.
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieQueue.push({ name, value, options });
        });
      },
    },
  });

  await supabase.auth.getUser();

  // Build a cookie header for downstream request handling so server components
  // see updated cookies during the same request lifecycle.
  const mergedCookies = [...originalCookies];
  for (const c of cookieQueue) {
    const idx = mergedCookies.findIndex((m) => m.name === c.name);
    if (idx !== -1) mergedCookies[idx] = c as any;
    else mergedCookies.push(c as any);
  }
  const cookieHeader = mergedCookies.map((c) => `${c.name}=${c.value}`).join("; ");
  if (cookieHeader) reqHeaders.set("cookie", cookieHeader);

  const response = NextResponse.next({ request: { headers: reqHeaders } });

  // Apply queued cookies to the outgoing response so the browser receives them.
  for (const c of cookieQueue) {
    try {
      response.cookies.set(c.name, c.value, c.options);
    } catch (err) {
      // best-effort
      // eslint-disable-next-line no-console
      console.warn("Failed to set cookie on response", c.name, err);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|site-media|robots.txt|sitemap.xml).*)",
  ],
};
