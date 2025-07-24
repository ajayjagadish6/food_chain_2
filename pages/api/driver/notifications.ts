import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This endpoint returns new donation notifications for drivers
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  // Get the latest donation (for demo, just return the most recent one)
  const latestDonation = await prisma.donation.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { donor: true },
  });
  if (!latestDonation || !latestDonation.donor) return res.json([]);
  // Use donor.address from signup page
  res.json([
    {
      donorName: latestDonation.donor.name || 'Unknown',
      location: latestDonation.donor.address || 'Unknown',
      donationId: latestDonation.id,
      createdAt: latestDonation.createdAt.toISOString(), // UTC ISO string
    },
  ]);
}
