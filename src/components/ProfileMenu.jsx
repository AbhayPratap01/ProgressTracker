import React, { useState, useRef, useEffect } from 'react';
import { deleteUser } from 'firebase/auth';
import { auth } from '../firebase';

export default function ProfileMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all data.')) {
      try {
        await deleteUser(auth.currentUser);
        logout();
      } catch (error) {
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  if (!user) return null;

  const initials = user.email
    .split('@')[0]
    .split('.')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = ['#00ff88', '#00aaff', '#ffd60a', '#c77dff'];
  const colorIndex = user.email.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  const hasPhoto = user.photoURL && user.photoURL.trim() !== '';

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button
        className="profile-avatar"
        onClick={() => setOpen(!open)}
        title="Account"
      >
        <div className="avatar-inner" style={hasPhoto ? { backgroundImage: `url(${user.photoURL})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: bgColor }}>
          {!hasPhoto && initials}
        </div>
      </button>

      {open && (
        <div className="profile-dropdown">
          <button className="profile-option" onClick={logout}>
            Sign out
          </button>
          <button className="profile-option profile-delete" onClick={handleDeleteUser}>
            Delete account
          </button>
        </div>
      )}
    </div>
  );
}
