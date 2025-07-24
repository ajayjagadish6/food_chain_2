import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'donor',
    timeWindow: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess('Signup successful! You can now log in.');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', fontFamily: 'Inter, Arial, Helvetica, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/login'}>
            <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
          </button>
        </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#d32f2f', marginBottom: '1.5rem' }}>Sign Up</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label>Name</label>
            <input type="text" placeholder="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <label>Email</label>
            <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <label>Password</label>
            <input type="password" placeholder="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <label>Street Address</label>
            <input type="text" placeholder="Street Address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <label>Mobile Phone</label>
            <input type="tel" placeholder="Mobile Phone" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            {form.role === 'volunteer' && (
              <>
                <label>Time Window Available (e.g. 6-8pm)</label>
                <input type="text" placeholder="Time Window Available (e.g. 6-8pm)" required value={form.timeWindow} onChange={e => setForm({ ...form, timeWindow: e.target.value })} />
              </>
            )}
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="volunteer">Volunteer Driver</option>
            </select>
            {error && <div style={{ color: '#d32f2f', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#388e3c', marginBottom: '0.5rem', textAlign: 'center' }}>{success}</div>}
            <button
              type="submit"
              style={{
                width: '180px',
                background: '#b91c1c',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 0',
                margin: '1.5rem auto 0 auto',
                display: 'block',
                cursor: 'pointer',
                fontFamily: 'Inter, Arial, Helvetica, sans-serif',
                boxShadow: '0 2px 8px rgba(185,28,28,0.12)',
                letterSpacing: '0.03em',
                transition: 'background 0.2s',
                textAlign: 'center',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#a31515')}
              onMouseOut={e => (e.currentTarget.style.background = '#b91c1c')}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

