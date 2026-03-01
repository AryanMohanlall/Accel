"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Avatar,
  Button,
  Modal,
  Checkbox,
  Spin,
  Typography,
  Badge,
  Empty,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { createStyles } from "antd-style";
import {
  useChatState,
  useChatActions,
  OrgUser,
} from "../../providers/chatProvider/context";
import { useUserState } from "../../providers/userProvider";

import "stream-chat-react/dist/css/v2/index.css";
import useStyles from "./style";

const { Text } = Typography;

// ─── Group Channel Modal ───────────────────────────────────────────────────
const GroupChannelModal = ({
  open,
  onClose,
  orgUsers,
  currentUserId,
  onCreateGroup,
}: {
  open: boolean;
  onClose: () => void;
  orgUsers: OrgUser[];
  currentUserId: string;
  onCreateGroup: (name: string, members: OrgUser[]) => void;
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const others = orgUsers.filter((u) => u.id !== currentUserId);

  const handleCreate = () => {
    if (!groupName.trim() || selectedIds.length === 0) return;
    const members = others.filter((u) => selectedIds.includes(u.id));
    onCreateGroup(groupName.trim(), members);
    setGroupName("");
    setSelectedIds([]);
    onClose();
  };

  return (
    <Modal
      title="New Group Channel"
      open={open}
      onCancel={onClose}
      onOk={handleCreate}
      okText="Create"
      okButtonProps={{
        disabled: !groupName.trim() || selectedIds.length === 0,
        style: { background: "#00b86e", borderColor: "#00b86e" },
      }}
      styles={{
        body: { background: "#1a1a1a", padding: "16px 0 0" },
        header: {
          background: "#1a1a1a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
        footer: { background: "#1a1a1a" },
        mask: { backdropFilter: "blur(4px)" },
      }}
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          placeholder="Channel name (e.g. Sales Team Q2)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
          }}
        />
        <div>
          <Text
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.75rem",
              display: "block",
              marginBottom: 8,
            }}
          >
            SELECT MEMBERS
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {others.map((u) => (
              <Checkbox
                key={u.id}
                checked={selectedIds.includes(u.id)}
                onChange={(e) =>
                  setSelectedIds((prev) =>
                    e.target.checked
                      ? [...prev, u.id]
                      : prev.filter((id) => id !== u.id),
                  )
                }
                style={{ color: "#e0e0e0" }}
              >
                <span style={{ marginLeft: 4 }}>
                  {u.fullName}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.75rem",
                      marginLeft: 6,
                    }}
                  >
                    {u.roles?.[0]}
                  </span>
                </span>
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ─── Main Chat Page ────────────────────────────────────────────────────────
const ChatPage = () => {
  const { styles } = useStyles();
  const {
    client,
    isConnected,
    isPending,
    orgUsers,
    usersLoading,
    activeChannel,
  } = useChatState();
  const { fetchOrgUsers, openDirectMessage, openGroupChannel } =
    useChatActions();
  const { user } = useUserState();

  const [search, setSearch] = useState("");
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrgUsers();
  }, []);

  const filteredUsers = orgUsers.filter(
    (u) =>
      u.id !== user?.userId &&
      (u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())),
  );

  const handleOpenDM = async (orgUser: OrgUser) => {
    setActiveUserId(orgUser.id);
    await openDirectMessage(orgUser);
  };

  const handleCreateGroup = async (name: string, members: OrgUser[]) => {
    setActiveUserId(null);
    await openGroupChannel(name, members);
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  if (isPending) {
    return (
      <div className={styles.emptyState} style={{ height: "100%" }}>
        <Spin size="large" />
        <Text style={{ color: "rgba(255,255,255,0.3)" }}>
          Connecting to chat...
        </Text>
      </div>
    );
  }

  if (!isConnected || !client) {
    return (
      <div className={styles.emptyState} style={{ height: "100%" }}>
        <MessageOutlined className={styles.emptyIcon} />
        <Text style={{ color: "rgba(255,255,255,0.3)" }}>
          Unable to connect to chat
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Left Sidebar ── */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>
            <MessageOutlined style={{ color: "#00b86e" }} />
            Team Chat
          </div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search colleagues..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          icon={<PlusOutlined />}
          className={styles.newGroupBtn}
          onClick={() => setGroupModalOpen(true)}
          block
        >
          New Group Channel
        </Button>

        <div className={styles.sidebarSection}>Direct Messages</div>

        <div className={styles.userList}>
          {usersLoading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 20 }}
            >
              <Spin size="small" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Empty
              description={
                <span
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.8rem",
                  }}
                >
                  No users found
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "20px 0" }}
            />
          ) : (
            filteredUsers.map((orgUser) => (
              <div
                key={orgUser.id}
                className={`${styles.userItem} ${activeUserId === orgUser.id ? "active" : ""}`}
                onClick={() => handleOpenDM(orgUser)}
              >
                <Badge dot color="#00b86e" offset={[-2, 32]}>
                  <Avatar
                    size={36}
                    style={{
                      background: "rgba(0,184,110,0.15)",
                      color: "#00b86e",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(orgUser.firstName, orgUser.lastName)}
                  </Avatar>
                </Badge>
                <div style={{ minWidth: 0 }}>
                  <div className={styles.userName}>{orgUser.fullName}</div>
                  <div className={styles.userRole}>{orgUser.roles?.[0]}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={styles.chatArea}>
        {activeChannel ? (
          <Chat client={client} theme="str-chat__theme-dark">
            <Channel channel={activeChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        ) : (
          <div className={styles.emptyState}>
            <MessageOutlined className={styles.emptyIcon} />
            <Text
              style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}
            >
              Select a colleague to start chatting
            </Text>
            <Text
              style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}
            >
              or create a group channel
            </Text>
          </div>
        )}
      </div>

      {/* ── Group Modal ── */}
      <GroupChannelModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        orgUsers={orgUsers}
        currentUserId={user?.userId ?? ""}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default ChatPage;
