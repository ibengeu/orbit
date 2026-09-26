import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { assertSameSiteRequest, CrossSiteRequestError } from "@/lib/auth/isolation.server";
import { authConfigured, getSessionUser } from "@/lib/auth/verify.server";
import { gateIdentityEnabled } from "@/lib/auth/gate-identity.server";
import { handleOrbitApiWithIdentity, problem } from "@/lib/orbit/api";

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: { Allow: "GET, POST, PATCH, PUT, DELETE, OPTIONS" } }),
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
      PATCH: ({ request }) => handle(request),
      PUT: ({ request }) => handle(request),
      DELETE: ({ request }) => handle(request),
    },
  },
});

async function handle(request: Request) {
  try {
    assertSameSiteRequest();
    const identityRequired = authConfigured || gateIdentityEnabled();
    const sessionUser = identityRequired ? await getSessionUser() : null;
    if (identityRequired && !sessionUser) return problem(401, "unauthorized", "Authentication required", "A valid session is required.", request);
    const sql = await getSql();
    return handleOrbitApiWithIdentity(request, { sql, authenticationRequired: identityRequired, verifiedUserId: sessionUser?.id ?? null });
  } catch (error) {
    if (error instanceof CrossSiteRequestError) {
      return problem(403, "forbidden", "Request origin is not allowed", "The request origin is not allowed.", request);
    }
    console.error("[orbit-api] route failed");
    return problem(500, "internal-error", "Request failed", "The server could not complete the request.", request);
  }
}
