"use client";

import React, { useReducer, useRef, useEffect, useCallback } from "react";
import { StreamChat } from "stream-chat";
import { ChatStateContext, ChatActionsContext } from "./context";
import { chatReducer, initialState } from "./reducers";
import { createChatActions } from "./actions";
import { useUserState } from "../userProvider";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const clientRef = useRef<StreamChat | null>(null);
  const { user } = useUserState();

  const getClient = useCallback(() => clientRef.current, []);

  const actions = createChatActions(dispatch, getClient);

  // Sync client ref when state.client changes
  useEffect(() => {
    clientRef.current = state.client;
  }, [state.client]);

  // Auto-connect when user is available — uses userId and firstName + lastName
  useEffect(() => {
    if (user?.userId && !state.isConnected && !state.isPending) {
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      actions.connectUser(user.userId, fullName);
    }
  }, [user?.userId]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnectUser();
      }
    };
  }, []);

  return (
    <ChatStateContext.Provider value={state}>
      <ChatActionsContext.Provider value={actions}>
        {children}
      </ChatActionsContext.Provider>
    </ChatStateContext.Provider>
  );
};