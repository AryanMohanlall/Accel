"use client";

import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 100vh; /* Lock height to exactly the screen height */
      width: 100vw;
      overflow: hidden; /* Prevent scrolling */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: url("/auth.jpg");
      background-size: cover;
      background-position: center;
      padding: 20px; /* Reduced padding */
      box-sizing: border-box;
    `,
    logo: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(60px, 8vh, 100px); /* Scales based on screen height */
      color: #ffffff;
      margin-bottom: 10px; /* Reduced margin */
      font-weight: 400;
      line-height: 1;
    `,
    card: css`
      width: min(862px, 90vw);
      max-height: 85vh; /* Ensure card doesn't get too tall */
      background: rgba(199, 255, 211, 0.29);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px 60px; /* Reduced vertical padding */
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      overflow-y: auto; /* Just in case it's viewed on a very small laptop */
    `,
    title: css`
      font-family: "Inter", sans-serif;
      font-size: clamp(32px, 5vh, 64px); /* Responsive font size */
      color: #ffffff;
      margin-bottom: 20px;
    `,
    label: css`
      font-family: "Inter", sans-serif;
      font-size: 18px; /* Slightly smaller to save vertical space */
      color: #ffffff;
      margin-bottom: 4px;
      display: block;
      text-align: center;
    `,
    input: css`
      width: 500px !important;
      height: 50px !important; /* Reduced from 70px to save space */
      background: #d9d9d9 !important;
      border-radius: 15px !important;
      border: none !important;
      font-size: 18px !important;
      &:focus {
        background: #ffffff !important;
      }
    `,
    button: css`
      width: 500px !important;
      height: 60px !important; /* Slightly smaller */
      border-radius: 15px !important;
      margin-top: 20px; /* Reduced from 40px */
      font-size: 20px !important;
      background: #52c41a !important;
      border: none !important;
    `,
    /* Added to tighten up the Ant Design Form spacing */
    formItem: css`
      margin-bottom: 12px !important;
    `,
  };
});

export default useStyles;
