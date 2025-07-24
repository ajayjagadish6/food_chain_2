// API route to update delivery status
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { deliveryId, status, userId } = req.body;
  // Get logged in user (volunteer driver)
  let driverId: number | null = null;
  if (userId) {
    driverId = Number(userId);
  }
  console.log('updateDeliveryStatus request body:', req.body);
  if (!deliveryId || !status) {
    console.error('Missing deliveryId or status', req.body);
    return res.status(400).json({ error: 'Missing deliveryId or status' });
  }
  // Accept only valid DeliveryStatus enum values (sync with frontend)
  const validStatuses = ['Pending', 'Accepted', 'PickedUp', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    console.error('Invalid status value', status);
    return res.status(400).json({ error: 'Invalid status value' });
  }
  const idNum = typeof deliveryId === 'string' ? parseInt(deliveryId, 10) : deliveryId;
  if (!idNum || isNaN(idNum)) {
    console.error('Invalid deliveryId value', deliveryId);
    return res.status(400).json({ error: 'Invalid deliveryId value' });
  }
  const prisma = new PrismaClient();
  try {
    // Debug: print session and driverId
    console.log('DriverId:', driverId);
    // If status is 'Accepted', set driverId and driver
    // If status is 'Pending', clear driverId and driver
    const updateData: any = { status: status };
    if (status === 'Accepted') {
      if (driverId) {
        updateData.driver = { connect: { id: driverId } };
        console.log(`Assigning driverId ${driverId} to delivery ${idNum}`);
      } else {
        console.warn('No driverId found in session for Accepted status');
      }
    } else if (status === 'Pending') {
      updateData.driver = { disconnect: true };
      console.log(`Clearing driver for delivery ${idNum}`);
    }
    const updated = await prisma.foodDelivery.update({
      where: { id: idNum },
      data: updateData,
      include: { driver: true }
    });
    console.log('Updated delivery:', updated);
    res.json({ success: true, status: updated.status, driver: updated.driver });
  } catch (e) {
    const err = e as Error;
    console.error('Prisma update error:', err);
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
}
