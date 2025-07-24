import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const email = req.cookies.userEmail;
  if (!email) return res.status(401).json({ error: 'Not authenticated' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'User not found' });

  let matches = [];
  if (user.role === 'donor') {
    matches = await prisma.foodDelivery.findMany({
      where: { donation: { donorId: user.id } },
      include: { request: { include: { recipient: true } } }
    });
    const result = matches.map(m => ({
      matchedName: m.request?.recipient?.name,
      matchedAddress: m.request?.recipient?.address,
      deliveryId: m.id,
      role: 'donor'
    }));
    return res.json(result);
  } else if (user.role === 'recipient') {
    matches = await prisma.foodDelivery.findMany({
      where: { request: { recipientId: user.id } },
      include: { donation: { include: { donor: true } } }
    });
    const result = matches.map(m => ({
      matchedName: m.donation?.donor?.name,
      matchedAddress: m.donation?.donor?.address,
      deliveryId: m.id,
      role: 'recipient'
    }));
    return res.json(result);
  } else if (user.role === 'volunteer') {
    matches = await prisma.foodDelivery.findMany({
      where: { driverId: user.id },
      include: { donation: { include: { donor: true } }, request: { include: { recipient: true } } }
    });
    const result = matches.map(m => ({
      donorName: m.donation?.donor?.name,
      recipientName: m.request?.recipient?.name,
      pickup: m.pickupAddress,
      delivery: m.deliveryAddress,
      deliveryId: m.id,
      role: 'volunteer'
    }));
    return res.json(result);
  } else {
    return res.json([]);
  }
}
