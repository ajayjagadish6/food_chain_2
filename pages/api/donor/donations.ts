
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Returns all donations for the logged-in donor user, with filtering
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { date, email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Find the donor by email
  const donor = await prisma.user.findUnique({ where: { email, role: 'donor' } });
  if (!donor) {
    return res.status(401).json({ error: 'Donor not found' });
  }
  const where: Record<string, unknown> = { donorId: donor.id };
  if (date) where.date = new Date(date as string);
  // Get all donations for this donor
  const donations = await prisma.donation.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { delivery: { include: { driver: true } } },
  });

  // Flatten for table display using new foodType enum
  const result = donations.map(d => ({
    id: d.id,
    date: d.date,
    timeWindow: d.timeWindow,
    foodType: d.foodType,
    serves: d.serves,
    delivery: d.delivery ? {
      id: d.delivery.id,
      pickupAddress: d.delivery.pickupAddress,
      deliveryAddress: d.delivery.deliveryAddress,
      pickupTime: d.delivery.pickupTime,
      deliveryTime: d.delivery.deliveryTime,
      status: d.delivery.status,
      driverName: d.delivery.driver ? d.delivery.driver.name : null
    } : null
  }));
  res.json(result);
}
