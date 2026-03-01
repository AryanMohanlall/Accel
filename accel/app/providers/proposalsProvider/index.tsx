"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_PROPOSAL_STATE,
  ProposalStateContext,
  ProposalActionContext,
  Proposal,
} from "./context";
import { ProposalReducer } from "./reducers";
import {
  fetchPending,
  fetchSuccess,
  fetchError,
  mutatePending,
  mutateSuccess,
  mutateError,
  setSelectedAction,
} from "./actions";

export const ProposalProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [state, dispatch] = useReducer(ProposalReducer, INITIAL_PROPOSAL_STATE);
  const instance = getAxiosInstance();

  const fetchProposals = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get("/api/Proposals");
      const items = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
          ? res.data.items
          : [res.data];
      dispatch(fetchSuccess(items));
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (proposal: Proposal | null) => {
    dispatch(setSelectedAction(proposal));
  };

  const createProposal = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post("/api/Proposals", payload);
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to create proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateProposal = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Proposals/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to update proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteProposal = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Proposals/${id}`);
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to delete proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const submitProposal = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Proposals/${id}/submit`);
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const approveProposal = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Proposals/${id}/approve`);
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to approve proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const rejectProposal = async (id: string, reason: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Proposals/${id}/reject`, { reason });
      dispatch(mutateSuccess());
      await fetchProposals();
    } catch (error) {
      console.error("Failed to reject proposal:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchProposals,
    setSelected,
    createProposal,
    updateProposal,
    deleteProposal,
    submitProposal,
    approveProposal,
    rejectProposal,
  };

  return React.createElement(
    ProposalStateContext.Provider,
    { value: state },
    React.createElement(
      ProposalActionContext.Provider,
      { value: actions },
      children,
    ),
  );
};

export const useProposalState = () => {
  const context = useContext(ProposalStateContext);
  if (context === undefined)
    throw new Error("useProposalState must be used within a ProposalProvider");
  return context;
};

export const useProposalActions = () => {
  const context = useContext(ProposalActionContext);
  if (context === undefined)
    throw new Error(
      "useProposalActions must be used within a ProposalProvider",
    );
  return context;
};
