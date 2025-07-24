import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to parse timeWindow string (e.g. '6:00pm-8:00pm') to [start, end] in minutes
function parseTimeWindow(window: string): [number, number] {
  const [start, end] = window.split('-').map(s => s.trim());
  return [parseTime(start), parseTime(end)];
}

// Helper to parse time string (e.g. '6:30pm') to minutes since midnight
function parseTime(str: string): number {
  let [time, period] = str.toLowerCase().split(/(am|pm)/).filter(Boolean);
  let [h, m] = time.split(':');
  let hour = parseInt(h);
  let min = m ? parseInt(m) : 0;
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  return hour * 60 + min;
}

async function runMatchingAlgorithm() {
  // Find unmatched donations
  const donations = await prisma.donation.findMany({ where: { delivery: null } });
  // Find unmatched requests
  const requests = await prisma.foodRequest.findMany({ where: { delivery: null } });
  for (const donation of donations) {
    if (!donation.timeWindow) continue;
    const [startMin, endMin] = parseTimeWindow(donation.timeWindow);
    for (const request of requests) {
      // Match date
      if (new Date(request.date).toDateString() !== new Date(donation.date).toDateString()) continue;
      // Match time
      const reqMin = parseTime(request.time);
      if (reqMin < startMin || reqMin > endMin) continue;
      // Match foodType
      if (!(donation.foodType === 'Both' || request.foodType === 'Both' || donation.foodType === request.foodType)) continue;
      // Match serves
      if (request.serves > donation.serves) continue;
      // Get donor and recipient
      const donor = await prisma.user.findUnique({ where: { id: donation.donorId } });
      const recipient = await prisma.user.findUnique({ where: { id: request.recipientId } });
      if (!donor || !recipient) continue;
      // Create FoodDelivery
      await prisma.foodDelivery.create({
        data: {
          donation: { connect: { id: donation.id } },
          request: { connect: { id: request.id } },
          pickupAddress: donor.address,
          deliveryAddress: recipient.address,
          pickupTime: donation.timeWindow,
          deliveryTime: request.time,
          status: 'Pending',
        }
      });
      // Reduce donation serves by request.serves for partial matching
      await prisma.donation.update({ where: { id: donation.id }, data: { serves: donation.serves - request.serves } });
      break; // Only match one request per donation per run
    }
  }
}

// This endpoint returns all deliveries for the driver dashboard, including status
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  // Run matching algorithm before returning deliveries
  await runMatchingAlgorithm();
  const deliveries = await prisma.foodDelivery.findMany({
    include: {
      driver: true,
      donation: { include: { donor: true } },
      request: { include: { recipient: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log('Deliveries for dashboard:', deliveries.map(d => ({ id: d.id, driver: d.driver })));
  res.json(deliveries.map(d => ({
    donorName: d.donation?.donor?.name || 'Unknown',
    location: d.donation?.donor?.address || 'Unknown',
    status: d.status,
    recipientName: d.request?.recipient?.name || 'Unknown',
    deliveryId: d.id,
    driverName: d.driver?.name || '',
    pickupAddress: d.pickupAddress,
    deliveryAddress: d.deliveryAddress,
    pickupTime: d.pickupTime,
    deliveryTime: d.deliveryTime,
    createdAt: d.createdAt,
  })));
}
