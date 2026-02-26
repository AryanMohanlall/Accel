"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, Tag, Typography } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useOpportunityActions, useOpportunityState } from "../../providers/opportunitiesProvider";
import { useProposalActions, useProposalState } from "../../providers/proposalsProvider";
import { useContractActions, useContractState } from "../../providers/contractsProvider";
import { useActivityActions, useActivityState } from "../../providers/activitiesProvider";
import { useClientActions, useClientState } from "../../providers/clientsProvider";
import { useContactActions, useContactState } from "../../providers/contactsProvider";
import { useUserState } from "../../providers/userProvider";
import withAuth from "../../hoc/withAuth";

const { Text } = Typography;

const useStyles = createStyles(({ css }) => ({
  wrapper: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #080808;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    font-family: 'DM Mono', monospace;
  `,
  gridBg: css`
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,184,110,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,184,110,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  `,
  header: css`
    position: relative;
    z-index: 1;
    padding: 16px 24px;
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(10px);
    flex-shrink: 0;
  `,
  headerIcon: css`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4285f4, #0f3460);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1rem;
    flex-shrink: 0;
  `,
  headerText: css`
    display: flex;
    flex-direction: column;
    gap: 1px;
  `,
  headerTitle: css`
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    color: #f0f0f0 !important;
    font-family: 'DM Mono', monospace !important;
    letter-spacing: 0.02em;
  `,
  headerSub: css`
    font-size: 0.65rem !important;
    color: #444 !important;
    font-family: 'DM Mono', monospace !important;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  `,
  statusDot: css`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4285f4;
    margin-left: auto;
    box-shadow: 0 0 8px rgba(66,133,244,0.8);
    animation: pulse 2s infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `,
  capabilities: css`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-left: auto;
  `,
  capTag: css`
    font-size: 0.6rem !important;
    font-family: 'DM Mono', monospace !important;
    background: rgba(66,133,244,0.08) !important;
    border-color: rgba(66,133,244,0.2) !important;
    color: #4285f4 !important;
    border-radius: 4px !important;
    padding: 0 6px !important;
  `,
  messagesArea: css`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 1;
    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }
  `,
  emptyState: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    color: #222;
  `,
  emptyIcon: css`
    font-size: 3rem;
    color: #1a1a1a;
  `,
  emptyTitle: css`
    font-size: 1rem !important;
    color: #333 !important;
    font-family: 'DM Mono', monospace !important;
    text-align: center;
  `,
  suggestions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    max-width: 520px;
  `,
  suggestionChip: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.72rem;
    font-family: 'DM Mono', monospace;
    color: #444;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: rgba(66,133,244,0.3);
      color: #4285f4;
      background: rgba(66,133,244,0.05);
    }
  `,
  messageBubble: css`
    display: flex;
    gap: 10px;
    align-items: flex-start;
    animation: fadeUp 0.25s ease;
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
  bubbleUser: css`
    flex-direction: row-reverse;
  `,
  avatarIcon: css`
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  `,
  avatarAi: css`
    background: linear-gradient(135deg, #4285f422, #0f346022);
    border: 1px solid rgba(66,133,244,0.2);
    color: #4285f4;
  `,
  avatarUser: css`
    background: #111;
    border: 1px solid #222;
    color: #666;
  `,
  bubble: css`
    max-width: 72%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.82rem;
    line-height: 1.6;
    font-family: 'DM Mono', monospace;
  `,
  bubbleAi: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    color: #c8c8c8;
    border-top-left-radius: 2px;
  `,
  bubbleUserMsg: css`
    background: rgba(66,133,244,0.1);
    border: 1px solid rgba(66,133,244,0.2);
    color: #e0e0e0;
    border-top-right-radius: 2px;
  `,
  actionBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(66,133,244,0.12);
    border: 1px solid rgba(66,133,244,0.25);
    border-radius: 5px;
    padding: 1px 7px;
    font-size: 0.65rem;
    color: #4285f4;
    margin-bottom: 6px;
    font-family: 'DM Mono', monospace;
  `,
  thinkingBubble: css`
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    color: #333;
    padding: 10px 14px;
    border-radius: 12px;
    border-top-left-radius: 2px;
    font-size: 0.8rem;
    font-family: 'DM Mono', monospace;
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  inputBar: css`
    position: relative;
    z-index: 1;
    padding: 12px 16px;
    border-top: 1px solid #111;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    display: flex;
    gap: 10px;
    align-items: flex-end;
    flex-shrink: 0;
  `,
  textInput: css`
    flex: 1;
    background: #0d0d0d !important;
    border: 1px solid #1e1e1e !important;
    border-radius: 12px !important;
    color: #e0e0e0 !important;
    font-family: 'DM Mono', monospace !important;
    font-size: 0.82rem !important;
    resize: none !important;
    padding: 10px 14px !important;
    &::placeholder { color: #333 !important; }
    &:focus { border-color: rgba(66,133,244,0.3) !important; box-shadow: none !important; }
  `,
  sendBtn: css`
    background: #4285f4 !important;
    border: none !important;
    border-radius: 10px !important;
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0;
    color: #fff !important;
    font-size: 1rem !important;
    transition: all 0.2s !important;
    &:hover { background: #5a95f5 !important; transform: scale(1.05); }
    &:disabled { background: #111 !important; color: #333 !important; }
  `,
}));

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  actionPerformed?: string;
}

type ApiMessage = {
  role: "user" | "assistant";
  content: string | any[];
};

// Tool definitions — same schema format, route.ts converts to Gemini format
const TOOLS = [
  {
    name: "list_opportunities",
    description: "List all opportunities in the CRM",
    input_schema: { type: "object" },
  },
  {
    name: "create_opportunity",
    description: "Create a new opportunity",
    input_schema: {
      type: "object",
      properties: {
        title:             { type: "string", description: "Opportunity title" },
        clientId:          { type: "string", description: "Client UUID" },
        description:       { type: "string" },
        value:             { type: "number", description: "Monetary value" },
        currency:          { type: "string", description: "e.g. ZAR, USD" },
        stage:             { type: "number", description: "1=Lead,2=Qualified,3=Proposal,4=Negotiation,5=Won,6=Lost" },
        expectedCloseDate: { type: "string", description: "YYYY-MM-DD" },
        probability:       { type: "number", description: "0-100" },
      },
      required: ["title", "clientId"],
    },
  },
  {
    name: "delete_opportunity",
    description: "Delete an opportunity by ID",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "Opportunity UUID" } },
      required: ["id"],
    },
  },
  {
    name: "list_proposals",
    description: "List all proposals",
    input_schema: { type: "object" },
  },
  {
    name: "create_proposal",
    description: "Create a new proposal",
    input_schema: {
      type: "object",
      properties: {
        opportunityId: { type: "string" },
        title:         { type: "string" },
        description:   { type: "string" },
        currency:      { type: "string" },
        validUntil:    { type: "string", description: "YYYY-MM-DD" },
      },
      required: ["opportunityId", "title"],
    },
  },
  {
    name: "list_contracts",
    description: "List all contracts",
    input_schema: { type: "object" },
  },
  {
    name: "activate_contract",
    description: "Activate a contract by ID",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "cancel_contract",
    description: "Cancel a contract by ID",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "list_activities",
    description: "List all activities",
    input_schema: { type: "object" },
  },
  {
    name: "create_activity",
    description: "Create a new activity",
    input_schema: {
      type: "object",
      properties: {
        type:          { type: "number", description: "1=Call,2=Email,3=Meeting,4=Note,5=Task" },
        subject:       { type: "string" },
        description:   { type: "string" },
        priority:      { type: "number", description: "1=Low,2=Medium,3=High" },
        dueDate:       { type: "string", description: "ISO datetime string" },
        duration:      { type: "number", description: "Duration in minutes" },
        location:      { type: "string" },
        relatedToType: { type: "number", description: "1=Client,2=Opportunity,3=Proposal,4=Contract" },
        relatedToId:   { type: "string" },
      },
      required: ["type", "subject"],
    },
  },
  {
    name: "complete_activity",
    description: "Mark an activity as complete with an outcome note",
    input_schema: {
      type: "object",
      properties: {
        id:      { type: "string" },
        outcome: { type: "string" },
      },
      required: ["id", "outcome"],
    },
  },
  {
    name: "list_clients",
    description: "List all clients",
    input_schema: { type: "object" },
  },
  {
    name: "list_contacts",
    description: "List all contacts",
    input_schema: { type: "object" },
  },
];

const SUGGESTIONS = [
  "List all active opportunities",
  "Create a meeting activity for tomorrow",
  "Show me overdue activities",
  "Which contracts are expiring soon?",
  "List all clients",
  "Show proposals awaiting approval",
];

const AiAssistantPage = () => {
  const { styles } = useStyles();
  const { user } = useUserState();

  const { opportunities }                                            = useOpportunityState();
  const { fetchOpportunities, createOpportunity, deleteOpportunity } = useOpportunityActions();
  const { proposals }                                                = useProposalState();
  const { fetchProposals, createProposal }                           = useProposalActions();
  const { contracts }                                                = useContractState();
  const { fetchContracts, activateContract, cancelContract }         = useContractActions();
  const { activities }                                               = useActivityState();
  const { fetchActivities, createActivity, completeActivity }        = useActivityActions();
  const { clients }                                                  = useClientState();
  const { fetchClients }                                             = useClientActions();
  const { contacts }                                                 = useContactState();
  const { fetchContacts }                                            = useContactActions();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOpportunities();
    fetchProposals();
    fetchContracts();
    fetchActivities();
    fetchClients();
    fetchContacts();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const systemPrompt = `You are Accel AI — an intelligent CRM assistant embedded inside the Accel sales automation platform.
You have access to tools to read and manage the user's CRM data: opportunities, proposals, contracts, activities, clients, and contacts.

Current user: ${user?.firstName} ${user?.lastName} (${user?.roles?.join(", ")})
Today: ${new Date().toISOString().split("T")[0]}

Guidelines:
- Always use tools to fetch live data before answering questions about it
- For destructive actions (delete, cancel), confirm what you did clearly
- When creating records, confirm with the name/title of what was created
- Keep responses concise and professional
- Format lists clearly using line breaks
- If you need an ID to perform an action, first call the relevant list tool to find it`;

  const executeTool = async (toolName: string, toolInput: any): Promise<{ result: string; action?: string }> => {
    switch (toolName) {
      case "list_opportunities":
        await fetchOpportunities();
        return { result: JSON.stringify(opportunities.slice(0, 20)) };
      case "create_opportunity":
        await createOpportunity(toolInput);
        return { result: `Opportunity "${toolInput.title}" created successfully.`, action: `Created opportunity: ${toolInput.title}` };
      case "delete_opportunity":
        await deleteOpportunity(toolInput.id);
        return { result: `Opportunity ${toolInput.id} deleted.`, action: `Deleted opportunity` };
      case "list_proposals":
        await fetchProposals();
        return { result: JSON.stringify(proposals.slice(0, 20)) };
      case "create_proposal":
        await createProposal(toolInput);
        return { result: `Proposal "${toolInput.title}" created.`, action: `Created proposal: ${toolInput.title}` };
      case "list_contracts":
        await fetchContracts();
        return { result: JSON.stringify(contracts.slice(0, 20)) };
      case "activate_contract":
        await activateContract(toolInput.id);
        return { result: `Contract ${toolInput.id} activated.`, action: `Activated contract` };
      case "cancel_contract":
        await cancelContract(toolInput.id);
        return { result: `Contract ${toolInput.id} cancelled.`, action: `Cancelled contract` };
      case "list_activities":
        await fetchActivities();
        return { result: JSON.stringify(activities.slice(0, 20)) };
      case "create_activity":
        await createActivity({ ...toolInput, assignedToId: user?.userId });
        return { result: `Activity "${toolInput.subject}" created.`, action: `Created activity: ${toolInput.subject}` };
      case "complete_activity":
        await completeActivity(toolInput.id, toolInput.outcome);
        return { result: `Activity ${toolInput.id} marked complete.`, action: `Completed activity` };
      case "list_clients":
        await fetchClients();
        return { result: JSON.stringify(clients.slice(0, 20)) };
      case "list_contacts":
        await fetchContacts();
        return { result: JSON.stringify(contacts.slice(0, 20)) };
      default:
        return { result: `Unknown tool: ${toolName}` };
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let currentMessages: ApiMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    try {
      let lastActionPerformed: string | undefined;
      let continueLoop = true;

      while (continueLoop) {
        const response = await fetch("/api/gemini/messages", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            system:   systemPrompt,
            tools:    TOOLS,
            messages: currentMessages,
          }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        if (data.stop_reason === "end_turn") {
          const textContent = data.content?.find((b: any) => b.type === "text");
          setMessages(prev => [...prev, {
            id:              Date.now().toString(),
            role:            "assistant",
            content:         textContent?.text ?? "Done.",
            actionPerformed: lastActionPerformed,
          }]);
          continueLoop = false;

        } else if (data.stop_reason === "tool_use") {
          const toolUseBlocks = data.content.filter((b: any) => b.type === "tool_use");
          const toolResults: any[] = [];

          for (const block of toolUseBlocks) {
            const { result, action } = await executeTool(block.name, block.input);
            if (action) lastActionPerformed = action;
            toolResults.push({
              type:        "tool_result",
              tool_use_id: block.id,
              name:        block.name,
              content:     result,
            });
          }

          currentMessages = [
            ...currentMessages,
            { role: "assistant", content: data.content },
            { role: "user",      content: toolResults },
          ];

        } else {
          continueLoop = false;
        }
      }

    } catch (err: any) {
      console.error("AI error:", err);
      setMessages(prev => [...prev, {
        id:      Date.now().toString(),
        role:    "assistant",
        content: `Error: ${err.message ?? "Something went wrong. Please try again."}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridBg} />

      <div className={styles.header}>
        <div className={styles.headerIcon}><RobotOutlined /></div>
        <div className={styles.headerText}>
          <Text className={styles.headerTitle}>ACCEL AI</Text>
          <Text className={styles.headerSub}>Powered by Gemini 1.5 Flash</Text>
        </div>
        <div className={styles.capabilities}>
          {["Opportunities", "Proposals", "Contracts", "Activities", "Clients"].map(cap => (
            <Tag key={cap} className={styles.capTag}>{cap}</Tag>
          ))}
        </div>
        <div className={styles.statusDot} />
      </div>

      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <ThunderboltOutlined className={styles.emptyIcon} />
            <Text className={styles.emptyTitle}>
              Ask me anything about your CRM.<br />I can read, create, and manage your data.
            </Text>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <div key={s} className={styles.suggestionChip} onClick={() => sendMessage(s)}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${msg.role === "user" ? styles.bubbleUser : ""}`}
            >
              <div className={`${styles.avatarIcon} ${msg.role === "assistant" ? styles.avatarAi : styles.avatarUser}`}>
                {msg.role === "assistant" ? <RobotOutlined /> : <UserOutlined />}
              </div>
              <div>
                {msg.actionPerformed && (
                  <div className={styles.actionBadge}>
                    <ThunderboltOutlined style={{ fontSize: "0.6rem" }} />
                    {msg.actionPerformed}
                  </div>
                )}
                <div className={`${styles.bubble} ${msg.role === "assistant" ? styles.bubbleAi : styles.bubbleUserMsg}`}>
                  {msg.content.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className={styles.messageBubble}>
            <div className={`${styles.avatarIcon} ${styles.avatarAi}`}><RobotOutlined /></div>
            <div className={styles.thinkingBubble}>
              <Spin size="small" /> thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={styles.inputBar}>
        <Input.TextArea
          className={styles.textInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Accel AI... (Enter to send, Shift+Enter for new line)"
          autoSize={{ minRows: 1, maxRows: 5 }}
          disabled={loading}
        />
        <Button
          className={styles.sendBtn}
          icon={<SendOutlined />}
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
        />
      </div>
    </div>
  );
};

export default withAuth(AiAssistantPage);