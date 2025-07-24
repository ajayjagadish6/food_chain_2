import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileMenu from "../components/ProfileMenu";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function RecipientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  type Delivery = {
    id: number;
    pickupAddress: string;
    deliveryAddress: string;
    pickupTime: string;
    deliveryTime: string;
    status: string;
  };
  type FoodRequest = {
    id: number;
    date: string;
    time: string;
    foodType: string;
    serves: number;
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-green-50" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        {matchNotification && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#1976d2', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 700, zIndex: 1000 }}>
            Matched with donor: {matchNotification.name} ({matchNotification.address})
          </div>
        )}
        <div style={{ position: 'relative', width: '100%', height: '100px' }}>
          <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/recipient-dashboard'}>
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
              <h2 style={{ fontWeight: 700, fontSize: '2rem', color: '#b91c1c' }}>Your Food Requests</h2>
              <Link href="/recipient" style={{ background: '#b91c1c', color: '#fff', borderRadius: '0.75rem', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(185,28,28,0.12)', transition: 'background 0.2s' }}>New Food Request</Link>
            </div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div>
                <label style={{ fontWeight: 600 }}>Date:</label>
                <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Food Type:</label>
                <select value={filters.foodType} onChange={e => setFilters(f => ({ ...f, foodType: e.target.value }))} style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}>
                  <option value="">All</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="NonVegetarian">Non-Vegetarian</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Date</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Time</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Food Type</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Serves</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No food requests found.</td></tr>
                ) : (
                  requests.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{new Date(r.date).toISOString().slice(0, 10)}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{r.time}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{r.foodType}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{r.serves}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                        {r.delivery ? (
                          <span>
                            {r.delivery.status} | Pickup: {r.delivery.pickupAddress} | Delivery: {r.delivery.deliveryAddress}
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

