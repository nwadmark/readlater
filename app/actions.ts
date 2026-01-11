"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getOwnerKey } from "@/lib/owner-key";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchPageTitle } from "@/lib/fetch-title";

export async function createLink(url: string, title?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const clean = (url || "").trim();
    if (!clean) return { ok: false, error: "URL is required" };

    let cleanTitle = title?.trim() || null;
    const session = await getServerSession(authOptions);
    const ownerKey = await getOwnerKey();

    // If no title provided, try to fetch it from the page
    if (!cleanTitle) {
      const fetchedTitle = await fetchPageTitle(clean);
      if (fetchedTitle) {
        cleanTitle = fetchedTitle;
      }
    }

    await prisma.link.create({
      data: {
        id: crypto.randomUUID(),
        url: clean,
        title: cleanTitle,
        status: "SAVED",
        ownerKey,
        userId: session?.user?.id || null,
        updatedAt: new Date(),
      },
    });

    // refresh pages that show lists
    revalidatePath("/");
    revalidatePath("/library");

    return { ok: true };
  } catch (error: any) {
    // Handle duplicate url+ownerKey constraint violation
    if (error?.code === "P2002") {
      return { ok: false, error: "Already saved" };
    }

    // Handle Prisma validation errors
    if (error?.name === "PrismaClientValidationError") {
      console.error("PrismaClientValidationError in createLink:", error);
      return { ok: false, error: "Unable to save link" };
    }

    // Handle all other unknown errors
    console.error("Unknown error in createLink:", error);
    return { ok: false, error: "Unable to save link" };
  }
}

export async function listLinks() {
  const session = await getServerSession(authOptions);
  const ownerKey = await getOwnerKey();

  // If user is signed in, fetch by userId; otherwise, fetch by ownerKey
  return prisma.link.findMany({
    where: session?.user?.id
      ? { userId: session.user.id }
      : { ownerKey, userId: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLink(id: string) {
  const session = await getServerSession(authOptions);
  const ownerKey = await getOwnerKey();

  return prisma.link.findFirst({
    where: {
      id,
      ...(session?.user?.id
        ? { userId: session.user.id }
        : { ownerKey, userId: null }),
    },
  });
}

export async function updateLinkStatus(id: string, status: "SAVED" | "IN_PROGRESS" | "FINISHED") {
  const session = await getServerSession(authOptions);
  const ownerKey = await getOwnerKey();

  const link = await prisma.link.updateMany({
    where: {
      id,
      ...(session?.user?.id
        ? { userId: session.user.id }
        : { ownerKey, userId: null }),
    },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/link/${id}`);

  return link;
}

export async function updateLinkTitle(id: string, title: string) {
  const session = await getServerSession(authOptions);
  const ownerKey = await getOwnerKey();

  const link = await prisma.link.updateMany({
    where: {
      id,
      ...(session?.user?.id
        ? { userId: session.user.id }
        : { ownerKey, userId: null }),
    },
    data: {
      title: title.trim() || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/link/${id}`);

  return link;
}

export async function deleteLink(id: string) {
  const session = await getServerSession(authOptions);
  const ownerKey = await getOwnerKey();

  await prisma.link.deleteMany({
    where: {
      id,
      ...(session?.user?.id
        ? { userId: session.user.id }
        : { ownerKey, userId: null }),
    },
  });

  revalidatePath("/");
  revalidatePath("/library");
}
