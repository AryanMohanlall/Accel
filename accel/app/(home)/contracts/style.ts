"use client";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #000;
    border-radius: 24px;
    overflow: hidden;
    max-height: 100%;
  `,

  gridWrapper: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    background: #000;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 2px;
    }
  `,

  spinWrapper: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  `,

  /* --- Card --- */
  card: css`
    background: #d9d9d9;
    border-radius: 20px;
    padding: 14px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
    }
  `,

  cardSelected: css`
    border-color: #00b86e !important;
    box-shadow: 0 0 0 2px rgba(0, 184, 110, 0.3) !important;
  `,

  cardExpiring: css`
    border-color: #faad14 !important;
  `,

  cardTop: css`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  `,

  statusTag: css`
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 6px;
    padding: 0 6px;
    border: none;
    line-height: 1.8;
  `,

  expiringTag: css`
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 6px;
    padding: 0 6px;
    border: none;
    line-height: 1.8;
  `,

  cardMiddle: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  `,

  contractIcon: css`
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 4px;
  `,

  cardTitle: css`
    font-size: 0.9rem;
    font-weight: 700;
    color: #111;
    line-height: 1.3;
  `,

  cardNumber: css`
    font-size: 0.68rem;
    font-family: monospace;
    color: #666;
  `,

  clientName: css`
    font-size: 0.72rem;
    color: #555;
    margin-top: 2px;
  `,

  cardMeta: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  `,

  metaValue: css`
    font-size: 0.82rem;
    font-weight: 700;
    color: #00b86e;
  `,

  metaDates: css`
    font-size: 0.65rem;
    color: #777;
  `,

  /* --- Footer indicators --- */
  cardFooter: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2px;
  `,

  indicator: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,

  indicatorLabel: css`
    font-size: 0.65rem;
    color: #666;
  `,

  iconSuccess: css`
    font-size: 1.4rem;
    color: #52c41a;
  `,

  iconDanger: css`
    font-size: 1.4rem;
    color: #ff4d4f;
  `,

  iconMuted: css`
    font-size: 1.4rem;
    color: #ccc;
  `,

  /* --- Action Bar --- */
  actionBar: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #000;
    flex-shrink: 0;
    height: 56px;
    border-top: 1px solid #222;
  `,

  btnCreate: css`
    background: #fff !important;
    color: #000 !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    height: 34px !important;
    padding: 0 16px !important;
    font-size: 0.82rem !important;
    &:hover {
      background: #00b86e !important;
      color: #fff !important;
    }
  `,

  btnAction: css`
    background: #fff !important;
    color: #000 !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    height: 34px !important;
    padding: 0 16px !important;
    font-size: 0.82rem !important;
    &:hover {
      background: #333 !important;
      color: #fff !important;
    }
  `,

  btnDisabled: css`
    opacity: 0.4 !important;
  `,

  searchInput: css`
    margin-left: auto;
    width: 200px;
    border-radius: 10px !important;
    background: #222 !important;
    border: 1px solid #444 !important;
    height: 34px;
    .ant-input {
      background: transparent !important;
      color: #fff !important;
    }
    .ant-input::placeholder {
      color: #888 !important;
    }
    .ant-input-clear-icon {
      color: #888 !important;
    }
  `,

  searchIcon: css`
    color: #667;
  `,
}));

export default useStyles;
