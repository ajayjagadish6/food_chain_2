import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, always respond with success
    return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link.' });
  }
  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  // Save token to user
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expires,
    },
  });
  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'FoodChain Password Reset',
    html: `<p>You requested a password reset for FoodChain.<br />Click <a href="${resetUrl}">here</a> to reset your password.<br />This link will expire in 1 hour.</p>`
  });
  return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link.' });
}
