export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ color: '#DC2626', fontSize: '48px', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>Page not found</p>
      <a href='/' style={{ color: '#DC2626', textDecoration: 'none', fontSize: '14px' }}>Return Home</a>
    </div>
  );
}
