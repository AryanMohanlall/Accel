"use client";

import React, { useEffect, useRef, useState } from "react";
import { createStyles, keyframes } from "antd-style";
import { Button, ConfigProvider, theme } from "antd";
import { useRouter, usePathname } from 'next/navigation';

// ── Keyframes ──────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scanline = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.05); }
`;

const gridMove = keyframes`
  0%   { background-position: 0 0; }
  100% { background-position: 60px 60px; }
`;

// ── Styles ─────────────────────────────────────────────────
const useStyles = createStyles(({ css, token }) => ({
  root: css`
    min-height: 100vh;
    background: #080808;
    color: #f0f0f0;
    font-family: 'Syne', 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
  `,

  // animated grid background
  gridBg: css`
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(0,184,110,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,184,110,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: ${gridMove} 8s linear infinite;
    pointer-events: none;
  `,

  // scanline sweep
  scanline: css`
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0,184,110,0.15), transparent);
      animation: ${scanline} 6s linear infinite;
    }
  `,

  // noise texture overlay
  noise: css`
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  `,

  content: css`
    position: relative;
    z-index: 10;
  `,

  // ── NAV ──
  nav: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 64px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(8,8,8,0.88);
    backdrop-filter: blur(16px);
    animation: ${fadeIn} 0.6s ease both;
  `,

  navLogo: css`
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #f0f0f0;
    span { color: #00B86E; }
  `,

  navLinks: css`
    display: flex;
    gap: 40px;
    list-style: none;
    margin: 0; padding: 0;
    a {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #666;
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: #00B86E; }
    }
  `,

  navCta: css`
    font-family: 'DM Mono', monospace !important;
    font-size: 11px !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    background: #00B86E !important;
    border-color: #00B86E !important;
    color: #080808 !important;
    font-weight: 600 !important;
    height: 38px !important;
    padding: 0 20px !important;
    border-radius: 2px !important;
    &:hover {
      background: #005010 !important;
      border-color: #005010 !important;
      color: #f0f0f0 !important;
    }
  `,

  // ── HERO ──
  hero: css`
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 64px;
    position: relative;
    overflow: hidden;
  `,

  heroGlow: css`
    position: absolute;
    top: -10%;
    right: -5%;
    width: 600px;
    height: 600px;
    background: radial-gradient(ellipse at center, rgba(0,184,110,0.12) 0%, transparent 65%);
    pointer-events: none;
    animation: ${pulse} 5s ease-in-out infinite;
  `,

  heroGlowBottom: css`
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(0,80,16,0.15) 0%, transparent 65%);
    pointer-events: none;
    animation: ${pulse} 7s ease-in-out infinite reverse;
  `,

  heroBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,184,110,0.08);
    border: 1px solid rgba(0,184,110,0.25);
    border-radius: 2px;
    padding: 6px 14px;
    margin-bottom: 32px;
    width: fit-content;
    animation: ${fadeUp} 0.7s ease 0.1s both;

    span {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #00B86E;
    }

    &::before {
      content: '';
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #00B86E;
      box-shadow: 0 0 8px #00B86E;
      animation: ${pulse} 2s ease-in-out infinite;
    }
  `,

  heroTitle: css`
    font-size: clamp(52px, 7vw, 96px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -3px;
    color: #f0f0f0;
    margin-bottom: 28px;
    animation: ${fadeUp} 0.7s ease 0.2s both;

    .accent {
      color: transparent;
      -webkit-text-stroke: 1.5px rgba(0,184,110,0.6);
    }

    .solid {
      color: #00B86E;
    }
  `,

  heroSub: css`
    font-size: 17px;
    font-weight: 400;
    line-height: 1.65;
    color: #666;
    max-width: 520px;
    margin-bottom: 48px;
    animation: ${fadeUp} 0.7s ease 0.3s both;
  `,

  heroActions: css`
    display: flex;
    align-items: center;
    gap: 20px;
    animation: ${fadeUp} 0.7s ease 0.4s both;
  `,

  btnPrimary: css`
    font-family: 'DM Mono', monospace !important;
    font-size: 12px !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    background: #00B86E !important;
    border-color: #00B86E !important;
    color: #080808 !important;
    font-weight: 600 !important;
    height: 48px !important;
    padding: 0 32px !important;
    border-radius: 2px !important;
    transition: all 0.2s !important;
    &:hover {
      background: #005010 !important;
      border-color: #005010 !important;
      color: #f0f0f0 !important;
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(0,184,110,0.25) !important;
    }
  `,

  btnSecondary: css`
    font-family: 'DM Mono', monospace !important;
    font-size: 12px !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    background: transparent !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    color: #888 !important;
    height: 48px !important;
    padding: 0 32px !important;
    border-radius: 2px !important;
    transition: all 0.2s !important;
    &:hover {
      border-color: rgba(0,184,110,0.4) !important;
      color: #00B86E !important;
    }
  `,

  heroStats: css`
    display: flex;
    gap: 48px;
    margin-top: 72px;
    padding-top: 48px;
    border-top: 1px solid rgba(255,255,255,0.05);
    animation: ${fadeUp} 0.7s ease 0.5s both;
  `,

  statItem: css`
    .num {
      font-size: 32px;
      font-weight: 800;
      color: #f0f0f0;
      letter-spacing: -1px;
      span { color: #00B86E; }
    }
    .label {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #444;
      margin-top: 4px;
    }
  `,

  // ── FEATURES SECTION ──
  section: css`
    padding: 120px 64px;
    position: relative;
  `,

  sectionLabel: css`
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #00B86E;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    &::before {
      content: '';
      width: 24px; height: 1px;
      background: #00B86E;
    }
  `,

  sectionTitle: css`
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: -1.5px;
    color: #f0f0f0;
    margin-bottom: 64px;
    line-height: 1.05;
  `,

  featureGrid: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
  `,

  featureCard: css`
    background: #0d0d0d;
    padding: 48px 48px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
    cursor: default;

    &:hover {
      background: #111;
      .featureIcon { color: #00B86E; border-color: rgba(0,184,110,0.4); background: rgba(0,184,110,0.08); }
      .featureGlow { opacity: 1; }
    }
  `,

  featureGlow: css`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse at top left, rgba(0,184,110,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  `,

  featureNumber: css`
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: #333;
    margin-bottom: 24px;
  `,

  featureIcon: css`
    width: 48px; height: 48px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #555;
    margin-bottom: 24px;
    transition: all 0.3s;
    background: rgba(255,255,255,0.02);
  `,

  featureTitle: css`
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #e0e0e0;
    margin-bottom: 12px;
  `,

  featureDesc: css`
    font-size: 14px;
    line-height: 1.7;
    color: #555;
    max-width: 320px;
  `,

  featureTag: css`
    display: inline-block;
    margin-top: 24px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #00B86E;
    background: rgba(0,184,110,0.08);
    border: 1px solid rgba(0,184,110,0.2);
    padding: 4px 10px;
    border-radius: 2px;
  `,

  // ── MARQUEE STRIP ──
  marqueeSection: css`
    padding: 32px 0;
    border-top: 1px solid rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    overflow: hidden;
    background: rgba(0,184,110,0.02);
  `,

  marqueeTrack: css`
    display: flex;
    gap: 64px;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `,

  marqueeItem: css`
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #2a2a2a;
    display: flex;
    align-items: center;
    gap: 64px;
    &::after {
      content: '◆';
      color: rgba(0,184,110,0.3);
      font-size: 8px;
    }
  `,

  // ── CTA SECTION ──
  ctaSection: css`
    padding: 120px 64px;
    position: relative;
    overflow: hidden;
  `,

  ctaInner: css`
    border: 1px solid rgba(0,184,110,0.2);
    background: linear-gradient(135deg, rgba(0,184,110,0.05) 0%, rgba(0,80,16,0.08) 100%);
    padding: 80px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -1px; left: 60px; right: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, #00B86E, transparent);
    }
  `,

  ctaCorner: css`
    position: absolute;
    width: 60px; height: 60px;
    &.tl { top: -1px; left: -1px; border-top: 2px solid #00B86E; border-left: 2px solid #00B86E; }
    &.tr { top: -1px; right: -1px; border-top: 2px solid #00B86E; border-right: 2px solid #00B86E; }
    &.bl { bottom: -1px; left: -1px; border-bottom: 2px solid #00B86E; border-left: 2px solid #00B86E; }
    &.br { bottom: -1px; right: -1px; border-bottom: 2px solid #00B86E; border-right: 2px solid #00B86E; }
  `,

  ctaGlow: css`
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 400px; height: 200px;
    background: radial-gradient(ellipse, rgba(0,184,110,0.08) 0%, transparent 70%);
    pointer-events: none;
  `,

  ctaTitle: css`
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800;
    letter-spacing: -2px;
    color: #f0f0f0;
    line-height: 1;
    margin-bottom: 20px;
    span { color: #00B86E; }
  `,

  ctaSub: css`
    font-size: 15px;
    color: #555;
    max-width: 440px;
    line-height: 1.6;
    margin-bottom: 40px;
  `,

  // ── FOOTER ──
  footer: css`
    padding: 40px 64px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  footerLogo: css`
    font-size: 16px;
    font-weight: 800;
    color: #333;
    span { color: #00B86E; opacity: 0.6; }
  `,

  footerMeta: css`
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #2a2a2a;
  `,
}));

// ── Feature data ───────────────────────────────────────────
const features = [
  {
    num: "01",
    icon: "◈",
    title: "Dashboard",
    desc: "Real-time pipeline visibility with intelligent KPIs. Monitor revenue health, team activity, and deal velocity from a single command centre.",
    tag: "Analytics",
  },
  {
    num: "02",
    icon: "◧",
    title: "Contracts",
    desc: "Generate, track, and execute contracts without leaving your workflow. Automated renewal alerts and clause management built in.",
    tag: "Documents",
  },
  {
    num: "03",
    icon: "◫",
    title: "Proposals",
    desc: "Professional proposals with dynamic line items, live totals, and multi-currency support. From draft to approved in minutes.",
    tag: "Revenue",
  },
  {
    num: "04",
    icon: "◉",
    title: "Activities",
    desc: "Every call, email, and meeting automatically logged against the right deal. Your team stays aligned without lifting a finger.",
    tag: "Automation",
  },
];

const marqueeItems = [
  "Pipeline Automation", "Smart Proposals", "Contract Management",
  "Activity Tracking", "CRM Integration", "Revenue Intelligence",
  "Pipeline Automation", "Smart Proposals", "Contract Management",
  "Activity Tracking", "CRM Integration", "Revenue Intelligence",
];

// ── Component ──────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const { styles, cx } = useStyles();
  
    const router = useRouter();


  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: "#00B86E", borderRadius: 2 },
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className={styles.root}>
        {/* atmosphere */}
        <div className={styles.gridBg} />
        <div className={styles.scanline} />
        <div className={styles.noise} />

        <div className={styles.content}>

          {/* ── NAV ── */}
          <nav className={styles.nav}>
            <div className={styles.navLogo}>
              Acc<span>e</span>l
            </div>
          
            <Button className={styles.navCta} onClick={()=>{router.replace('/login')}}>Get Started</Button>
          </nav>

          {/* ── HERO ── */}
          <section className={styles.hero}>
            <div className={styles.heroGlow} />
            <div className={styles.heroGlowBottom} />

            <div className={styles.heroBadge}>
              <span>Sales Automation System</span>
            </div>

            <h1 className={styles.heroTitle}>
              Close more.<br />
              <span className="accent">Work less.</span><br />
              <span className="solid">Sell smarter.</span>
            </h1>

            <p className={styles.heroSub}>
              A strategic technology layer that integrates with your CRM to eliminate
              repetitive manual work — allowing your team to focus on high-value closing activities.
            </p>

            <div className={styles.heroStats}>
              {[
                { num: "4×", label: "Faster Pipeline" },
                { num: "68<span>%</span>", label: "Less Manual Work" },
                { num: "12hr", label: "Saved Per Week" },
              ].map((s, i) => (
                <div className={styles.statItem} key={i}>
                  <div
                    className="num"
                    dangerouslySetInnerHTML={{ __html: s.num }}
                  />
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MARQUEE ── */}
          <div className={styles.marqueeSection}>
            <div className={styles.marqueeTrack}>
              {marqueeItems.map((item, i) => (
                <span className={styles.marqueeItem} key={i}>{item}</span>
              ))}
            </div>
          </div>

          {/* ── FEATURES ── */}
          <section className={styles.section} id="features">
            <div className={styles.sectionLabel}>Core Modules</div>
            <h2 className={styles.sectionTitle}>
              Everything your team needs.<br />Nothing they don't.
            </h2>

            <div className={styles.featureGrid}>
              {features.map((f, i) => (
                <div className={styles.featureCard} key={i}>
                  <div className={`${styles.featureGlow} featureGlow`} />
                  <div className={styles.featureNumber}>{f.num}</div>
                  <div className={`${styles.featureIcon} featureIcon`}>{f.icon}</div>
                  <div className={styles.featureTitle}>{f.title}</div>
                  <p className={styles.featureDesc}>{f.desc}</p>
                  <span className={styles.featureTag}>{f.tag}</span>
                </div>
              ))}
            </div>
          </section>


          {/* ── FOOTER ── */}
          <footer className={styles.footer}>
            <div className={styles.footerLogo}>
              Acc<span>e</span>l
            </div>
            <div className={styles.footerMeta}>
              © {new Date().getFullYear()} Accel · Sales Automation System
            </div>
          </footer>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default LandingPage;