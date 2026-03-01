"use client";

import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: url("/auth.jpg");
      background-size: cover;
      background-position: center;
      box-sizing: border-box;
    `,

    logo: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(32px, 5vh, 64px);
      color: #ffffff;
      margin-bottom: 8px;
      font-weight: 400;
      line-height: 1;
    `,

    card: css`
      width: min(620px, 92vw);
      background: rgba(199, 255, 211, 0.22);
      backdrop-filter: blur(12px);
      border-radius: 20px;
      padding: 24px 36px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      overflow: hidden;
    `,

    title: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(18px, 3vh, 28px);
      color: #ffffff;
      margin: 0 0 14px 0;
    `,

    /* ── Custom scenario switcher ── */
    scenarioSwitcher: css`
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      width: 100%;
      margin-bottom: 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 14px;
      padding: 5px;
    `,

    scenarioBtn: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 8px 6px;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;

      .scenario-icon {
        font-size: 18px;
        line-height: 1;
      }

      .scenario-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        line-height: 1.2;
        white-space: nowrap;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        .scenario-label {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    `,

    scenarioBtnActive: css`
      background: rgba(0, 184, 110, 0.25) !important;
      border-color: rgba(0, 184, 110, 0.5) !important;
      box-shadow: 0 2px 12px rgba(0, 184, 110, 0.2);

      .scenario-label {
        color: #fff !important;
        font-weight: 700 !important;
      }
    `,

    form: css`
      width: 100%;
    `,

    grid: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    `,

    label: css`
      font-family: "Inter", sans-serif;
      font-size: 13px;
      color: #ffffff;
      display: block;
    `,

    input: css`
      width: 100% !important;
      height: 38px !important;
      background: #d9d9d9 !important;
      border-radius: 10px !important;
      border: none !important;
      font-size: 14px !important;

      &:focus {
        background: #ffffff !important;
      }
    `,

    fullItem: css`
      margin-bottom: 8px !important;
      width: 100%;

      .ant-form-item-label label {
        color: #fff;
        font-size: 13px;
      }
    `,

    gridItem: css`
      margin-bottom: 8px !important;

      .ant-form-item-label label {
        color: #fff;
        font-size: 13px;
      }

      .ant-form-item-explain {
        font-size: 11px;
      }
    `,

    button: css`
      width: 100% !important;
      height: 42px !important;
      border-radius: 10px !important;
      margin-top: 6px;
      font-size: 16px !important;
      background: #52c41a !important;
      border: none !important;
      font-weight: bold;
    `,

    footer: css`
      margin-top: 8px;
      color: #fff;
      font-size: 13px;
      text-align: center;
    `,
  };
});

export default useStyles;