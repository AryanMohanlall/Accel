"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_CLIENT_STATE,
  ClientStateContext,
  ClientActionContext,
  Client,
} from "./context";
import { ClientReducer } from "./reducers";
import {
  fetchPending, fetchSuccess, fetchError,
  mutatePending, mutateSuccess, mutateError,
  setSelectedAction,
} from "./actions";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ClientReducer, INITIAL_CLIENT_STATE);
  const instance = getAxiosInstance();

  const fetchClients = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get('/api/Clients');
      dispatch(fetchSuccess({ items: res.data.items, totalCount: res.data.totalCount }));
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (client: Client | null) => {
    dispatch(setSelectedAction(client));
  };

  const createClient = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post('/api/Clients', payload);
      dispatch(mutateSuccess());
      await fetchClients();
    } catch (error) {
      console.error("Failed to create client:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateClient = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Clients/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchClients();
    } catch (error) {
      console.error("Failed to update client:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Clients/${id}`);
      dispatch(mutateSuccess());
      await fetchClients();
    } catch (error) {
      console.error("Failed to delete client:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchClients,
    setSelected,
    createClient,
    updateClient,
    deleteClient,
  };

  return (
    <ClientStateContext.Provider value={state}>
      <ClientActionContext.Provider value={actions}>
        {children}
      </ClientActionContext.Provider>
    </ClientStateContext.Provider>
  );
};

export const useClientState = () => {
  const context = useContext(ClientStateContext);
  if (context === undefined) throw new Error("useClientState must be used within a ClientProvider");
  return context;
};

export const useClientActions = () => {
  const context = useContext(ClientActionContext);
  if (context === undefined) throw new Error("useClientActions must be used within a ClientProvider");
  return context;
};