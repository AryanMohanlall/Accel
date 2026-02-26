"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_CONTACT_STATE,
  ContactStateContext,
  ContactActionContext,
  Contact,
} from "./context";
import { ContactReducer } from "./reducers";
import {
  fetchPending,
  fetchSuccess,
  fetchError,
  mutatePending,
  mutateSuccess,
  mutateError,
  setSelectedAction,
} from "./actions";

export const ContactProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ContactReducer, INITIAL_CONTACT_STATE);
  const instance = getAxiosInstance();

  // Optional clientId param allows fetching contacts for a specific client
  const fetchContacts = async (clientId?: string) => {
    dispatch(fetchPending());
    try {
      const url = clientId
        ? `/api/Contacts?clientId=${clientId}`
        : `/api/Contacts`;
      const res = await instance.get(url);
      dispatch(
        fetchSuccess({
          items: res.data.items,
          totalCount: res.data.totalCount,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (contact: Contact | null) => {
    dispatch(setSelectedAction(contact));
  };

  const createContact = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post("/api/Contacts", payload);
      dispatch(mutateSuccess());
      await fetchContacts(payload.clientId);
    } catch (error) {
      console.error("Failed to create contact:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateContact = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Contacts/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchContacts();
    } catch (error) {
      console.error("Failed to update contact:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Contacts/${id}`);
      dispatch(mutateSuccess());
      await fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchContacts,
    setSelected,
    createContact,
    updateContact,
    deleteContact,
  };

  return (
    <ContactStateContext.Provider value={state}>
      <ContactActionContext.Provider value={actions}>
        {children}
      </ContactActionContext.Provider>
    </ContactStateContext.Provider>
  );
};

export const useContactState = () => {
  const context = useContext(ContactStateContext);
  if (context === undefined)
    throw new Error("useContactState must be used within a ContactProvider");
  return context;
};

export const useContactActions = () => {
  const context = useContext(ContactActionContext);
  if (context === undefined)
    throw new Error("useContactActions must be used within a ContactProvider");
  return context;
};
