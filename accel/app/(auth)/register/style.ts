"use client";

import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => {
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
      padding: 24px 0;
      box-sizing: border-box;
    `,
    logo: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(40px, 6vh, 80px);
      color: #ffffff;
      margin-bottom: 5px;
      font-weight: 400;
      line-height: 1;
    `,
    card: css`
      width: min(700px, 90vw);
      max-height: 88vh;
      background: rgba(199, 255, 211, 0.29);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2vh 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
      }
    `,
    title: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(24px, 4vh, 48px);
      color: #ffffff;
      margin-bottom: 1.5vh;
    `,
    label: css`
      font-family: "Inter", sans-serif;
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 2px;
      display: block;
      text-align: center;
    `,
    input: css`
      width: min(450px, 80vw) !important;
      height: clamp(35px, 5vh, 45px) !important;
      background: #d9d9d9 !important;
      border-radius: 12px !important;
      border: none !important;
      font-size: 16px !important;
      &:focus {
        background: #ffffff !important;
      }
    `,
    button: css`
      width: min(450px, 80vw) !important;
      height: clamp(45px, 6vh, 55px) !important;
      border-radius: 12px !important;
      margin-top: 1vh;
      font-size: 18px !important;
      background: #52c41a !important;
      border: none !important;
      font-weight: bold;
    `,
    formItem: css`
      margin-bottom: 1vh !important;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .ant-form-item-explain {
        font-size: 12px;
        position: absolute;
        bottom: -15px;
      }
    `,
  };
});

export default useStyles;
