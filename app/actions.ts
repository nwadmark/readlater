"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getOwnerKey } from "@/lib/owner-key";

export async function createLink(url: string, title?: string) {
  const clean = (url || "").trim();
  if (!clean) throw new Error("URL is required");

  const cleanTitle = title?.trim() || null;
  const ownerKey = await getOwnerKey();

  const link = await prisma.link.create({
    data: {
      url: clean,
      title: cleanTitle,
      status: "SAVED",
      ownerKey,
    },
  });

  // refresh pages that show lists
  revalidatePath("/");
  revalidatePath("/library");

  return link;
}

export async function listLinks() {
  const ownerKey = await getOwnerKey();

  return prisma.link.findMany({
    where: { ownerKey },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLink(id: string) {
  const ownerKey = await getOwnerKey();

  return prisma.link.findUnique({
    where: {
      id,
      ownerKey,
    },
  });
}

export async function updateLinkStatus(id: string, status: "SAVED" | "IN_PROGRESS" | "FINISHED") {
  const ownerKey = await getOwnerKey();

  const link = await prisma.link.update({
    where: {
      id,
      ownerKey,
    },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/link/${id}`);

  return link;
}

export async function deleteLink(id: string) {
  const ownerKey = await getOwnerKey();

  await prisma.link.delete({
    where: {
      id,
      ownerKey,
    },
  });

  revalidatePath("/");
  revalidatePath("/library");
}
