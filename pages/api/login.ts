import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).end();
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).end();
  // Set cookies for session (role and email)
  res.setHeader('Set-Cookie', [
    `userRole=${user.role}; Path=/; HttpOnly; SameSite=Lax`,
    `userEmail=${user.email}; Path=/; HttpOnly; SameSite=Lax`
  ]);
  res.status(200).json({ role: user.role });
}
