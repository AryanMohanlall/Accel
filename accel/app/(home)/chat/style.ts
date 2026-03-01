import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  page: css`
    display: grid;
    grid-template-columns: 280px 1fr;
    height: 100%;
    background: #0a0a0a;
    overflow: hidden;
    width: 100%;
  `,

  sidebar: css`
    background: #111111;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,

  sidebarHeader: css`
    padding: 20px 16px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  `,

  sidebarTitle: css`
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  searchInput: css`
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
    color: #fff !important;

    input {
      background: transparent !important;
      color: #fff !important;
      &::placeholder {
        color: rgba(255, 255, 255, 0.3) !important;
      }
    }

    .ant-input-prefix {
      color: rgba(255, 255, 255, 0.3);
    }
  `,

  sidebarSection: css`
    padding: 12px 16px 4px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
  `,

  userList: css`
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  `,

  userItem: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.active {
      background: rgba(0, 184, 110, 0.12);
      border: 1px solid rgba(0, 184, 110, 0.2);
    }
  `,

  userName: css`
    color: #e0e0e0;
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  userRole: css`
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  newGroupBtn: css`
    margin: 8px;
    background: rgba(0, 184, 110, 0.08) !important;
    border: 1px solid rgba(0, 184, 110, 0.25) !important;
    color: #00b86e !important;
    border-radius: 8px !important;
    font-size: 0.8rem !important;
    font-weight: 600 !important;

    &:hover {
      background: rgba(0, 184, 110, 0.15) !important;
    }
  `,

  chatArea: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #0d0d0d;

    /* ── Stream CSS variable overrides — kills all blue ── */
    .str-chat,
    .str-chat__theme-dark {
      --str-chat__primary-color: #00b86e !important;
      --str-chat__active-primary-color: #00d47f !important;
      --str-chat__surface-color: #111111 !important;
      --str-chat__secondary-surface-color: #1a1a1a !important;
      --str-chat__primary-surface-color: rgba(0, 184, 110, 0.1) !important;
      --str-chat__primary-surface-color-low-emphasis: rgba(0, 184, 110, 0.05) !important;
      --str-chat__background-color: #0d0d0d !important;
      --str-chat__message-highlight-color: rgba(0, 184, 110, 0.08) !important;
      --str-chat__border-radius-circle: 50% !important;

      height: 100%;
      background: transparent;
    }

    /* ── Layout ── */
    .str-chat__container,
    .str-chat__main-panel,
    .str-chat__list {
      background: #0d0d0d !important;
    }

    /* ── Header ── */
    .str-chat__channel-header {
      background: #111111 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
      color: #fff !important;
    }
    .str-chat__channel-header-title,
    .str-chat__channel-header-info {
      color: #fff !important;
    }
    .str-chat__channel-header-info {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    /* ── Messages ── */
    .str-chat__message-bubble,
    .str-chat__message-simple-text-inner,
    .str-chat__message-text-inner {
      background: #1a1a1a !important;
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      color: #e0e0e0 !important;
      border-radius: 12px !important;
    }

    /* Own messages */
    .str-chat__message--me .str-chat__message-bubble,
    .str-chat__message--me .str-chat__message-simple-text-inner,
    .str-chat__message--me .str-chat__message-text-inner {
      background: rgba(0, 184, 110, 0.15) !important;
      border-color: rgba(0, 184, 110, 0.25) !important;
      color: #fff !important;
    }

    /* ── Message input ── */
    .str-chat__message-input,
    .str-chat__message-input-inner {
      background: #111111 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
    }

    .str-chat__textarea textarea,
    .str-chat__message-textarea {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 10px !important;
      color: #fff !important;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3) !important;
      }
      &:focus {
        border-color: rgba(0, 184, 110, 0.5) !important;
        outline: none !important;
        box-shadow: none !important;
      }
    }

    /* ── Send button — replace blue with green ── */
    .str-chat__send-button,
    button.str-chat__send-button,
    .str-chat__message-input .str-chat__send-button {
      background: #00b86e !important;
      border-color: #00b86e !important;
      color: #fff !important;
      border-radius: 8px !important;

      svg path {
        fill: #fff !important;
      }

      &:hover {
        background: #00d47f !important;
        border-color: #00d47f !important;
      }
    }

    /* ── Attachment / emoji buttons ── */
    .str-chat__input-flat-emojiselect,
    .str-chat__fileupload-wrapper,
    .str-chat__attachment-selector-actions-button {
      color: rgba(255, 255, 255, 0.4) !important;

      svg path {
        fill: rgba(255, 255, 255, 0.4) !important;
      }

      &:hover svg path {
        fill: #00b86e !important;
      }
    }

    /* ── Unread badge / counts — replace blue ── */
    .str-chat__unread-messages-notification,
    .str-chat__unread-count,
    .str-chat__message-notification {
      background: #00b86e !important;
      color: #fff !important;
      border-color: #00b86e !important;
    }

    /* ── Scroll-to-bottom button ── */
    .str-chat__jump-to-latest-message {
      background: #1a1a1a !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: #00b86e !important;

      svg path {
        fill: #00b86e !important;
      }
    }

    /* ── Read receipts ── */
    .str-chat__avatar {
      background: rgba(0, 184, 110, 0.15) !important;
      color: #00b86e !important;
    }

    /* ── Date separator ── */
    .str-chat__date-separator-text,
    .str-chat__date-separator-line {
      color: rgba(255, 255, 255, 0.3) !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
    }

    /* ── Typing indicator ── */
    .str-chat__typing-indicator,
    .str-chat__typing-indicator__dots span {
      background: #00b86e !important;
      color: rgba(255, 255, 255, 0.4) !important;
    }

    /* ── Message actions popup ── */
    .str-chat__message-actions-box,
    .str-chat__message-simple__actions {
      background: #1a1a1a !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      color: #e0e0e0 !important;
    }

    /* ── Reaction selector ── */
    .str-chat__reaction-selector {
      background: #1a1a1a !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    /* ── Thread panel ── */
    .str-chat__thread {
      background: #111111 !important;
      border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
    }

    /* ── Any remaining blue links or highlights ── */
    a {
      color: #00b86e !important;
    }
    *:focus-visible {
      outline-color: #00b86e !important;
    }
  `,

  emptyState: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.25);
  `,

  emptyIcon: css`
    font-size: 3rem;
    color: rgba(0, 184, 110, 0.2);
  `,
}));

export default useStyles;