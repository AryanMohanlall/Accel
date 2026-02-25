"use client";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({

  wrapper: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f0f2f5;
    border-radius: 24px;
    overflow: hidden;
    max-height: 100%;
  `,

  board: css`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    overflow: hidden;
    border-bottom: 3px solid #000;
    min-height: 0;
    max-height: calc(100% - 80px);
  `,

  spinWrapper: css`
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  column: css`
    display: flex;
    flex-direction: column;
    border-right: 2px solid #000;
    overflow: hidden;
    min-height: 0;
    max-height: 100%;
    &:last-child { border-right: none; }
  `,

  columnHeader: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #fff;
    border-bottom: 2px solid #000;
    flex-shrink: 0;
  `,

  stageIndicator: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  `,

  columnTitle: css`
    margin: 0 !important;
    font-size: 0.82rem !important;
    font-weight: 700 !important;
    flex: 1;
  `,

  columnCount: css`
    background: #000;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 10px;
    padding: 0px 6px;
    line-height: 1.6;
  `,

  columnBody: css`
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #e8eaed;
    min-height: 0;
    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
  `,

  empty: css`
    margin: auto;
    opacity: 0.5;
  `,

  emptyText: css`
    font-size: 0.7rem;
    color: #999;
  `,

  /* --- Card --- */
  card: css`
    background: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    &:hover {
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }
  `,

  cardSelected: css`
    border-color: #00b86e !important;
    box-shadow: 0 0 0 2px rgba(0, 184, 110, 0.2) !important;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 2px;
  `,

  cardTitle: css`
    font-size: 0.78rem;
    font-weight: 700;
    color: #111;
    line-height: 1.2;
  `,

  probabilityTag: css`
    background: #f0f0f0;
    border: none;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0 4px;
    border-radius: 5px;
    flex-shrink: 0;
    line-height: 1.6;
  `,

  clientName: css`
    font-size: 0.68rem;
    color: #666;
    display: block;
    margin-bottom: 4px;
  `,

  cardRow: css`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
  `,

  cardIcon: css`
    font-size: 0.6rem;
    color: #999;
  `,

  cardMeta: css`
    font-size: 0.68rem;
    color: #888;
  `,

  cardValue: css`
    font-size: 0.72rem;
    font-weight: 700;
    color: #00b86e;
  `,

  cardFooter: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #f0f0f0;
  `,

  cardDate: css`
    font-size: 0.62rem;
    color: #aaa;
  `,

  ownerAvatar: css`
    background: #514b4b !important;
    font-size: 0.55rem !important;
    flex-shrink: 0;
    width: 18px !important;
    height: 18px !important;
    line-height: 18px !important;
  `,

  /* --- Action Bar --- */
  actionBar: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding:  16px;
    background: #000;
    flex-shrink: 0;
    height: 80px;
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
    &:hover { background: #00b86e !important; color: #fff !important; }
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
    &:hover { background: #333 !important; color: #fff !important; }
  `,

  btnDisabled: css`
    opacity: 0.4 !important;
  `,

  searchInput: css`
    margin-left: auto;
    width: 180px;
    border-radius: 10px !important;
    background: #222 !important;
    border: 1px solid #444 !important;
    color: #fff !important;
    height: 34px;
    .ant-input { background: transparent !important; color: #fff !important; }
    .ant-input::placeholder { color: #888 !important; }
    .ant-input-clear-icon { color: #888 !important; }
  `,

  searchIcon: css`
    color: #667;
  `,
}));

export default useStyles;