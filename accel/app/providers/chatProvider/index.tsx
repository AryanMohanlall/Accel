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

  // Keep clientRef in sync with state.client
  useEffect(() => {
    clientRef.current = state.client;
  }, [state.client]);

  // Stable getClient callback that reads the ref only when called (outside render)
  const getClient = useCallback(() => clientRef.current, []);

  // Actions are stable — created once, getClient is called lazily inside action fns
  const actionsRef = useRef(createChatActions(dispatch, getClient));

  // Auto-connect when user is available
  useEffect(() => {
    if (user?.userId && !state.isConnected && !state.isPending) {
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      actionsRef.current.connectUser(user.userId, fullName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <ChatActionsContext.Provider value={actionsRef.current}>
        {children}
      </ChatActionsContext.Provider>
    </ChatStateContext.Provider>
  );
};