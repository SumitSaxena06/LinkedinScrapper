import { PrismaClient } from "@prisma/client";
import { Job } from "./scraper";

const prisma = new PrismaClient();

export async function isSeen(jobId: string): Promise<boolean> {
  const row = await prisma.seenJob.findUnique({ where: { jobId } });
  return row !== null;
}

export async function markSeen(job: Job): Promise<void> {
  await prisma.seenJob.upsert({
    where: { jobId: job.id },
    update: {},
    create: {
      jobId:    job.id,
      title:    job.title,
      company:  job.company,
      location: job.location,
      link:     job.link,
      source:   job.source,
    },
  });
}

export async function getStats(): Promise<{ total: number; today: number }> {
  const total = await prisma.seenJob.count();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const today = await prisma.seenJob.count({
    where: { seenAt: { gte: startOfDay } },
  });
  return { total, today };
}

export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
