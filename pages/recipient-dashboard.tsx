import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileMenu from "../components/ProfileMenu";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";


interface Request {
  id: number;
  date: string;
  time: string;
  foodType: string;
  serves: number;
  delivery: any;
}

function RecipientDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filters, setFilters] = useState<{ date: string; foodType: string }>({ date: "", foodType: "" });
  const [requests, setRequests] = useState<Request[]>([]);

  // Fetch food requests from backend API
  useEffect(() => {
    async function cleanupAndFetchRequests() {
      // Remove all past FoodRequest records for this recipient
      if (session?.user?.email) {
        await fetch(`/api/recipient/cleanup-old-requests?email=${encodeURIComponent(session.user.email)}`);
      }
      let url = "/api/recipient/requests";
      const params = [];
      if (filters.date) params.push(`date=${filters.date}`);
      if (filters.foodType) params.push(`foodType=${filters.foodType}`);
      if (session?.user?.email) params.push(`email=${encodeURIComponent(session.user.email)}`);
      if (params.length) url += `?${params.join("&")}`;
      const res = await fetch(url);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    }
    if (session?.user?.email) cleanupAndFetchRequests();
  }, [filters.date, filters.foodType, session?.user?.email]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
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
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Actions</th>
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
                          {r.delivery.status}
                          {r.delivery.driverName ? ` by ${r.delivery.driverName}` : ''}
                          {r.delivery.pickupAddress && r.delivery.deliveryAddress && (
                            <>
                              {', '}
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(r.delivery.pickupAddress)}&destination=${encodeURIComponent(r.delivery.deliveryAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#1976d2', textDecoration: 'underline', marginLeft: 4 }}
                              >
                                View Route
                              </a>
                            </>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: '#888' }}>No delivery</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                      {!r.delivery && (
                        <button
                          style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
                          onClick={async () => {
                            await fetch(`/api/recipient/cancel-request?id=${r.id}`, { method: 'DELETE' });
                            // Refresh requests
                            let url = "/api/recipient/requests";
                            const params = [];
                            if (filters.date) params.push(`date=${filters.date}`);
                            if (filters.foodType) params.push(`foodType=${filters.foodType}`);
                            if (session?.user?.email) params.push(`email=${encodeURIComponent(session.user.email)}`);
                            if (params.length) url += `?${params.join("&")}`;
                            const res = await fetch(url);
                            const data = await res.json();
                            setRequests(Array.isArray(data) ? data : []);
                          }}
                        >
                          Cancel
                        </button>
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
  );
}

export default function RecipientDashboardWithProvider() {
  return (
    <SessionProvider>
      <RecipientDashboardContent />
    </SessionProvider>
  );
}
