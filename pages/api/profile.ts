import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use NextAuth session to get logged-in user's email
  const { getServerSession } = await import('next-auth/next');
  const { authOptions } = await import('./auth/[...nextauth]');
  const session = await getServerSession(req, res, authOptions);
  console.log('[Profile API] Session:', session);
  const email = session?.user?.email;
  console.log('[Profile API] Email:', email);
  if (!email) {
    res.status(401).json({ error: 'No session or email found.' });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('[Profile API] User:', user);
  if (!user) {
    res.status(401).json({ error: 'No user found for email.' });
    return;
  }

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
