import React, { useState } from 'react';

export default function Auth({ login, register, authError, onGuest, loginWithGoogle }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isRegister = mode === 'register';

  function handleSubmit(event) {
    event.preventDefault();
    if (isRegister) {
      if (!email || !password) {
        return;
      }
      if (password !== confirmPassword) {
        return;
      }
      register(email, password);
      return;
    }

    login(email, password);
  }

  return (
    <div className="auth-card">
      <div className="auth-brand">
        <div className="brand-logo">SWE QUEST</div>
        <div className="brand-sub">Sign in to sync your progress across devices.</div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="At least 6 characters"
          />
        </label>

        {isRegister && (
          <label>
            Confirm
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat password"
            />
          </label>
        )}

        {authError && <div className="auth-error">{authError}</div>}

        <button type="submit" className="btn btn-green" style={{ width: '100%' }}>
          {isRegister ? 'Create account' : 'Sign in'}
        </button>
        <button type="button" className="btn btn-blue" style={{ width: '100%' }} onClick={loginWithGoogle}>
          Sign in with Google
        </button>
      </form>

      <div className="auth-actions">
        <button className="btn btn-link" onClick={() => setMode(isRegister ? 'login' : 'register')}>
          {isRegister ? 'Already have an account? Sign in' : 'New here? Create account'}
        </button>
        <button className="btn" onClick={onGuest}>
          Continue as guest
        </button>
      </div>
    </div>
  );
}
