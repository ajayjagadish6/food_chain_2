import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function matchDonationsAndRequests() {
  // Find unmatched donations
  const donations = await prisma.donation.findMany({
    where: {
      delivery: null
    },
    include: { donor: true }
  });
  // Find unmatched requests
  const requests = await prisma.foodRequest.findMany({
    where: {
      delivery: null
    },
    include: { recipient: true }
  });
  function timeOverlap(t1: string, t2: string): boolean {
    // More flexible: check if time windows overlap by hour or half-hour
    // Example: '5-6pm' overlaps with '5-5:30pm', '5:30-6pm', etc.
    const [start1, end1] = t1.replace('pm','').replace('am','').split('-').map(s => s.trim());
    const [start2, end2] = t2.replace('pm','').replace('am','').split('-').map(s => s.trim());
    // Convert to numbers for comparison
    const toNum = (str: string) => {
      const [h, m] = str.split(':');
      return parseInt(h) + (m ? parseInt(m)/60 : 0);
    };
    const s1 = toNum(start1);
    const e1 = toNum(end1);
    const s2 = toNum(start2);
    const e2 = toNum(end2);
    // Overlap if one window starts before the other ends
    return (s1 < e2 && s2 < e1);
  }
  function foodTypeCompatible(dType: string, rType: string): boolean {
    return dType === 'Both' || rType === 'Both' || dType === rType;
  }
  for (const donation of donations) {
    const match = requests.find(request =>
      new Date(request.date).toDateString() === new Date(donation.date).toDateString() &&
      timeOverlap(request.time, donation.timeWindow) &&
      foodTypeCompatible(donation.foodType, request.foodType) &&
      request.serves <= donation.serves
    );
    if (match) {
      await prisma.foodDelivery.create({
        data: {
          donation: { connect: { id: donation.id } },
          request: { connect: { id: match.id } },
          pickupAddress: donation.donor.address,
          deliveryAddress: match.recipient.address,
          pickupTime: donation.timeWindow,
          deliveryTime: match.time,
          status: 'Pending',
        }
      });
      // Reduce donation serves by request.serves for partial matching
      await prisma.donation.update({
        where: { id: donation.id },
        data: { serves: donation.serves - match.serves }
      });
      requests.splice(requests.indexOf(match), 1);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    // Get recipient by email from request body or cookie
    const email = req.body.email || req.cookies.userEmail;
    if (!email) return res.status(401).json({ error: 'Not authenticated' });
    const recipient = await prisma.user.findUnique({ where: { email, role: 'recipient' } });
    if (!recipient) return res.status(401).json({ error: 'Recipient not found' });
    const { date, time, serves, foodType } = req.body;
    if (!date || !time || !serves || !foodType) return res.status(400).json({ error: 'Missing required fields' });
    const validFoodTypes = ['Vegetarian', 'NonVegetarian', 'Both'];
    if (!validFoodTypes.includes(foodType)) return res.status(400).json({ error: 'Invalid food type' });
    await prisma.foodRequest.create({ data: { recipientId: recipient.id, date: new Date(date), time, serves, foodType } });
    await matchDonationsAndRequests();
    res.status(201).end();
  } catch (err) {
    console.error('Food request error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
