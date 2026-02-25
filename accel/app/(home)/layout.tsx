"use client";

import React from 'react';
import useStyles from './style';
import { useUserState } from '../providers/userProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles();
  const { user } = useUserState();

  return (
    <div className={styles.container}>
      {/* SHARED HEADER */}
      <header className={styles.header}>
        <div className={styles.welcomeText}>
          Welcome<br />{user?.firstName || ''}
        </div>
        <h1 className={styles.logo}>Accel</h1>
      </header>

      {/* SHARED SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={`${styles.navButton} active`}>Dashboard</div>
        <div className={styles.navButton}>Opportunities</div>
        <div className={styles.navButton}>Proposals</div>
        <div className={styles.navButton}>Contracts</div>
        <div className={styles.navButton}>Activities</div>
        <button className={styles.logoutBtn}>Logout</button>
      </aside>

      {/* PAGE CONTENT */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}