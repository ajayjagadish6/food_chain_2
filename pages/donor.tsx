import Image from "next/image";
import React, { useState } from 'react';
import ProfileMenu from '../components/ProfileMenu';
import { useSession, SessionProvider } from 'next-auth/react';


interface DonorForm {
  date: string;
  timeWindow: string;
  foodType: string;
  serves: number;
}

function Donor() {
  const [form, setForm] = useState<DonorForm>({ date: '', timeWindow: '', foodType: 'Vegetarian', serves: 1 });
  const { data: session } = useSession();
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const payload: DonorForm & { email?: string } = {
      date: form.date,
      timeWindow: form.timeWindow,
      foodType: form.foodType,
      serves: form.serves,
    };
    if (session?.user?.email) payload.email = session.user.email;
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setMessage('Donation submitted!');
    else {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error ? err.error : 'Failed to submit donation');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-green-50" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
      {/* Top bar with logo and logout button */}
      <div style={{ position: 'relative', width: '100%', height: '100px' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/donor-dashboard'}>
            <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
          </button>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProfileMenu />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <form
          className="bg-white p-8 rounded shadow-md mb-8"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', width: '380px', maxWidth: '95vw' }}
        >
          <h2
            style={{
              textAlign: 'center',
              color: '#b91c1c',
              fontWeight: 700,
              fontSize: '2rem',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, Arial, Helvetica, sans-serif',
            }}
          >
            Donor: Submit Donation
          </h2>
          <label style={{ fontWeight: 600, marginBottom: '0.25rem', textAlign: 'left' }}>Date</label>
          <input type="date" className="input" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          <label style={{ fontWeight: 600, marginBottom: '0.25rem', textAlign: 'left' }}>Time Window</label>
          <input type="text" placeholder="Time Window (e.g. 6-8pm)" className="input" required value={form.timeWindow} onChange={e => setForm({ ...form, timeWindow: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, textAlign: 'left' }}>Food Type</label>
            <select className="input" value={form.foodType} onChange={e => setForm({ ...form, foodType: e.target.value })} style={{ width: '100%', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }}>
              <option value="Vegetarian">Vegetarian</option>
              <option value="NonVegetarian">Non-Vegetarian</option>
              <option value="Both">Both</option>
            </select>
            <label style={{ fontWeight: 600, textAlign: 'left' }}>Number of people the food can feed</label>
            <input type="number" min={1} className="input" placeholder="Serves" required value={form.serves} onChange={e => setForm({ ...form, serves: Number(e.target.value) })} style={{ width: '100%', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          </div>
          {message && <div className="text-green-600" style={{ width: '100%', textAlign: 'center' }}>{message}</div>}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                width: '320px',
                background: '#b91c1c',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 0',
                marginTop: '1.5rem',
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
              Submit Donation
            </button>
          </div>
        </form>
      {/* Removed Filter Requests and Food Requests sections as requested */}
      </div>
    </div>
  );
}

export default function DonorPageWithProvider() {
  return (
    <SessionProvider>
      <Donor />
    </SessionProvider>
  );
}

