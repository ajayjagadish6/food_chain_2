import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Returns all food requests for the logged-in recipient user, with filtering
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  // For demo, get recipient by email from cookie or query param
  let email = req.query.email as string | undefined;
  if (!email) email = req.cookies.userEmail;
  console.log('[Recipient API] Incoming email:', email);
  if (!email) return res.status(401).json({ error: 'Not authenticated' });
  const recipient = await prisma.user.findUnique({ where: { email } });
  console.log('[Recipient API] Found recipient:', recipient);
  if (!recipient) return res.status(401).json({ error: 'Recipient not found' });

  // Only filter by date if provided, and match by day not exact timestamp
  const { date, foodType } = req.query;
  const where: Record<string, unknown> = { recipientId: recipient.id };
  if (date) {
    // Convert date string to start/end of day for filtering
    const start = new Date(date as string);
    start.setHours(0,0,0,0);
    const end = new Date(date as string);
    end.setHours(23,59,59,999);
    where.date = { gte: start, lte: end };
  }
  if (foodType) where.foodType = foodType;

  const requests = await prisma.foodRequest.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { delivery: { include: { driver: true } } },
  });

  // Flatten for table display
  const result = requests.map(r => ({
    id: r.id,
    date: r.date,
    time: r.time,
    foodType: r.foodType,
    serves: r.serves,
    delivery: r.delivery ? {
      id: r.delivery.id,
      pickupAddress: r.delivery.pickupAddress,
      deliveryAddress: r.delivery.deliveryAddress,
      pickupTime: r.delivery.pickupTime,
      deliveryTime: r.delivery.deliveryTime,
      status: r.delivery.status,
      driverName: r.delivery.driver ? r.delivery.driver.name : null
    } : null
  }));
  res.json(result);
}
