"use client";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => {
  return {
    glassPanel: css`
      width: 100%;
      height: 100%;
      background: rgba(90, 167, 152, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2vh;
      display: flex;
      flex-direction: column;
      gap: 0.6vh;
      overflow: hidden;
    `,

    sectionCard: css`
      background: #d9d9d9 !important;
      border-radius: 20px !important;
      .ant-card-body {
        padding: 1vh 20px !important;
      }
    `,

    sectionTitle: css`
      margin-bottom: 0.5vh !important;
      font-weight: 600 !important;
    `,

    statBox: css`
      background: #514b4b;
      border-radius: 15px;
      height: 9vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      .ant-statistic-content {
        line-height: 1;
      }
      .ant-statistic-title {
        margin-bottom: 2px;
      }
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 15px rgba(0, 184, 110, 0.4);
      }
    `,

    statBoxLabel: css`
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
    `,

    statBoxValue: css`
      font-size: 0.7rem;
      color: #00b86e;
    `,

    revenueBox: css`
      background: #838769;
      border-radius: 12px;
      height: 5.5vh;
      .ant-statistic-content {
        display: flex;
        align-items: center;
      }
    `,

    revenueLabel: css`
      color: #fff;
      opacity: 0.8;
      font-size: 0.75rem;
    `,

    revenueValue: css`
      color: #fff;
      font-size: 0.9rem;
      font-weight: 700;
      margin-left: 4px;
    `,

    summaryTile: css`
      background: #d9d9d9;
      border-radius: 20px;
      height: 14vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-statistic-title {
        font-size: 0.8rem;
        color: #000;
        opacity: 0.6;
        text-align: center;
      }
      .ant-statistic-content {
        font-size: 2.2rem;
        font-weight: 700;
        text-align: center;
      }
    `,

    summaryTileHighlight: css`
      background: #000000;
      border: 2px solid #00b86e;
      color : #00b86e;
      border-radius: 20px;
      height: 14vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-statistic-title {
        font-size: 0.8rem;
        color: #00b86e;
        opacity: 0.8;
        text-align: center;
      }
      .ant-statistic-content {
        font-size: 2.2rem;
        font-weight: 700;
        text-align: center;
        color: #00b86e;
      }
    `,

    centered: css`
      justify-content: center;
      align-items: center;
    `,

    errorText: css`
      color: #fff;
    `,
  };
});

export default useStyles;