"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createLink,
  deleteLink,
  updateLink,
  ShortCodeTakenError,
} from "@/data/links";
import type { Link } from "@/db/schema";

const createLinkSchema = z.object({
  originalUrl: z.string().trim().url(),
  customSlug: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(32, "Slug must be 32 characters or fewer.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, hyphens, and underscores are allowed.",
      )
      .optional(),
  ),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

type CreateLinkResult =
  { success: true; data: Link } | { success: false; error: string };

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<CreateLinkResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in to create a link." };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const link = await createLink(
      userId,
      parsed.data.originalUrl,
      parsed.data.customSlug,
    );
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof ShortCodeTakenError) {
      return { success: false, error: "That custom slug is already taken." };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

const updateLinkSchema = z.object({
  linkId: z.number().int().positive(),
  originalUrl: z.string().trim().url(),
  customSlug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(32, "Slug must be 32 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens, and underscores are allowed.",
    ),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

type UpdateLinkResult =
  { success: true; data: Link } | { success: false; error: string };

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<UpdateLinkResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in to update a link." };
  }

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const link = await updateLink(
      userId,
      parsed.data.linkId,
      parsed.data.originalUrl,
      parsed.data.customSlug,
    );
    if (!link) {
      return { success: false, error: "Link not found." };
    }
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof ShortCodeTakenError) {
      return { success: false, error: "That custom slug is already taken." };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

const deleteLinkSchema = z.object({
  linkId: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

type DeleteLinkResult = { success: true } | { success: false; error: string };

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<DeleteLinkResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in to delete a link." };
  }

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const link = await deleteLink(userId, parsed.data.linkId);
  if (!link) {
    return { success: false, error: "Link not found." };
  }
  return { success: true };
}
