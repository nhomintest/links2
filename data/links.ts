import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import db from "@/db";
import { links } from "@/db/schema";

export async function getLinksForUser(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode));
  return link ?? null;
}

const SHORT_CODE_LENGTH = 7;
const MAX_SHORT_CODE_ATTEMPTS = 5;

export class ShortCodeTakenError extends Error {
  constructor() {
    super("Short code already taken");
    this.name = "ShortCodeTakenError";
  }
}

function isUniqueViolation(error: unknown) {
  // 23505 = Postgres unique_violation
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export async function createLink(
  userId: string,
  originalUrl: string,
  customSlug?: string,
) {
  if (customSlug) {
    try {
      const [link] = await db
        .insert(links)
        .values({ userId, originalUrl, shortCode: customSlug })
        .returning();
      return link;
    } catch (error) {
      if (isUniqueViolation(error)) throw new ShortCodeTakenError();
      throw error;
    }
  }

  for (let attempt = 1; attempt <= MAX_SHORT_CODE_ATTEMPTS; attempt++) {
    try {
      const [link] = await db
        .insert(links)
        .values({ userId, originalUrl, shortCode: nanoid(SHORT_CODE_LENGTH) })
        .returning();
      return link;
    } catch (error) {
      if (!isUniqueViolation(error) || attempt === MAX_SHORT_CODE_ATTEMPTS)
        throw error;
    }
  }
  throw new Error("Failed to generate a unique short code");
}

export async function updateLink(
  userId: string,
  linkId: number,
  originalUrl: string,
  customSlug: string,
) {
  try {
    const [link] = await db
      .update(links)
      .set({ originalUrl, shortCode: customSlug, updatedAt: new Date() })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning();
    return link ?? null;
  } catch (error) {
    if (isUniqueViolation(error)) throw new ShortCodeTakenError();
    throw error;
  }
}

export async function deleteLink(userId: string, linkId: number) {
  const [link] = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();
  return link ?? null;
}
