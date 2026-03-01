"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_PRICING_REQUEST_STATE,
  PricingRequestStateContext,
  PricingRequestActionContext,
  PricingRequest,
} from "./context";
import { PricingRequestReducer } from "./reducers";
import {
  fetchPending,
  fetchSuccess,
  fetchError,
  mutatePending,
  mutateSuccess,
  mutateError,
  setSelectedAction,
} from "./actions";

export const PricingRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [state, dispatch] = useReducer(
    PricingRequestReducer,
    INITIAL_PRICING_REQUEST_STATE,
  );
  const instance = getAxiosInstance();

  const fetchPricingRequests = async (params?: Record<string, any>) => {
    dispatch(fetchPending());
    try {
      const query = new URLSearchParams({
        pageSize: "50",
        ...params,
      }).toString();
      const res = await instance.get(`/api/pricingrequests?${query}`);
      const items = res.data.items ?? [];
      dispatch(
        fetchSuccess({
          items,
          totalCount: res.data.totalCount ?? items.length,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch pricing requests:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const fetchMyRequests = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get("/api/pricingrequests/my-requests");
      const items = res.data.items ?? [];
      dispatch(
        fetchSuccess({
          items,
          totalCount: res.data.totalCount ?? items.length,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch my pricing requests:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const fetchPendingRequests = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get("/api/pricingrequests/pending");
      const items = res.data.items ?? [];
      dispatch(
        fetchSuccess({
          items,
          totalCount: res.data.totalCount ?? items.length,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch pending pricing requests:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (request: PricingRequest | null) => {
    dispatch(setSelectedAction(request));
  };

  const createPricingRequest = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post("/api/pricingrequests", payload);
      dispatch(mutateSuccess());
      await fetchPricingRequests();
    } catch (error) {
      console.error("Failed to create pricing request:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updatePricingRequest = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/pricingrequests/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchPricingRequests();
    } catch (error) {
      console.error("Failed to update pricing request:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const assignPricingRequest = async (id: string, userId: string) => {
    dispatch(mutatePending());
    try {
      await instance.post(`/api/pricingrequests/${id}/assign`, { userId });
      dispatch(mutateSuccess());
      await fetchPricingRequests();
    } catch (error) {
      console.error("Failed to assign pricing request:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const completePricingRequest = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/pricingrequests/${id}/complete`);
      dispatch(mutateSuccess());
      await fetchPricingRequests();
    } catch (error) {
      console.error("Failed to complete pricing request:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchPricingRequests,
    fetchMyRequests,
    fetchPendingRequests,
    setSelected,
    createPricingRequest,
    updatePricingRequest,
    assignPricingRequest,
    completePricingRequest,
  };

  return (
    <PricingRequestStateContext.Provider value={state}>
      <PricingRequestActionContext.Provider value={actions}>
        {children}
      </PricingRequestActionContext.Provider>
    </PricingRequestStateContext.Provider>
  );
};

export const usePricingRequestState = () => {
  const context = useContext(PricingRequestStateContext);
  if (context === undefined)
    throw new Error(
      "usePricingRequestState must be used within a PricingRequestProvider",
    );
  return context;
};

export const usePricingRequestActions = () => {
  const context = useContext(PricingRequestActionContext);
  if (context === undefined)
    throw new Error(
      "usePricingRequestActions must be used within a PricingRequestProvider",
    );
  return context;
};
