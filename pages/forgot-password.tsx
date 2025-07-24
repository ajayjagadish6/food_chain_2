import Image from "next/image";
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage('If your email is registered, you will receive a password reset link.');
      } else {
        setMessage('Failed to send reset link. Please try again.');
      }
    } catch {
      setMessage('Error sending reset link.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, Arial, Helvetica, sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, padding: '0px', background: 'none', boxShadow: 'none', border: 'none' }}>
        <button onClick={() => window.location.href = '/'} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
        </button>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 400, background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', color: '#b91c1c', marginBottom: '2rem', marginTop: 0, textAlign: 'center' }}>Forgot Password</h2>
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleSubmit}>
          <label style={{ fontWeight: 600, marginBottom: '0.25rem', textAlign: 'left' }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '1rem', padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '0.5rem', background: '#fafafa', color: 'var(--foreground)', outline: 'none' }}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
          <button type="submit" style={{ background: '#b91c1c', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 0', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        {message && <div style={{ marginTop: '1.5rem', color: '#333', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
      </div>
    </div>
  );
}
