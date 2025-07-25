
interface Delivery {
  id: number;
  pickupAddress: string;
  deliveryAddress: string;
  pickupTime: string;
  deliveryTime: string;
  status: string;
  driverName: string | null;
}
interface Donation {
  id: number;
  date: string;
  timeWindow: string;
  foodType: string;
  serves: number;
  delivery: Delivery | null;
}

function DonorDashboard() {
  const [filters, setFilters] = useState<{ date: string }>({ date: "" });
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch donations from backend API
  useEffect(() => {
    async function cleanupAndFetchDonations() {
      // Remove all past Donation records for this donor
      if (session?.user?.email) {
        await fetch(`/api/donor/cleanup-old-donations?email=${encodeURIComponent(session.user.email)}`);
      }
      let url = "/api/donor/donations";
      if (session?.user?.email) {
        url += `?email=${encodeURIComponent(session.user.email)}`;
        if (filters.date) {
          url += `&date=${filters.date}`;
        }
      }
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setFetchError(err.error || 'Failed to fetch donations');
          setDonations([]);
          return;
        }
        const data = await res.json();
        setDonations(Array.isArray(data) ? data : []);
        setFetchError(null);
      } catch (e) {
        setFetchError('Network error while fetching donations');
        setDonations([]);
      }
    }
    cleanupAndFetchDonations();
  }, [filters.date, session?.user?.email]);

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
              {fetchError && (
                <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                  {fetchError}
                </div>
              )}
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
                  <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Actions</th>
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
                            {d.delivery.status}
                            {d.delivery.driverName ? ` by ${d.delivery.driverName}` : ''}
                            {d.delivery.pickupAddress && d.delivery.deliveryAddress && (
                              <>
                                {', '}
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(d.delivery.pickupAddress)}&destination=${encodeURIComponent(d.delivery.deliveryAddress)}`}
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
                        {!d.delivery && (
                          <button
                            style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
                            onClick={async () => {
                              await fetch(`/api/donor/cancel-donation?id=${d.id}`, { method: 'DELETE' });
                              // Refresh donations
                              let url = "/api/donor/donations";
                              if (session?.user?.email) {
                                url += `?email=${encodeURIComponent(session.user.email)}`;
                                if (filters.date) url += `&date=${filters.date}`;
                              }
                              const res = await fetch(url);
                              const data = await res.json();
                              setDonations(Array.isArray(data) ? data : []);
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
    </SessionProvider>
  );
}


export default function DonorDashboardWithProvider() {
  return (
    <SessionProvider>
      <DonorDashboard />
    </SessionProvider>
  );
}

