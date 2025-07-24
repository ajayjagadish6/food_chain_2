import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'userRole=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
  res.status(200).end();
}
