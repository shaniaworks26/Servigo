import { useEffect, useMemo, useState } from 'react';
import './App.css';

const USERS_KEY = 'servigo.users.v1';
const SESSION_KEY = 'servigo.session.v1';
const ITEMS_KEY = 'servigo.items.v1';

const PROVIDER_CATEGORIES = [
  'Electricians',
  'Plumbing',
  'AC & Refrigeration Technicians',
  'Appliance Repair Specialists',
  'Housekeepers & Deep Cleaners',
  'Carpet & Upholstery Cleaners',
  'Pest Control Specialists',
];

function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [status, setStatus] = useState('checking');
  const [users, setUsers] = useState(() => loadJson(USERS_KEY, []));
  const [session, setSession] = useState(() => loadJson(SESSION_KEY, null));
  const [items, setItems] = useState(() => loadJson(ITEMS_KEY, []));
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [profileName, setProfileName] = useState('');

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
  }, [apiBaseUrl]);

  useEffect(() => {
    saveJson(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    saveJson(SESSION_KEY, session);
  }, [session]);

  useEffect(() => {
    saveJson(ITEMS_KEY, items);
  }, [items]);

  const currentUser = useMemo(() => {
    if (!session?.email) return null;
    return users.find((user) => user.email === session.email) || null;
  }, [session, users]);

  const userItems = useMemo(() => {
    if (!currentUser) return [];
    return items.filter((item) => item.ownerEmail === currentUser.email);
  }, [currentUser, items]);

  function handleSignup(formData) {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!name || !email || password.length < 6) {
      setAuthError('Use a valid name, email, and password (min 6 chars).');
      return;
    }

    if (users.some((user) => user.email === email)) {
      setAuthError('Email already exists. Please log in.');
      return;
    }

    const nextUsers = [...users, { name, email, password }];
    setUsers(nextUsers);
    setSession({ email });
    setProfileName(name);
    setAuthError('');
  }

  function handleLogin(formData) {
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const match = users.find((user) => user.email === email && user.password === password);

    if (!match) {
      setAuthError('Invalid email or password.');
      return;
    }

    setSession({ email: match.email });
    setProfileName(match.name);
    setAuthError('');
  }

  function handleAuthSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (authMode === 'signup') {
      handleSignup(formData);
    } else {
      handleLogin(formData);
    }
  }

  function handleLogout() {
    setSession(null);
    setProfileName('');
    setAuthMode('login');
    setAuthError('');
  }

  function createItem(event) {
    event.preventDefault();
    if (!currentUser) return;

    const title = itemInput.trim();
    if (!title) return;

    const nextItem = {
      id: id(),
      ownerEmail: currentUser.email,
      title,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [nextItem, ...prev]);
    setItemInput('');
  }

  function deleteItem(itemId) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function updateProfile(event) {
    event.preventDefault();
    if (!currentUser) return;

    const nextName = profileName.trim();
    if (!nextName) return;

    setUsers((prev) =>
      prev.map((user) => (user.email === currentUser.email ? { ...user, name: nextName } : user)),
    );
  }

  return (
    <main className="app-shell">
      <header className="card hero">
        <h1>ServiGo</h1>
        <p>Service provider marketplace web app.</p>
        <p className={`status status-${status}`}>Backend connectivity: {status}</p>
      </header>

      <section className="card">
        <h2>Service Provider Categories</h2>
        <ul className="provider-category-list">
          {PROVIDER_CATEGORIES.map((category) => (
            <li key={category} className="provider-category-item">
              {category}
            </li>
          ))}
        </ul>
      </section>

      {!currentUser ? (
        <section className="card auth-card">
          <div className="auth-switch" role="tablist" aria-label="Auth mode">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={authMode === 'login' ? 'active' : ''}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={authMode === 'signup' ? 'active' : ''}
            >
              Sign up
            </button>
          </div>

          <form className="stack" onSubmit={handleAuthSubmit}>
            {authMode === 'signup' ? (
              <label>
                Full name
                <input name="name" type="text" placeholder="Jordan Smith" required />
              </label>
            ) : null}

            <label>
              Email
              <input name="email" type="email" placeholder="name@example.com" required />
            </label>

            <label>
              Password
              <input name="password" type="password" placeholder="At least 6 characters" required />
            </label>

            {authError ? <p className="error">{authError}</p> : null}

            <button className="primary" type="submit">
              {authMode === 'signup' ? 'Create account' : 'Log in'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="card profile-card">
            <h2>Welcome, {currentUser.name}</h2>
            <p>You are logged in as {currentUser.email}.</p>
            <form className="inline-form" onSubmit={updateProfile}>
              <label>
                Update name
                <input
                  type="text"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  placeholder={currentUser.name}
                />
              </label>
              <button type="submit">Save profile</button>
            </form>
            <button type="button" className="ghost" onClick={handleLogout}>
              Log out
            </button>
          </section>

          <section className="card data-card">
            <h2>Service Requests</h2>
            <form className="inline-form" onSubmit={createItem}>
              <label>
                New request
                <input
                  type="text"
                  value={itemInput}
                  onChange={(event) => setItemInput(event.target.value)}
                  placeholder="e.g. Need deep cleaning this Saturday"
                />
              </label>
              <button className="primary" type="submit">Add</button>
            </form>

            {userItems.length === 0 ? (
              <p className="empty">No service requests yet.</p>
            ) : (
              <ul className="item-list">
                {userItems.map((item) => (
                  <li key={item.id} className="item-row">
                    <span>{item.title}</span>
                    <button type="button" onClick={() => deleteItem(item.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
