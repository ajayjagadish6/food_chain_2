"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfileMenu from "../components/ProfileMenu";
import { useSession, SessionProvider } from "next-auth/react";

function DriverDashboard() {
  // --- State and helpers ---
  type Delivery = {
    deliveryId: string;
    driverName: string;
    donorName: string;
    recipientName: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupTime: string;
    deliveryTime: string;
    status: string;
    createdAt: string;
  };

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [matchNotification, setMatchNotification] = useState<MatchNotification | null>(null);

  interface MatchNotification {
    donor: string;
    pickup: string;
    recipient: string;
    delivery: string;
    visible: boolean;
  }
  // Show notification if any delivery is Pending or Accepted
  useEffect(() => {
    if (deliveries.length > 0) {
      const pendingOrAccepted = deliveries.find(d => d.status === "Pending" || d.status === "Accepted");
      if (pendingOrAccepted) {
        setMatchNotification({
          donor: pendingOrAccepted.donorName,
          pickup: pendingOrAccepted.pickupAddress,
          recipient: pendingOrAccepted.recipientName,
          delivery: pendingOrAccepted.deliveryAddress,
          visible: true
        });
      } else {
        setMatchNotification(null);
      }
    } else {
      setMatchNotification(null);
    }
  }, [deliveries]);
  const { data: session, status } = useSession();

  // Status options and labels
  const statusOptions = ["Pending", "Accepted", "PickedUp", "Delivered", "Cancelled"];
  const statusLabels: { [key: string]: string } = {
    Pending: "Pending",
    Accepted: "Accepted",
    PickedUp: "Picked Up",
    Delivered: "Delivered",
    Cancelled: "Cancelled"
  };

  function normalizeStatus(status: string): string {
    // Normalize backend status to valid select value
    if (statusOptions.includes(status)) return status;
    return "Pending";
  }

  // Fetch deliveries on mount
  useEffect(() => {
    async function fetchDeliveries() {
      const res = await fetch("/api/driver/deliveries");
      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : []);
    }
    fetchDeliveries();
  }, []);

  // All state, helpers, and JSX must be inside the function
  return (
    <div className="min-h-screen flex flex-col bg-blue-50" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
      {matchNotification && matchNotification.visible !== false && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#1976d2', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 700, zIndex: 1000 }}>
          <span>
            New delivery: Donor {matchNotification.donor} ({matchNotification.pickup})  Recipient {matchNotification.recipient} ({matchNotification.delivery})
          </span>
          <button
            style={{ marginLeft: 24, background: '#fff', color: '#1976d2', border: 'none', borderRadius: 6, padding: '0.25rem 0.75rem', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setMatchNotification((prev: any) => ({ ...prev, visible: false }))}
          >
            Dismiss
          </button>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', height: '100px' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/driver-dashboard'}>
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
          <h2 style={{ fontWeight: 700, fontSize: '2rem', color: '#b91c1c', marginBottom: '2rem' }}>Your Food Deliveries</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Driver</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Donor</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Recipient</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Pickup Address</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Delivery Address</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Pickup Time</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Delivery Time</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Map</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No food deliveries found.</td></tr>
              ) : (
                deliveries.map((d, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                      {session?.user?.name && d.driverName === session.user.name ? 'You' : d.driverName || ''}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.donorName || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.recipientName || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.pickupAddress}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.deliveryAddress}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.pickupTime}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{d.deliveryTime}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                      <select
                        value={normalizeStatus(d.status)}
                        disabled={updatingId === d.deliveryId}
                        onChange={async (e) => {
                          if (!d.deliveryId) {
                            alert('Error: Delivery ID is missing.');
                            return;
                          }
                          setUpdatingId(d.deliveryId);
                          const newStatus = (e.target as HTMLSelectElement).value;
                          // Send valid enum value to backend
                          const res = await fetch("/api/driver/updateDeliveryStatus", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ deliveryId: d.deliveryId, status: newStatus, userId: (session?.user as any)?.id }),
                            credentials: "include"
                          });
                          if (res.ok) {
                            // Refresh deliveries from backend after update
                            const refreshed = await fetch("/api/driver/deliveries");
                            const refreshedData = await refreshed.json();
                            setDeliveries(Array.isArray(refreshedData) ? refreshedData : []);
                          }
                          setUpdatingId(null);
                        }}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', background: '#f5f5f5', fontWeight: 500 }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{statusLabels[opt]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                      {/* Route 1: Driver to Pickup (uses current location) */}
                      {d.pickupAddress ? (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d.pickupAddress)}&travelmode=driving`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, marginRight: 8 }}
                        >
                          To Pickup
                        </a>
                      ) : (
                        <span style={{ color: '#888', marginRight: 8 }}>N/A</span>
                      )}
                      {/* Route 2: Pickup to Delivery */}
                      {d.pickupAddress && d.deliveryAddress ? (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(d.pickupAddress)}&destination=${encodeURIComponent(d.deliveryAddress)}&travelmode=driving`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                        >
                          To Delivery
                        </a>
                      ) : (
                        <span style={{ color: '#888' }}>N/A</span>
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

export default function DriverDashboardWithProvider() {
  return (
    <SessionProvider>
      <DriverDashboard />
    </SessionProvider>
  );
}