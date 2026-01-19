import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export default async function PublicPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { code?: string };
}) {
  const page = await db.page.findUnique({ where: { handle: params.handle } });
  if (!page) return <main style={{ padding: 24 }}>Not found.</main>;

  const { userId } = auth();

  if (page.privacyMode === "PRIVATE") {
    if (userId !== page.userId) return <main style={{ padding: 24 }}>This page is private.</main>;
  }

  if (page.privacyMode === "FAMILY") {
    const allowed = userId && (userId === page.userId || page.familyAllowlist.includes(userId));
    if (!allowed) return <main style={{ padding: 24 }}>Family-only page.</main>;
  }

  if (page.privacyMode === "CODE") {
    const ok =
      page.accessCodeHash &&
      searchParams.code &&
      hashCode(searchParams.code) === page.accessCodeHash;

    const owner = userId === page.userId;

    if (!ok && !owner) {
      return (
        <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28 }}>{page.displayName}</h1>
          <p>This page requires a code.</p>
          <p style={{ color: "#666" }}>
            Add <b>?code=YOURCODE</b> to the end of the URL.
          </p>
        </main>
      );
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 38, marginBottom: 8 }}>{page.displayName}</h1>
      <div style={{ color: "#666", marginBottom: 18 }}>@{page.handle}</div>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{page.content}</div>
    </main>
  );
}
