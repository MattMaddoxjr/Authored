import { db } from "@/lib/db";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();

  const results = q
    ? await db.page.findMany({
        where: {
          privacyMode: "PUBLIC",
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { handle: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 20,
      })
    : [];

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28 }}>Search</h1>

      <form style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or @handle"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
        <button
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          Go
        </button>
      </form>

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        {results.map((r) => (
          <a
            key={r.id}
            href={`/p/@${r.handle}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              textDecoration: "none",
              color: "black",
            }}
          >
            <div style={{ fontWeight: 700 }}>{r.displayName}</div>
            <div style={{ color: "#666" }}>@{r.handle}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
