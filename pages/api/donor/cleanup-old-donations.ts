import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });
  try {
    const user = await prisma.user.findUnique({ where: { email: String(email) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date();
    today.setHours(0,0,0,0);
    await prisma.donation.deleteMany({
      where: {
        donorId: user.id,
        date: { lt: today }
      }
    });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
