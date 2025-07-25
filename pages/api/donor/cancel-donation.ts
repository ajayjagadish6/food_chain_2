import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing donation id' });
  try {
    // Only allow cancel if delivery is not set
    const donation = await prisma.donation.findUnique({ where: { id: Number(id) }, include: { delivery: true } });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.delivery) return res.status(400).json({ error: 'Cannot cancel: delivery already assigned' });
    await prisma.donation.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
