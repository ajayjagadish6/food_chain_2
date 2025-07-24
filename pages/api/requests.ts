import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { date, serves, foodType } = req.query;
  const where: Record<string, unknown> = {};
  if (date) where.date = new Date(date as string);
  if (serves) where.serves = { gte: Number(serves) };
  if (foodType) where.foodType = foodType;
  const requests = await prisma.foodRequest.findMany({
    where,
    include: { recipient: true },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(requests);
}
