import Link from "next/link";
import { ensureMyPage, updateMyPage } from "./actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function MePage() {
  const page = await ensureMyPage();
  const cu = await currentUser();

  const phoneVerified = !!cu?.phoneNumbers?.some(
    (p) => p.verification?.status === "verified"
  );

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 28 }}>My Page</h1>
        <Link href={`/p/@${page.handle}`}>View</Link>
      </div>

      <p style={{ color: "#444" }}>
        Handle: <b>@{page.handle}</b> • Phone verified:{" "}
        <b>{phoneVerified ? "Yes" : "No"}</b>
      </p>

      <form action={updateMyPage} style={{ display: "grid", gap: 14 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Display Name</div>
          <input
            name="displayName"
            defaultValue={page.displayName}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Privacy</div>
          <select
            name="privacyMode"
            defaultValue={page.privacyMode}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          >
            <option value="PUBLIC">Public</option>
            <option value="CODE">Code / Link</option>
            <option value="FAMILY">Family Only</option>
            <option value="PRIVATE">Private</option>
          </select>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Access Code (only for Code / Link)
          </div>
          <input
            name="accessCode"
            placeholder="Set a code (do not reuse passwords)"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            We store a secure hash, not the code itself.
          </div>
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Family Allowlist (only for Family Only)
          </div>
          <input
            name="familyAllowlist"
            placeholder="Comma-separated Clerk user IDs (MVP)"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Your Page</div>
          <textarea
            name="content"
            defaultValue={page.content}
            rows={14}
            maxLength={5000}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <button
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            background: "black",
            color: "white",
            border: "none",
            fontWeight: 600
          }}
        >
          Save
        </button>
      </form>
    </main>
  );
}
