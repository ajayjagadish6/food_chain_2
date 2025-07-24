import { useState } from 'react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    // Simulate API call
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    // Replace with actual API call in production
    setTimeout(() => {
      setMessage('If an account exists for this email, a password reset link has been sent.');
    }, 1000);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', fontFamily: 'Inter, Arial, Helvetica, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', width: '380px', maxWidth: '95vw', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        <h2 style={{ color: '#b91c1c', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem' }}>Reset Password</h2>
        <label style={{ fontWeight: 600, marginBottom: '0.25rem', alignSelf: 'flex-start' }}>Email Address</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
        {error && <div style={{ color: '#b91c1c', width: '100%', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: '#388e3c', width: '100%', textAlign: 'center' }}>{message}</div>}
        <button type="submit" style={{ width: '320px', background: '#b91c1c', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 0', marginTop: '1.5rem', cursor: 'pointer', fontFamily: 'Inter, Arial, Helvetica, sans-serif', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', letterSpacing: '0.03em', transition: 'background 0.2s', textAlign: 'center' }}>Send Reset Link</button>
      </form>
    </div>
  );
}
