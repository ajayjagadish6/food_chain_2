import Image from "next/image";
import React, { useState, useEffect } from 'react';

export default function Profile() {
  type ProfileType = {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<ProfileType>({ name: '', email: '', address: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Profile fetch failed: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setForm(data);
      })
      .catch(err => {
        setMessage(err.message || 'Failed to load profile.');
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Profile updated!');
      setEdit(false);
      setProfile(form);
    } else setMessage('Failed to update profile');
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <Image
          src="/truck-icon.png"
          alt="FoodChain Icon"
          width={120}
          height={120}
          style={{objectFit: 'contain', marginBottom: '1.5rem', cursor: 'pointer'}}
          onClick={() => {
            // Dynamic truck icon destination based on userRole (case-insensitive, fallback to dashboard if missing)
            const cookies = document.cookie.split(';').reduce((acc, c) => {
              const [k, v] = c.trim().split('='); acc[k] = v ? v.toLowerCase() : ''; return acc;
            }, {} as Record<string, string>);
            const role = cookies.userRole;
            if (role === 'donor') {
              window.location.href = '/donor-dashboard';
            } else if (role === 'recipient') {
              window.location.href = '/recipient-dashboard';
            } else if (role === 'volunteer') {
              window.location.href = '/driver-dashboard';
            } else {
              // Fallback: try to infer from profile data
              if (profile?.email?.includes('donor')) window.location.href = '/donor-dashboard';
              else if (profile?.email?.includes('recipient')) window.location.href = '/recipient-dashboard';
              else if (profile?.email?.includes('volunteer')) window.location.href = '/driver-dashboard';
              else window.location.href = '/recipient-dashboard';
            }
          }}
        />
        <h2 className="text-2xl font-bold mb-6" style={{textAlign: 'center', color: '#b91c1c'}}>Profile</h2>
        {edit ? (
          <form onSubmit={handleSave} className="w-full flex flex-col items-center">
            <input type="text" className="input mb-4 w-full" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input type="email" className="input mb-4 w-full" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
            <input type="text" className="input mb-4 w-full" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
            <input type="tel" className="input mb-6 w-full" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
            <button className="w-full mb-3" type="submit" style={{background: '#b91c1c', color: '#fff', fontWeight: 700, fontSize: '1.2rem', border: 'none', borderRadius: '0.75rem', padding: '1rem 0', cursor: 'pointer', fontFamily: 'Inter, Arial, Helvetica, sans-serif', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', letterSpacing: '0.03em', transition: 'background 0.2s'}}>Save</button>
            <button className="w-full" type="button" onClick={() => setEdit(false)} style={{background: '#e5e7eb', color: '#333', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 0', cursor: 'pointer', fontFamily: 'Inter, Arial, Helvetica, sans-serif', marginBottom: '0.5rem'}}>Cancel</button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center" style={{gap: '2rem'}}>
            <div className="w-full text-lg" style={{textAlign: 'center', marginBottom: '1.5rem'}}><b>Name:</b> {profile?.name}</div>
            <div className="w-full text-lg" style={{textAlign: 'center', marginBottom: '1.5rem'}}><b>Email:</b> {profile?.email}</div>
            <div className="w-full text-lg" style={{textAlign: 'center', marginBottom: '1.5rem'}}><b>Address:</b> {profile?.address}</div>
            <div className="w-full text-lg" style={{textAlign: 'center', marginBottom: '1.5rem'}}><b>Phone:</b> {profile?.phone}</div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
              <button onClick={() => setEdit(true)} style={{background: '#b91c1c', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 2rem', marginTop: '1.5rem', cursor: 'pointer', fontFamily: 'Inter, Arial, Helvetica, sans-serif', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', letterSpacing: '0.03em', transition: 'background 0.2s'}}>Edit Profile</button>
            </div>
          </div>
        )}
        {message && <div className="text-green-600 mt-4" style={{textAlign: 'center'}}>{message}</div>}
      </div>
    </div>
  );
}

