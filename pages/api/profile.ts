import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '');
  // For demo, get first user by role cookie
  const user = await prisma.user.findFirst({ where: { role: cookies.userRole } });
  if (!user) return res.status(401).end();

  if (req.method === 'GET') {
    res.status(200).json({ name: user.name, email: user.email, address: user.address, phone: user.phone });
  } else if (req.method === 'PUT') {
    const { name, email, address, phone } = req.body;
    await prisma.user.update({ where: { id: user.id }, data: { name, email, address, phone } });
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}
