"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_OPPORTUNITY_STATE,
  OpportunityStateContext,
  OpportunityActionContext,
  Opportunity,
} from "./context";
import { OpportunityReducer } from "./reducers";
import {
  fetchPending,
  fetchSuccess,
  fetchError,
  mutatePending,
  mutateSuccess,
  mutateError,
  setSelectedAction,
} from "./actions";

export const OpportunityProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [state, dispatch] = useReducer(
    OpportunityReducer,
    INITIAL_OPPORTUNITY_STATE,
  );
  const instance = getAxiosInstance();

  const fetchOpportunities = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get("/api/Opportunities");
      console.log("Opportunities response:", res.data); // check what comes back after delete
      dispatch(
        fetchSuccess({
          items: res.data.items,
          totalCount: res.data.totalCount,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (opportunity: Opportunity | null) => {
    dispatch(setSelectedAction(opportunity));
  };

  const createOpportunity = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post("/api/Opportunities", payload);
      dispatch(mutateSuccess());
      await fetchOpportunities();
    } catch (error) {
      console.error("Failed to create opportunity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateOpportunity = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Opportunities/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchOpportunities();
    } catch (error) {
      console.error("Failed to update opportunity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  // Separate method for stage moves — hits the /stage endpoint
  const moveOpportunityStage = async (
    id: string,
    stage: number,
    notes?: string,
    lossReason?: string,
  ) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Opportunities/${id}/stage`, {
        stage,
        notes: notes || "",
        lossReason: lossReason || "",
      });
      dispatch(mutateSuccess());
      await fetchOpportunities();
    } catch (error) {
      console.error("Failed to move opportunity stage:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteOpportunity = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Opportunities/${id}`);
      dispatch(mutateSuccess());
      await fetchOpportunities();
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchOpportunities,
    setSelected,
    createOpportunity,
    updateOpportunity,
    moveOpportunityStage,
    deleteOpportunity,
  };

  return (
    <OpportunityStateContext.Provider value={state}>
      <OpportunityActionContext.Provider value={actions}>
        {children}
      </OpportunityActionContext.Provider>
    </OpportunityStateContext.Provider>
  );
};

export const useOpportunityState = () => {
  const context = useContext(OpportunityStateContext);
  if (context === undefined)
    throw new Error(
      "useOpportunityState must be used within an OpportunityProvider",
    );
  return context;
};

export const useOpportunityActions = () => {
  const context = useContext(OpportunityActionContext);
  if (context === undefined)
    throw new Error(
      "useOpportunityActions must be used within an OpportunityProvider",
    );
  return context;
};
