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

  tableWrapper: css`
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .ant-table-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .ant-spin-nested-loading,
    .ant-spin-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .ant-table {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .ant-table-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .ant-table-header {
      flex-shrink: 0;
    }
    .ant-table-body {
      flex: 1;
      overflow-y: auto !important;
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
    }
    .ant-table-pagination {
      flex-shrink: 0;
      margin: 6px 16px !important;
    }
  `,

  table: css`
    height: 100%;

    .ant-table-thead > tr > th {
      background: #000 !important;
      color: #fff !important;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 8px 12px !important;
      border-bottom: none !important;
      &::before { background-color: #333 !important; }
    }

    .ant-table-tbody > tr > td {
      padding: 7px 12px !important;
      font-size: 0.78rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f5f5f5 !important;
    }
  `,

  row: css`
    cursor: pointer;
  `,

  rowSelected: css`
    cursor: pointer;
    td {
      background: rgba(0, 184, 110, 0.08) !important;
      border-left: 3px solid #00b86e;
    }
    td:first-child {
      border-left: 3px solid #00b86e;
    }
  `,

  proposalNumber: css`
    font-family: monospace;
    font-size: 0.72rem;
    font-weight: 700;
    color: #333;
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  proposalIcon: css`
    color: #888;
    font-size: 0.72rem;
  `,

  titleCell: css`
    font-weight: 600;
    color: #111;
  `,

  clientCell: css`
    font-weight: 500;
    color: #333;
  `,

  mutedCell: css`
    color: #888;
    font-size: 0.75rem;
  `,

  amountCell: css`
    font-weight: 700;
    color: #00b86e;
  `,

  dateCell: css`
    color: #666;
    font-size: 0.73rem;
  `,

  badgeCell: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 10px;
    padding: 1px 8px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #333;
  `,

  statusTag: css`
    font-size: 0.68rem;
    font-weight: 600;
    border-radius: 6px;
    padding: 0 6px;
    border: none;
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
    width: 200px;
    border-radius: 10px !important;
    background: #222 !important;
    border: 1px solid #444 !important;
    height: 34px;
    .ant-input { background: transparent !important; color: #fff !important; }
    .ant-input::placeholder { color: #888 !important; }
    .ant-input-clear-icon { color: #888 !important; }
  `,

  searchIcon: css`
    color: #666;
  `,
}));

export default useStyles;