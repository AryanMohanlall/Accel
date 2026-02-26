import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background: #0a0a0a;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    font-family: 'DM Mono', monospace;
    min-height: 0;
  `,

  gridBg: css`
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,184,110,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,184,110,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  `,

  header: css`
    position: relative;
    z-index: 1;
    padding: 10px 20px;
    border-bottom: 1px solid #161616;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    flex-shrink: 0;
    /* fixed height so it never pushes layout */
    height: 52px;
  `,

  headerIcon: css`
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #00b86e, #005010);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.85rem;
    flex-shrink: 0;
  `,

  headerText: css`
    display: flex;
    flex-direction: column;
    gap: 0;
  `,

  headerTitle: css`
    font-size: 0.82rem !important;
    font-weight: 700 !important;
    color: #f0f0f0 !important;
    font-family: 'DM Mono', monospace !important;
    letter-spacing: 0.05em;
    line-height: 1.2 !important;
  `,

  headerSub: css`
    font-size: 0.6rem !important;
    color: #afabab !important;
    font-family: 'DM Mono', monospace !important;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 1.2 !important;
  `,

  statusDot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00b86e;
    margin-left: auto;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(0,184,110,0.8);
    animation: pulse 2s infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `,

  capabilities: css`
    display: flex;
    gap: 5px;
    flex-wrap: nowrap;
    overflow: hidden;
    margin-left: auto;
    margin-right: 12px;
  `,

  capTag: css`
    font-size: 0.58rem !important;
    font-family: 'DM Mono', monospace !important;
    background: rgba(0,184,110,0.07) !important;
    border-color: rgba(0,184,110,0.18) !important;
    color: #00b86e !important;
    border-radius: 4px !important;
    padding: 0 5px !important;
    line-height: 1.8 !important;
    white-space: nowrap;
  `,

  messagesArea: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
  `,

  emptyState: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  `,

  emptyIcon: css`
    font-size: 2.5rem;
    color: #44db82;
  `,

  emptyTitle: css`
    font-size: 0.85rem !important;
    color: #a8a8a8 !important;
    font-family: 'DM Mono', monospace !important;
    text-align: center;
    line-height: 1.6 !important;
  `,

  suggestions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    justify-content: center;
    max-width: 480px;
  `,

  suggestionChip: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 0.7rem;
    font-family: 'DM Mono', monospace;
    color: #9f9f9f;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: rgba(0,184,110,0.3);
      color: #00b86e;
      background: rgba(0,184,110,0.05);
    }
  `,

  messageBubble: css`
    display: flex;
    gap: 8px;
    align-items: flex-start;
    animation: fadeUp 0.2s ease;
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,

  bubbleUser: css`
    flex-direction: row-reverse;
  `,

  avatarIcon: css`
    width: 26px;
    height: 26px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    flex-shrink: 0;
  `,

  avatarAi: css`
    background: rgba(0,184,110,0.08);
    border: 1px solid rgba(0,184,110,0.2);
    color: #00b86e;
  `,

  avatarUser: css`
    background: #111;
    border: 1px solid #222;
    color: #999494;
  `,

  bubble: css`
    max-width: 74%;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 0.8rem;
    line-height: 1.6;
    font-family: 'DM Mono', monospace;
  `,

  bubbleAi: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    color: #b0b0b0;
    border-top-left-radius: 2px;
  `,

  bubbleUserMsg: css`
    background: rgba(0,184,110,0.08);
    border: 1px solid rgba(0,184,110,0.18);
    color: #d0d0d0;
    border-top-right-radius: 2px;
  `,

  actionBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(0,184,110,0.1);
    border: 1px solid rgba(0,184,110,0.2);
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 0.6rem;
    color: #00b86e;
    margin-bottom: 4px;
    font-family: 'DM Mono', monospace;
  `,

  thinkingBubble: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    color: #858383;
    padding: 8px 12px;
    border-radius: 10px;
    border-top-left-radius: 2px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  inputBar: css`
    position: relative;
    z-index: 1;
    padding: 10px 14px;
    border-top: 1px solid #161616;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-shrink: 0;
  `,

  textInput: css`
    flex: 1;
    background: #0d0d0d !important;
    border: 1px solid #1e1e1e !important;
    border-radius: 10px !important;
    color: #d0d0d0 !important;
    font-family: 'DM Mono', monospace !important;
    font-size: 0.78rem !important;
    resize: none !important;
    padding: 8px 12px !important;
    &::placeholder { color: #7e7c7c !important; }
    &:focus {
      border-color: rgba(0,184,110,0.3) !important;
      box-shadow: none !important;
    }
  `,

  sendBtn: css`
    background: #00b86e !important;
    border: none !important;
    border-radius: 9px !important;
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0;
    color: #1c1c1c !important;
    font-size: 0.9rem !important;
    transition: all 0.2s !important;
    &:hover { background: #00d47e !important; transform: scale(1.05); }
    &:disabled { background: #111 !important; color: #2a2a2a !important; }
  `,
}));

export default useStyles;