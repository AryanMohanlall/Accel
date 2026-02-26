"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import useStyles from './style';
import { useUserActions, useUserState } from '../providers/userProvider';
import { OpportunityProvider } from '../providers/opportunitiesProvider';
import { ProposalProvider } from '../providers/proposalsProvider';
import { ContractProvider } from '../providers/contractsProvider';
import { ActivityProvider } from '../providers/activitiesProvider';
import { ClientProvider } from '../providers/clientsProvider';
import { ContactProvider } from '../providers/contactsProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles();
  const { user } = useUserState();
  const { logout } = useUserActions();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard',     path: '/dashboard' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Proposals',     path: '/proposals' },
    { label: 'Contracts',     path: '/contracts' },
    { label: 'Activities',    path: '/activities' },
    {label: 'Clients & Contacts', path: '/clientscontacts'}
  ];

  const handleCopyTenantId = () => {
    if (!user?.tenantId) return;
    navigator.clipboard.writeText(user.tenantId).then(() => {
      message.success('Tenant ID copied to clipboard');
    });
  };

  useEffect(() => {
    if (user) {
      console.log("User has loaded:", user);
    } else {
      console.log("User is currently null (waiting for hydration...)");
    }
  }, [user]);

  return (
    <ContactProvider>
    <ClientProvider>
    <ActivityProvider>
    <ContractProvider>
    <OpportunityProvider>
      <ProposalProvider>
        <div className={styles.container}>

          {/* SHARED HEADER */}
          <header className={styles.header}>
            <div className={styles.welcomeText}>
              Welcome<br />{user?.firstName || 'User'} {user?.roles ? `|` : ``} {user?.roles || ''}
            </div>

            <h1 className={styles.logo}>Accel</h1>

            {/* TENANT ID */}
            {user?.tenantId && user?.roles?.includes('Admin') && (
              <Tooltip title="Share this ID with team members so they can join your organisation">
                <div
                  onClick={handleCopyTenantId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    cursor: 'pointer',
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: '0.65rem', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Tenant ID
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#00B86E',
                    fontFamily: 'monospace',
                    background: 'rgba(0,184,110,0.08)',
                    border: '1px solid rgba(0,184,110,0.25)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    {user.tenantId}
                    <CopyOutlined style={{ fontSize: '0.7rem', opacity: 0.7 }} />
                  </span>
                </div>
              </Tooltip>
            )}
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
            <div className={styles.logoutBtn} onClick={logout}>
              Logout
            </div>
          </aside>

          {/* PAGE CONTENT */}
          <main className={styles.mainContent}>
            {children}
          </main>

        </div>
      </ProposalProvider>
    </OpportunityProvider>
    </ContractProvider>
    </ActivityProvider>
    </ClientProvider>
    </ContactProvider>
  );
}