import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { date, serves } = req.query;
  const where: {
    date?: Date;
    serves?: { gte: number };
  } = {};
  if (date) where.date = new Date(date as string);
  if (serves) where.serves = { gte: Number(serves) };
  const donations = await prisma.donation.findMany({
    where,
    include: { donor: true },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(donations);
}
