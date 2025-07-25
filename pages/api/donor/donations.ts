import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Returns all donations for the logged-in donor user, with filtering
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  // For demo, show all donations in the database
  const { date } = req.query;
  const where: Record<string, unknown> = {};
  if (date) where.date = new Date(date as string);
  // Get all donations
  const donations = await prisma.donation.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { delivery: { include: { driver: true } } },
  });

  // Flatten for table display using new foodType enum
  const result = donations.map(d => ({
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
