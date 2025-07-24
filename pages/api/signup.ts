import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password, address, phone, role, timeWindow } = req.body;
  if (!name || !email || !password || !address || !phone || !role) return res.status(400).json({ error: 'Missing fields' });
  if (role === 'volunteer' && !timeWindow) return res.status(400).json({ error: 'Missing time window for volunteer' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hash, address, phone, role, timeWindow: role === 'volunteer' ? timeWindow : undefined } });
  res.status(201).end();
}
