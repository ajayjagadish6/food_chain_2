import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "../components/ProfileMenu";

function DonorDashboard() {
  const [matchNotification, setMatchNotification] = useState<any>(null);
  const [filters, setFilters] = useState<{ date: string }>({ date: "" });
  const [donations, setDonations] = useState<any[]>([]);
  const { data: session } = useSession();

  // ...fetch donations and set matchNotification logic here...

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-green-50" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        {matchNotification && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#1976d2', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 700, zIndex: 1000 }}>
            Matched with recipient: {matchNotification.name} ({matchNotification.address})
          </div>
        )}
        <div style={{ position: 'relative', width: '100%', height: '100px' }}>
          <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/donor-dashboard'}>
              <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
            </button>
          </div>
          <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            {session?.user?.email && (
              <span style={{ color: '#1976d2', fontWeight: 600, marginRight: 12 }}>{session.user.email}</span>
            )}
            <ProfileMenu />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ width: '100%', maxWidth: 900, background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '2rem', color: '#b91c1c' }}>Your Donations</h2>
              <Link href="/donor" style={{ background: '#b91c1c', color: '#fff', borderRadius: '0.75rem', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', transition: 'background 0.2s' }}>New Donation</Link>
            </div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div>
                <label style={{ fontWeight: 600 }}>Date:</label>
                <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Date</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Time Window</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Food Type</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Serves</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No donations found.</td></tr>
                ) : (
                  donations.map((d, i) => (
                    <tr key={i}>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{new Date(d.date).toISOString().slice(0, 10)}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.timeWindow}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.foodType}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.serves}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                        {d.delivery ? (
                          <span>
                            {d.delivery.status} | Pickup: {d.delivery.pickupAddress} | Delivery: {d.delivery.deliveryAddress}
                          </span>
                        ) : (
                          <span style={{ color: '#888' }}>No delivery</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

import { PropsWithChildren } from "react";

export default function DonorDashboardWithProvider(props: PropsWithChildren<{}>) {
  return (
    <SessionProvider>
      <DonorDashboard {...props} />
    </SessionProvider>
  );
}

