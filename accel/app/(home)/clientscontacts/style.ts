"use client";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({

  wrapper: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #79797934;
    border-radius: 24px;
    overflow: hidden;
  `,

  // ── Tabs ──
  tabs: css`
    height: 100%;
    display: flex;
    flex-direction: column;

    .ant-tabs-nav {
      margin: 0 !important;
      padding: 0 20px;
      background: #0a0a0a;
      border-bottom: 1px solid #1a1a1a;
    }
    .ant-tabs-tab {
      color: #555 !important;
      font-size: 0.82rem !important;
      font-weight: 600 !important;
      padding: 12px 0 !important;
    }
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #00b86e !important;
    }
    .ant-tabs-ink-bar {
      background: #00b86e !important;
    }
    .ant-tabs-content-holder {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .ant-tabs-content {
      height: 100%;
    }
    .ant-tabs-tabpane {
      height: 100%;
    }
  `,

  tabLabel: css`
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  tabBadge: css`
    .ant-badge-count {
      background: #1a1a1a !important;
      color: #555 !important;
      box-shadow: none !important;
      font-size: 10px !important;
    }
  `,

  tabContent: css`
    height: 100%;
    display: flex;
    flex-direction: column;
  `,

  // ── List wrappers ──
  listWrapper: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  `,

  centered: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  `,

  // ── Client grid ──
  clientGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
  `,

  clientCard: css`
    background: #111;
    border: 1px solid #222;
    border-radius: 14px;
    padding: 14px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 10px;
    &:hover {
      border-color: #333;
      background: #161616;
      transform: translateY(-1px);
    }
  `,

  clientCardSelected: css`
    border-color: #00b86e !important;
    background: #0a1f15 !important;
    box-shadow: 0 0 0 1px rgba(0,184,110,0.2);
  `,

  clientCardHeader: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  clientAvatar: css`
    background: #00b86e !important;
    color: #000 !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    flex-shrink: 0;
  `,

  clientCardMeta: css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  `,

  clientName: css`
    font-size: 0.92rem !important;
    font-weight: 700 !important;
    color: #f0f0f0 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `,

  clientIndustry: css`
    font-size: 0.72rem !important;
    color: #555 !important;
    display: block;
  `,

  clientTypeTag: css`
    font-size: 0.62rem !important;
    font-weight: 600 !important;
    border-radius: 5px !important;
    flex-shrink: 0;
  `,

  clientCardStats: css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,

  statChip: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.72rem;
    color: #888;
    .anticon { font-size: 0.68rem; color: #555; }
  `,

  websiteText: css`
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  clientCardFooter: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 6px;
    border-top: 1px solid #1e1e1e;
  `,

  clientFooterText: css`
    font-size: 0.7rem !important;
    color: #555 !important;
  `,

  // ── Contact list ──
  contactList: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  contactRow: css`
    display: flex;
    align-items: center;
    gap: 12px;
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: #333;
      background: #161616;
    }
  `,

  contactRowSelected: css`
    border-color: #00b86e !important;
    background: #0a1f15 !important;
  `,

  contactAvatar: css`
    background: #1a1a1a !important;
    border: 1px solid #333 !important;
    color: #00b86e !important;
    font-weight: 700 !important;
    font-size: 0.78rem !important;
    flex-shrink: 0;
  `,

  contactInfo: css`
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 1px;
  `,

  contactNameRow: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,

  contactFullName: css`
    font-size: 0.87rem !important;
    font-weight: 600 !important;
    color: #e0e0e0 !important;
  `,

  primaryStar: css`
    font-size: 0.65rem;
    color: #faad14;
  `,

  contactPosition: css`
    font-size: 0.7rem !important;
    color: #555 !important;
  `,

  contactDetails: css`
    flex: 1;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  `,

  contactLink: css`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    color: #666 !important;
    text-decoration: none !important;
    transition: color 0.2s;
    .anticon { font-size: 0.68rem; }
    span { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &:hover { color: #00b86e !important; }
  `,

  clientTag: css`
    font-size: 0.62rem !important;
    border-radius: 6px !important;
    background: #1a1a1a !important;
    border-color: #2a2a2a !important;
    color: #666 !important;
    flex-shrink: 0;
    margin-left: auto;
  `,

  // ── Action Bar ──
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
    color: #667;
  `,
}));

export default useStyles;
