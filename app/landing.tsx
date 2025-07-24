import Link from "next/link";
import Image from "next/image";

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.25rem', width: '100%', maxWidth: 600 }}>
        <Image src="/truck-icon.png" alt="FoodChain Icon" width={110} height={110} style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#d32f2f', margin: 0, textAlign: 'left', display: 'inline-block', verticalAlign: 'middle' }}>FoodChain</h1>
      </div>
      <div style={{ maxWidth: 800, textAlign: 'center', marginBottom: '1.25rem', color: '#333', fontSize: '1.15rem', lineHeight: 1.7 }}>
        <p style={{ marginBottom: '1rem' }}>
          FoodChain is a non-profit app that enables donation of leftover food to people in hunger every day. Hunger in America affects 1 in 7 people. The app aims to do it&apos;s part in alleviating the hunger problem and also reduce food waste.
        </p>
        <p>
          Restaurants, cafes and families with excess leftover food can donate instead of throwing away. The app enables them to submit their food donations online or on a mobile app. Similarly, food shelters and food aid organizations can submit food requests anytime on behalf of homeless and needy people. The system intelligently matches donations to requests and assigns it to volunteer drivers to pick up donations from donors and deliver it to recipients. Volunteers can be students and social workers willing to help.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link href="/login" style={{ background: '#d32f2f', color: '#fff', fontWeight: 700, fontSize: '1.2rem', borderRadius: '0.75rem', padding: '0.75rem 2.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(211,47,47,0.12)', transition: 'background 0.2s' }}>Login</Link>
        <Link href="/signup" style={{ background: '#d32f2f', color: '#fff', fontWeight: 700, fontSize: '1.2rem', borderRadius: '0.75rem', padding: '0.75rem 2.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(211,47,47,0.12)', transition: 'background 0.2s' }}>Signup</Link>
      </div>
    </div>
  );
}
