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
    max-height: 100%;
  `,

  timelineWrapper: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 24px 32px;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  `,

  centered: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,

  emptyText: css`
    color: #667;
  `,

  /* --- Timeline --- */
  timeline: css`
    display: flex;
    flex-direction: column;
    padding-left: 16px;
  `,

  timelineItem: css`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    position: relative;
    padding-bottom: 36px;
    cursor: pointer;
  `,

  timelineLine: css`
    position: absolute;
    left: 19px;
    top: 40px;
    bottom: 0;
    width: 1px;
    background: #939393;
    z-index: 0;
  `,

  timelineDot: css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
    transition: all 0.2s ease;
    color: #888;
    font-size: 0.9rem;
  `,

  timelineDotSelected: css`
    background: #00b86e !important;
    border-color: #00b86e !important;
    color: #fff !important;
    box-shadow: 0 0 12px rgba(0, 184, 110, 0.5);
  `,

  timelineDotOverdue: css`
    border-color: #ff4d4f !important;
    color: #ff4d4f !important;
  `,

  dotIcon: css`
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  /* --- Item Content --- */
  itemContent: css`
    flex: 1;
    background: #111;
    border-radius: 14px;
    padding: 12px 16px;
    border: 1px solid #222;
    transition: all 0.2s ease;
    &:hover {
      border-color: #333;
      background: #161616;
    }
  `,

  itemContentSelected: css`
    border-color: #00b86e !important;
    background: #0a1f15 !important;
  `,

  itemHeader: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 6px;
  `,

  itemTitleRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  `,

  itemTitle: css`
    margin: 0 !important;
    color: #fff !important;
    font-size: 0.95rem !important;
    font-weight: 600 !important;
  `,

  itemTags: css`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  `,

  tag: css`
    font-size: 0.62rem;
    font-weight: 600;
    border-radius: 5px;
    padding: 0 5px;
    line-height: 1.8;
  `,

  itemMeta: css`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  `,

  metaText: css`
    font-size: 0.7rem;
    color: #adadad;
  `,

  itemDescription: css`
    font-size: 0.78rem;
    color: #d4d4d4;
    line-height: 1.5;
    display: block;
    margin-bottom: 8px;
  `,

  itemFooter: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid #6b6b6b;
  `,

  assignee: css`
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  assigneeAvatar: css`
    background: #333 !important;
    font-size: 0.6rem !important;
    width: 18px !important;
    height: 18px !important;
    line-height: 18px !important;
  `,

  assigneeText: css`
    font-size: 0.7rem;
    color: #bcbcbc;
  `,

  participants: css`
    font-size: 0.7rem;
    color: #555;
    margin-left: auto;
  `,

  completedText: css`
    font-size: 0.7rem;
    color: #00b86e;
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