"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useStyles from './style';
import { useUserActions, useUserState } from '../providers/userProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles();
  const { user } = useUserState();
  const { logout } = useUserActions();
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Proposals', path: '/proposals' },
    { label: 'Contracts', path: '/contracts' },
    { label: 'Activities', path: '/activities' },
  ];

  const handleLogout = () => {
    logout();
    
    // 2. Redirect to login
    router.push('/login');
  };

useEffect(() => {
  if (user) {
    console.log("User has loaded:", user);
  } else {
    console.log("User is currently null (waiting for hydration...)");
  }
}, [user]); // This triggers every time 'user' changes

  return (
    <div className={styles.container}>
      {/* SHARED HEADER */}
      <header className={styles.header}>
        <div className={styles.welcomeText}>
          Welcome<br />{user?.firstName || 'User'}
        </div>
        <h1 className={styles.logo}>Accel</h1>
      </header>

      {/* SHARED SIDEBAR */}
      <aside className={styles.sidebar}>
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`${styles.navButton} ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
          >
            {item.label}
          </div>
        ))}
        
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}