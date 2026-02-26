"use client";

import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      font-family: var(--font-inter-mono), monospace !important;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 10vh 1fr;
      background: url("/auth.jpg");
      background-size: cover;

      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        font-family: inherit;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `,
    header: css`
      grid-column: 1 / -1;
      background: #000000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      z-index: 10;
    `,
    welcomeText: css`
      color: #ffffff;
      font-size: 1.5rem;
      line-height: 1.1;
    `,
    logo: css`
      color: #ffffff;
      font-size: 4rem;
      font-weight: 400;
      letter-spacing: -0.02em;
    `,
    sidebar: css`
      background: rgba(158, 158, 158, 0.41);
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2vh 0;
      gap: 1.2vh;
      position: relative;
    `,
    navButton: css`
      width: 200px;
      height: 6.5vh;
      background: #d9d9d9;
      border: 1px solid #000000;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #000000;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: #eeeeee;
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }

      &.active {
        background: #000000;
        border-color: #005010;
        color: #00b86e;
        box-shadow: 0 0 15px rgba(0, 184, 110, 0.3);
        &:hover {
          background: #111111;
          box-shadow: 0 0 20px rgba(0, 184, 110, 0.5);
        }
      }
    `,
    logoutBtn: css`
      position: absolute;
      bottom: 3vh;
      width: 180px;
      height: 5vh;
      background: #000000;
      border: 1px solid #ffffff;
      border-radius: 12px;
      color: #ffffff;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #ffffff;
        color: #000000;
        transform: scale(1.05);
      }
    `,
    mainContent: css`
      padding: 3vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
    `,
    glassPanel: css`
      width: 100%;
      height: 100%;
      max-height: 100%;
      max-width: 1100px;
      background: rgba(90, 167, 152, 0.4);
      backdrop-filter: blur(5px);
      border-radius: 24px;
      padding: 3vh;
      display: flex;
      flex-direction: column;
      gap: 2vh;
      overflow-y: auto;
      min-height: 0;
      box-sizing: border-box;
    `,
    sectionCard: css`
      background: #d9d9d9;
      border-radius: 15px;
      padding: 1.5vh;
    `,
    sectionTitle: css`
      font-size: 1.2rem;
      margin-bottom: 0.8vh;
      color: #000000;
      font-weight: 600;
    `,
    statsGrid: css`
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    `,
    statBox: css`
      height: 10vh;
      background: #514b4b;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 0.9rem;
    `,
    revenueBox: css`
      height: 6vh;
      background: #838769;
      border-radius: 12px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    `,
  };
});

export default useStyles;
