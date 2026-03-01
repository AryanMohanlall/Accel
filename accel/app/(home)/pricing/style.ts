"use client";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background: #79797934;
    border-radius: 24px;
    overflow: hidden;
    min-height: 0;
  `,

  /* ── Filter bar ── */
  filterBar: css`
    padding: 10px 24px;
    background: #0a0a0a;
    border-bottom: 1px solid #1a1a1a;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
  `,

  segmented: css`
    background: #1a1a1a !important;
    .ant-segmented-item {
      color: #666 !important;
      font-size: 0.78rem !important;
      font-weight: 500 !important;
    }
    .ant-segmented-item-selected {
      background: #00b86e !important;
      color: #fff !important;
    }
    .ant-segmented-item:hover {
      color: #fff !important;
    }
  `,

  statsStrip: css`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
  `,

  statBadge: css`
    display: flex;
    align-items: center;
    gap: 5px;
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 3px 10px;
  `,

  statLabel: css`
    font-size: 0.7rem !important;
    color: #a4a4a4 !important;
  `,

  /* ── List ── */
  listWrapper: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 2px;
    }
  `,

  centered: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  `,

  /* ── Request card ── */
  requestCard: css`
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 14px;
    padding: 14px 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &:hover {
      border-color: #2e2e2e;
      background: #161616;
    }
  `,

  requestCardSelected: css`
    border-color: #00b86e !important;
    background: #0a1f15 !important;
    box-shadow: 0 0 0 1px rgba(0, 184, 110, 0.15);
  `,

  cardTop: css`
    display: flex;
    align-items: flex-start;
    gap: 10px;
  `,

  cardMeta: css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  `,

  requestNumber: css`
    font-size: 0.62rem !important;
    color: #959595 !important;
    font-family: monospace;
    letter-spacing: 0.04em;
  `,

  requestTitle: css`
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    color: #e8e8e8 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `,

  opportunityChip: css`
    font-size: 0.65rem !important;
    color: #cdcdcd !important;
  `,

  tagRow: css`
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  `,

  cardBottom: css`
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 8px;
    border-top: 1px solid #1e1e1e;
    flex-wrap: wrap;
  `,

  metaItem: css`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    color: #cccccc;
    .anticon {
      font-size: 0.65rem;
    }
  `,

  overdueText: css`
    color: #ff4d4f !important;
  `,

  completedText: css`
    color: #00b86e !important;
  `,

  assigneeAvatar: css`
    background: #1a1a1a !important;
    border: 1px solid #333 !important;
    color: #00b86e !important;
    font-size: 0.6rem !important;
    font-weight: 700 !important;
  `,

  /* ── Action bar ── */
  actionBar: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #000;
    flex-shrink: 0;
    height: 56px;
    border-top: 1px solid #1a1a1a;
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
    width: 220px;
    border-radius: 10px !important;
    background: #1a1a1a !important;
    border: 1px solid #333 !important;
    height: 34px;
    .ant-input {
      background: transparent !important;
      color: #fff !important;
    }
    .ant-input::placeholder {
      color: #555 !important;
    }
    .ant-input-clear-icon {
      color: #555 !important;
    }
  `,

  searchIcon: css`
    color: #444;
  `,
}));

export default useStyles;
