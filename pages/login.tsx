import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';

export default function Login() {
  const [form, setForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (result?.error) {
      setError('Login failed');
    } else {
      // After login, fetch session and redirect based on role
      const session = await getSession();
      type UserWithRole = typeof session.user & { role?: string };
      const user = session?.user as UserWithRole | undefined;
      const role = user?.role;
      if (role === 'donor') {
        router.push('/donor-dashboard');
      } else if (role === 'recipient') {
        router.push('/recipient-dashboard');
      } else if (role === 'volunteer') {
        router.push('/driver-dashboard');
      } else {
        router.push('/');
      }
    }
  }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', fontFamily: 'Inter, Arial, Helvetica, sans-serif', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(185,28,28,0.15)', padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '380px', maxWidth: '95vw' }}>
                  <form
                      onSubmit={handleSubmit}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', width: '100%' }}
                  >
                    <h2 style={{ textAlign: 'center', color: '#b91c1c', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>Log In</h2>
                    <label style={{ fontWeight: 600, marginBottom: '0.25rem', alignSelf: 'flex-start' }}>Email Address</label>
                    <input type="email" className="input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
                    <label style={{ fontWeight: 600, marginBottom: '0.25rem', alignSelf: 'flex-start' }}>Password</label>
                    <input type="password" className="input" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '320px', fontSize: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }} />
                    {error && <div className="text-red-500" style={{ width: '100%', textAlign: 'center' }}>{error}</div>}
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
                                marginBottom: '1.5rem',
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
                            Login
                        </button>
                    </div>
                  </form>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '-0.5rem' }}>
                  <Link href="/reset-password" style={{ color: '#b91c1c', textDecoration: 'underline', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Reset password</Link>
                  <Link href="/signup" style={{ color: '#333', textDecoration: 'underline', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Sign up for free</Link>
                </div>
            </div>
        </div>
    );
}

