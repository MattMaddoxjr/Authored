import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Authored</h1>

      <p style={{ marginTop: 0, color: "#444", lineHeight: 1.4 }}>
        One page per person. Editable in life. Private if you want.
      </p>

      <div style={{ marginTop: 20 }}>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "black",
                color: "white",
                border: "none"
              }}
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <UserButton />
            <Link href="/me">Edit my page</Link>
            <Link href="/search">Search</Link>
          </div>
        </SignedIn>
      </div>

      <hr style={{ margin: "28px 0" }} />

      <h2 style={{ marginBottom: 6 }}>What this is</h2>
      <ul style={{ color: "#333", lineHeight: 1.6 }}>
        <li>You get one permanent page.</li>
        <li>You can edit it while you are alive.</li>
        <li>You choose privacy: Public, Code, Family, or Private.</li>
        <li>Verification uses phone + one extra check later.</li>
      </ul>
    </main>
  );
}
