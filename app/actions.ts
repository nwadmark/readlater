"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLink(url: string, title?: string) {
  const clean = (url || "").trim();
  if (!clean) throw new Error("URL is required");

  const cleanTitle = title?.trim() || null;

  const link = await prisma.link.create({
    data: {
      url: clean,
      title: cleanTitle,
      status: "SAVED",
    },
  });

  // refresh pages that show lists
  revalidatePath("/");
  revalidatePath("/library");

  return link;
}

export async function listLinks() {
  return prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getLink(id: string) {
  return prisma.link.findUnique({
    where: { id },
  });
}

export async function updateLinkStatus(id: string, status: "SAVED" | "IN_PROGRESS" | "FINISHED") {
  const link = await prisma.link.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/link/${id}`);

  return link;
}

export async function deleteLink(id: string) {
  await prisma.link.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/library");
}
