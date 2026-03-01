import { createContext, useContext } from "react";
import { StreamChat, Channel } from "stream-chat";

export interface OrgUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface ChatState {
  client: StreamChat | null;
  isConnected: boolean;
  isPending: boolean;
  isError: boolean;
  orgUsers: OrgUser[];
  usersLoading: boolean;
  activeChannel: Channel | null;
}

export interface ChatActions {
  connectUser: (userId: string, userName: string) => Promise<void>;
  disconnectUser: () => Promise<void>;
  fetchOrgUsers: (searchTerm?: string) => Promise<void>;
  openDirectMessage: (otherUser: OrgUser) => Promise<Channel | null>;
  openGroupChannel: (name: string, members: OrgUser[]) => Promise<Channel | null>;
  setActiveChannel: (channel: Channel | null) => void;
}

export const ChatStateContext = createContext<ChatState>({
  client: null,
  isConnected: false,
  isPending: false,
  isError: false,
  orgUsers: [],
  usersLoading: false,
  activeChannel: null,
});

export const ChatActionsContext = createContext<ChatActions>({
  connectUser: async () => {},
  disconnectUser: async () => {},
  fetchOrgUsers: async () => {},
  openDirectMessage: async () => null,
  openGroupChannel: async () => null,
  setActiveChannel: () => {},
});

export const useChatState = () => useContext(ChatStateContext);
export const useChatActions = () => useContext(ChatActionsContext);