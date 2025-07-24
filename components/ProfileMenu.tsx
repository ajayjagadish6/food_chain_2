import React from "react";
import Link from "next/link";

export default function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  const handleToggle = () => setOpen(o => !o);
  // Close menu if clicked outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.profile-menu-root')) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);
  return (
    <div className="profile-menu-root" style={{ position: "relative", display: "inline-block" }}>
      <button
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
        title="Profile"
        aria-label="Profile menu"
        onClick={handleToggle}
      >
        <span style={{ fontSize: 28, color: "#b91c1c" }}>&#128100;</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            minWidth: 160,
            zIndex: 100,
            padding: "0.5rem 0",
          }}
        >
          <Link href="/profile" style={{ display: "block", padding: "0.75rem 1.5rem", color: "#b91c1c", fontWeight: 600, textDecoration: "none", fontSize: '1rem' }}>
            Profile
          </Link>
          <button
            style={{ display: "block", width: "100%", textAlign: "left", padding: "0.75rem 1.5rem", color: "#b91c1c", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: '1rem' }}
            onClick={async () => {
              const { signOut } = await import('next-auth/react');
              signOut({ callbackUrl: '/' });
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
