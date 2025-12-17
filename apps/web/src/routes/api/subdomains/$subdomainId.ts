import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { auth } from "../../../lib/auth";
import { db } from "../../../db";
import { subdomains } from "../../../db/app-schema";

export const Route = createFileRoute("/api/subdomains/$subdomainId")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const { subdomainId } = params;

        const [subdomain] = await db
          .select()
          .from(subdomains)
          .where(eq(subdomains.id, subdomainId));

        if (!subdomain) {
          return json({ error: "Subdomain not found" }, { status: 404 });
        }

        const organizations = await auth.api.listOrganizations({
          headers: request.headers,
        });

        const hasAccess = organizations.find(
          (org) => org.id === subdomain.organizationId,
        );

        if (!hasAccess) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        await db.delete(subdomains).where(eq(subdomains.id, subdomainId));

        return json({ success: true });
      },
    },
  },
});
