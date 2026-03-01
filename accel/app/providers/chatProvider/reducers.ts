import { StreamChat, Channel } from "stream-chat";
import { OrgUser } from "./context";

export interface ChatStateData {
  client: StreamChat | null;
  isConnected: boolean;
  isPending: boolean;
  isError: boolean;
  orgUsers: OrgUser[];
  usersLoading: boolean;
  activeChannel: Channel | null;
}

export type ChatAction =
  | { type: "CONNECT_START" }
  | { type: "CONNECT_SUCCESS"; payload: StreamChat }
  | { type: "CONNECT_ERROR" }
  | { type: "DISCONNECT" }
  | { type: "USERS_LOADING" }
  | { type: "USERS_SUCCESS"; payload: OrgUser[] }
  | { type: "USERS_ERROR" }
  | { type: "SET_ACTIVE_CHANNEL"; payload: Channel | null };

export const initialState: ChatStateData = {
  client: null,
  isConnected: false,
  isPending: false,
  isError: false,
  orgUsers: [],
  usersLoading: false,
  activeChannel: null,
};

export function chatReducer(state: ChatStateData, action: ChatAction): ChatStateData {
  switch (action.type) {
    case "CONNECT_START":
      return { ...state, isPending: true, isError: false };
    case "CONNECT_SUCCESS":
      return { ...state, isPending: false, isConnected: true, client: action.payload };
    case "CONNECT_ERROR":
      return { ...state, isPending: false, isError: true };
    case "DISCONNECT":
      return { ...state, isConnected: false, client: null, activeChannel: null };
    case "USERS_LOADING":
      return { ...state, usersLoading: true };
    case "USERS_SUCCESS":
      return { ...state, usersLoading: false, orgUsers: action.payload };
    case "USERS_ERROR":
      return { ...state, usersLoading: false };
    case "SET_ACTIVE_CHANNEL":
      return { ...state, activeChannel: action.payload };
    default:
      return state;
  }
}