import Image from "next/image";
import React, { useState } from 'react';
import ProfileMenu from '../components/ProfileMenu';
import { useSession, SessionProvider } from 'next-auth/react';


interface RecipientForm {
  date: string;
  time: string;
  foodType: string;
  serves: number;
}

function Recipient() {
  const [form, setForm] = useState<RecipientForm>({ date: '', time: '', foodType: 'Vegetarian', serves: 1 });
  const { data: session } = useSession();
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const payload: RecipientForm & { email?: string } = { ...form };
    if (session?.user?.email) payload.email = session.user.email;
    const res = await fetch('/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setMessage('Request submitted!');
    else setMessage('Failed to submit request');
  }

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
      {/* Top bar with logo and logout button */}
      <div style={{ position: 'relative', width: '100%', height: '100px' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/recipient-dashboard'}>
            <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
          </button>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProfileMenu />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '2rem', fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
            Food Request: Make A Request
          </span>
        </div>
        <form
          className="bg-white p-8 rounded shadow-md mb-8"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', width: '380px', maxWidth: '95vw' }}
        >
          <label style={{ fontWeight: 600, marginBottom: '0.25rem', textAlign: 'left' }}>Date</label>
          <input type="date" className="input" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          <label style={{ fontWeight: 600, marginBottom: '0.25rem', textAlign: 'left' }}>Time</label>
          <input type="text" placeholder="Time (e.g. 6:00pm)" className="input" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          <label style={{ fontWeight: 600, textAlign: 'left' }}>Food Type</label>
          <select className="input" value={form.foodType} onChange={e => setForm({ ...form, foodType: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }}>
            <option value="Vegetarian">Vegetarian</option>
            <option value="NonVegetarian">Non-Vegetarian</option>
            <option value="Both">Both</option>
          </select>
          <label style={{ fontWeight: 600, textAlign: 'left' }}>Number Of People That Need Food</label>
          <input type="number" min={1} className="input" placeholder="Serves" required value={form.serves} onChange={e => setForm({ ...form, serves: Number(e.target.value) })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
          {message && <div className="text-yellow-600" style={{ width: '100%', textAlign: 'center' }}>{message}</div>}
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
              Submit Request
            </button>
          </div>
        </form>
      {/* Filter Donation and Available Donations sections removed */}
      </div>
    </div>
  );
}

export default function RecipientPageWithProvider() {
  return (
    <SessionProvider>
      <Recipient />
    </SessionProvider>
  );
}

