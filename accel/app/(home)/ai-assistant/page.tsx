"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, Tag, Typography } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";
import {
  useOpportunityActions,
  useOpportunityState,
} from "../../providers/opportunitiesProvider";
import {
  useProposalActions,
  useProposalState,
} from "../../providers/proposalsProvider";
import {
  useContractActions,
  useContractState,
} from "../../providers/contractsProvider";
import {
  useActivityActions,
  useActivityState,
} from "../../providers/activitiesProvider";
import {
  useClientActions,
  useClientState,
} from "../../providers/clientsProvider";
import {
  useContactActions,
  useContactState,
} from "../../providers/contactsProvider";
import { useUserState } from "../../providers/userProvider";
import withAuth from "../../hoc/withAuth";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import ReactMarkdown from "react-markdown";
import {
  usePricingRequestState,
  usePricingRequestActions,
} from "../../providers/pricingProvider";
import useStyles from "./style";

const { Text } = Typography;

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
        title: { type: "string", description: "Opportunity title" },
        clientId: { type: "string", description: "Client UUID" },
        description: { type: "string" },
        value: { type: "number", description: "Monetary value" },
        currency: { type: "string", description: "e.g. ZAR, USD" },
        stage: {
          type: "number",
          description:
            "1=Lead,2=Qualified,3=Proposal,4=Negotiation,5=Won,6=Lost",
        },
        expectedCloseDate: { type: "string", description: "YYYY-MM-DD" },
        probability: { type: "number", description: "0-100" },
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
        title: { type: "string" },
        description: { type: "string" },
        currency: { type: "string" },
        validUntil: { type: "string", description: "YYYY-MM-DD" },
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
        type: {
          type: "number",
          description: "1=Call,2=Email,3=Meeting,4=Note,5=Task",
        },
        subject: { type: "string" },
        description: { type: "string" },
        priority: { type: "number", description: "1=Low,2=Medium,3=High" },
        dueDate: { type: "string", description: "ISO datetime string" },
        duration: { type: "number", description: "Duration in minutes" },
        location: { type: "string" },
        relatedToType: {
          type: "number",
          description: "1=Client,2=Opportunity,3=Proposal,4=Contract",
        },
        relatedToId: { type: "string" },
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
        id: { type: "string" },
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
  {
    name: "list_pricing_requests",
    description: "List all pricing requests",
    input_schema: { type: "object" },
  },
  {
    name: "list_my_pricing_requests",
    description: "List pricing requests assigned to the current user",
    input_schema: { type: "object" },
  },
  {
    name: "list_pending_pricing_requests",
    description:
      "List unassigned/pending pricing requests. Admin or SalesManager only.",
    input_schema: { type: "object" },
  },
  {
    name: "create_pricing_request",
    description: "Create a new pricing request",
    input_schema: {
      type: "object",
      properties: {
        opportunityId: { type: "string", description: "Opportunity UUID" },
        title: { type: "string", description: "Title of the pricing request" },
        description: {
          type: "string",
          description: "Details about the pricing request",
        },
        priority: {
          type: "number",
          description: "1=Low, 2=Medium, 3=High, 4=Urgent",
        },
        requiredByDate: { type: "string", description: "YYYY-MM-DD" },
        assignedToId: {
          type: "string",
          description: "Optional user UUID to assign immediately",
        },
      },
      required: ["opportunityId", "title", "requiredByDate"],
    },
  },
  {
    name: "assign_pricing_request",
    description:
      "Assign a pricing request to a user. Admin or SalesManager only.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Pricing request UUID" },
        userId: { type: "string", description: "User UUID to assign to" },
      },
      required: ["id", "userId"],
    },
  },
  {
    name: "complete_pricing_request",
    description: "Mark a pricing request as completed",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Pricing request UUID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_users",
    description:
      "List users in the organisation, optionally filtered by role or search term",
    input_schema: {
      type: "object",
      properties: {
        role: {
          type: "string",
          description:
            "Filter by role: Admin, SalesManager, BusinessDevelopmentManager, SalesRep",
        },
        searchTerm: { type: "string", description: "Search by name or email" },
      },
    },
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

  const { opportunities } = useOpportunityState();
  const { fetchOpportunities, createOpportunity, deleteOpportunity } =
    useOpportunityActions();
  const { proposals } = useProposalState();
  const { fetchProposals, createProposal } = useProposalActions();
  const { contracts } = useContractState();
  const { fetchContracts, activateContract, cancelContract } =
    useContractActions();
  const { activities } = useActivityState();
  const { fetchActivities, createActivity, completeActivity } =
    useActivityActions();
  const { clients } = useClientState();
  const { fetchClients } = useClientActions();
  const { contacts } = useContactState();
  const { fetchContacts } = useContactActions();
  const { pricingRequests } = usePricingRequestState();
  const {
    fetchPricingRequests,
    fetchMyRequests: fetchMyPricingRequests,
    fetchPendingRequests,
    createPricingRequest,
    assignPricingRequest,
    completePricingRequest,
  } = usePricingRequestActions();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOpportunities();
    fetchProposals();
    fetchContracts();
    fetchActivities();
    fetchClients();
    fetchContacts();
    fetchPricingRequests();
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

  const executeTool = async (
    toolName: string,
    toolInput: any,
  ): Promise<{ result: string; action?: string }> => {
    const ax = getAxiosInstance();
    switch (toolName) {
      // ── List tools: fetch directly so AI always gets fresh IDs ──────────────
      case "list_opportunities": {
        const res = await ax.get("/api/Opportunities?pageSize=50");
        fetchOpportunities(); // refresh UI in background
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_proposals": {
        const res = await ax.get("/api/Proposals?pageSize=50");
        fetchProposals();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_contracts": {
        const res = await ax.get("/api/Contracts?pageSize=50");
        fetchContracts();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_activities": {
        const res = await ax.get("/api/Activities?pageSize=50");
        fetchActivities();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_clients": {
        const res = await ax.get("/api/Clients?pageSize=50");
        fetchClients();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_contacts": {
        const res = await ax.get("/api/Contacts?pageSize=50");
        fetchContacts();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_pricing_requests": {
        const res = await ax.get("/api/pricingrequests?pageSize=50");
        fetchPricingRequests();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_my_pricing_requests": {
        const res = await ax.get(
          "/api/pricingrequests/my-requests?pageSize=50",
        );
        fetchMyPricingRequests();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_pending_pricing_requests": {
        const res = await ax.get("/api/pricingrequests/pending?pageSize=50");
        fetchPendingRequests();
        return { result: JSON.stringify(res.data.items ?? res.data) };
      }
      case "list_users": {
        const params = new URLSearchParams({ pageSize: "50" });
        if (toolInput.role) params.append("role", toolInput.role);
        if (toolInput.searchTerm)
          params.append("searchTerm", toolInput.searchTerm);
        const res = await ax.get(`/api/users?${params.toString()}`);
        return { result: JSON.stringify(res.data.items ?? []) };
      }

      // ── Mutation tools ───────────────────────────────────────────────────────
      case "create_opportunity":
        await createOpportunity(toolInput);
        return {
          result: `Opportunity "${toolInput.title}" created successfully.`,
          action: `Created opportunity: ${toolInput.title}`,
        };
      case "delete_opportunity":
        await deleteOpportunity(toolInput.id);
        return {
          result: `Opportunity ${toolInput.id} deleted.`,
          action: `Deleted opportunity`,
        };
      case "create_proposal":
        await createProposal(toolInput);
        return {
          result: `Proposal "${toolInput.title}" created.`,
          action: `Created proposal: ${toolInput.title}`,
        };
      case "activate_contract":
        await activateContract(toolInput.id);
        return {
          result: `Contract ${toolInput.id} activated.`,
          action: `Activated contract`,
        };
      case "cancel_contract":
        await cancelContract(toolInput.id);
        return {
          result: `Contract ${toolInput.id} cancelled.`,
          action: `Cancelled contract`,
        };
      case "create_activity":
        await createActivity({ ...toolInput, assignedToId: user?.userId });
        return {
          result: `Activity "${toolInput.subject}" created.`,
          action: `Created activity: ${toolInput.subject}`,
        };
      case "complete_activity":
        await completeActivity(toolInput.id, toolInput.outcome);
        return {
          result: `Activity ${toolInput.id} marked complete.`,
          action: `Completed activity`,
        };
      case "create_pricing_request":
        await createPricingRequest(toolInput);
        return {
          result: `Pricing request "${toolInput.title}" created successfully.`,
          action: `Created pricing request: ${toolInput.title}`,
        };
      case "assign_pricing_request":
        await assignPricingRequest(toolInput.id, toolInput.userId);
        return {
          result: `Pricing request ${toolInput.id} assigned to user ${toolInput.userId}.`,
          action: `Assigned pricing request`,
        };
      case "complete_pricing_request":
        await completePricingRequest(toolInput.id);
        return {
          result: `Pricing request ${toolInput.id} marked as completed.`,
          action: `Completed pricing request`,
        };

      default:
        return { result: `Unknown tool: ${toolName}` };
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let currentMessages: ApiMessage[] = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    try {
      let lastActionPerformed: string | undefined;
      let continueLoop = true;

      while (continueLoop) {
        const response = await fetch("/api/gemini/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: systemPrompt,
            tools: TOOLS,
            messages: currentMessages,
          }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        if (data.stop_reason === "end_turn") {
          const textContent = data.content?.find((b: any) => b.type === "text");
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: textContent?.text ?? "Done.",
              actionPerformed: lastActionPerformed,
            },
          ]);
          continueLoop = false;
        } else if (data.stop_reason === "tool_use") {
          const toolUseBlocks = data.content.filter(
            (b: any) => b.type === "tool_use",
          );
          const toolResults: any[] = [];

          for (const block of toolUseBlocks) {
            const { result, action } = await executeTool(
              block.name,
              block.input,
            );
            if (action) lastActionPerformed = action;
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              name: block.name,
              content: result,
            });
          }

          currentMessages = [
            ...currentMessages,
            { role: "assistant", content: data.content },
            { role: "user", content: toolResults },
          ];
        } else {
          continueLoop = false;
        }
      }
    } catch (err: any) {
      console.error("AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Error: ${err.message ?? "Something went wrong. Please try again."}`,
        },
      ]);
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
        <div className={styles.headerIcon}>
          <RobotOutlined />
        </div>
        <div className={styles.headerText}>
          <Text className={styles.headerTitle}>ACCEL AI</Text>
          <Text className={styles.headerSub}>Powered by Gemini 1.5 Flash</Text>
        </div>
        <div className={styles.capabilities}>
          {[
            "Opportunities",
            "Proposals",
            "Contracts",
            "Activities",
            "Clients",
          ].map((cap) => (
            <Tag key={cap} className={styles.capTag}>
              {cap}
            </Tag>
          ))}
        </div>
        <div className={styles.statusDot} />
      </div>

      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <ThunderboltOutlined className={styles.emptyIcon} />
            <Text className={styles.emptyTitle}>
              Ask me anything about your CRM.
              <br />I can read, create, and manage your data.
            </Text>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <div
                  key={s}
                  className={styles.suggestionChip}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${msg.role === "user" ? styles.bubbleUser : ""}`}
            >
              <div
                className={`${styles.avatarIcon} ${msg.role === "assistant" ? styles.avatarAi : styles.avatarUser}`}
              >
                {msg.role === "assistant" ? (
                  <RobotOutlined />
                ) : (
                  <UserOutlined />
                )}
              </div>
              <div>
                {msg.actionPerformed && (
                  <div className={styles.actionBadge}>
                    <ThunderboltOutlined style={{ fontSize: "0.6rem" }} />
                    {msg.actionPerformed}
                  </div>
                )}
                <div
                  className={`${styles.bubble} ${msg.role === "assistant" ? styles.bubbleAi : styles.bubbleUserMsg}`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p style={{ margin: "0 0 6px 0" }}>{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul style={{ margin: "4px 0", paddingLeft: "18px" }}>
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol style={{ margin: "4px 0", paddingLeft: "18px" }}>
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: "2px" }}>{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ color: "#00b86e" }}>
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code
                            style={{
                              background: "#0a0a0a",
                              border: "1px solid #222",
                              borderRadius: "4px",
                              padding: "1px 5px",
                              fontSize: "0.75rem",
                              fontFamily: "monospace",
                              color: "#00b86e",
                            }}
                          >
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre
                            style={{
                              background: "#0a0a0a",
                              border: "1px solid #1e1e1e",
                              borderRadius: "8px",
                              padding: "10px 12px",
                              overflowX: "auto",
                              fontSize: "0.75rem",
                              margin: "6px 0",
                            }}
                          >
                            {children}
                          </pre>
                        ),
                        h1: ({ children }) => (
                          <h1
                            style={{
                              fontSize: "1rem",
                              color: "#f0f0f0",
                              margin: "6px 0 4px",
                            }}
                          >
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2
                            style={{
                              fontSize: "0.9rem",
                              color: "#e0e0e0",
                              margin: "6px 0 4px",
                            }}
                          >
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3
                            style={{
                              fontSize: "0.85rem",
                              color: "#d0d0d0",
                              margin: "4px 0",
                            }}
                          >
                            {children}
                          </h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote
                            style={{
                              borderLeft: "3px solid #00b86e",
                              paddingLeft: "10px",
                              margin: "4px 0",
                              color: "#888",
                              fontStyle: "italic",
                            }}
                          >
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            style={{
                              color: "#00b86e",
                              textDecoration: "underline",
                            }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        hr: () => (
                          <hr
                            style={{
                              border: "none",
                              borderTop: "1px solid #1e1e1e",
                              margin: "8px 0",
                            }}
                          />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className={styles.messageBubble}>
            <div className={`${styles.avatarIcon} ${styles.avatarAi}`}>
              <RobotOutlined />
            </div>
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
          onChange={(e) => setInput(e.target.value)}
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
