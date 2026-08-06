import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('checking');
  const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBaseUrl}/api/ping`)
      .then((response) => {
        if (!cancelled) {
          setStatus(response.ok ? 'online' : 'degraded');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('offline');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', lineHeight: 1.5 }}>
      <h1>ServiGo</h1>
      <p>Deployment baseline is active.</p>
      <p>Backend connectivity: {status}</p>
    </main>
  );
}
