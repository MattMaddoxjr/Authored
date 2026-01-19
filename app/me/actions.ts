"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import crypto from "crypto";

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function ensureMyPage() {
  const { userId } = auth();
  if (!userId) throw new Error("Not signed in");

  const cu = await currentUser();
  const displayName = cu?.fullName || cu?.username || "Anonymous";

  await db.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });

  const existing = await db.page.findUnique({ where: { userId } });
  if (existing) return existing;

  const base = (cu?.username || displayName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handle = `${base || "user"}-${Math.floor(Math.random() * 9000 + 1000)}`;

  return db.page.create({
    data: {
      userId,
      displayName,
      handle,
      phoneVerified: !!cu?.phoneNumbers?.some(
        (p) => p.verification?.status === "verified"
      ),
    },
  });
}

export async function updateMyPage(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Not signed in");

  const displayName = String(formData.get("displayName") || "").slice(0, 80);
  const privacyMode = String(formData.get("privacyMode") || "PUBLIC");
  const accessCode = String(formData.get("accessCode") || "").trim();
  const familyList = String(formData.get("familyAllowlist") || "").trim();
  const content = String(formData.get("content") || "").slice(0, 5000);

  const codeHash = accessCode ? hashCode(accessCode) : null;

  const familyAllowlist = familyList
    ? familyList.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db.page.update({
    where: { userId },
    data: {
      displayName,
      content,
      privacyMode: privacyMode as any,
      accessCodeHash: privacyMode === "CODE" ? (codeHash || undefined) : null,
      familyAllowlist: privacyMode === "FAMILY" ? familyAllowlist : [],
    },
  });
}
