"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_CONTRACT_STATE,
  ContractStateContext,
  ContractActionContext,
  Contract,
} from "./context";
import { ContractReducer } from "./reducers";
import {
  fetchPending,
  fetchSuccess,
  fetchError,
  mutatePending,
  mutateSuccess,
  mutateError,
  setSelectedAction,
} from "./actions";

export const ContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [state, dispatch] = useReducer(ContractReducer, INITIAL_CONTRACT_STATE);
  const instance = getAxiosInstance();

  const fetchContracts = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get("/api/Contracts");
      const items = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
          ? res.data.items
          : [];
      dispatch(fetchSuccess(items));
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (contract: Contract | null) => {
    dispatch(setSelectedAction(contract));
  };

  const createContract = async (payload: any) => {
    dispatch(mutatePending());
    try {
      console.log("createContract payload:", JSON.stringify(payload, null, 2));
      await instance.post("/api/Contracts", payload);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error: any) {
      console.error("Failed to create contract:", error.response?.data);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateContract = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Contracts/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error) {
      console.error("Failed to update contract:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const activateContract = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Contracts/${id}/activate`);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error) {
      console.error("Failed to activate contract:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const cancelContract = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Contracts/${id}/cancel`);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error) {
      console.error("Failed to cancel contract:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteContract = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Contracts/${id}`);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error) {
      console.error("Failed to delete contract:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchContracts,
    setSelected,
    createContract,
    updateContract,
    activateContract,
    cancelContract,
    deleteContract,
  };

  return (
    <ContractStateContext.Provider value={state}>
      <ContractActionContext.Provider value={actions}>
        {children}
      </ContractActionContext.Provider>
    </ContractStateContext.Provider>
  );
};

export const useContractState = () => {
  const context = useContext(ContractStateContext);
  if (context === undefined)
    throw new Error("useContractState must be used within a ContractProvider");
  return context;
};

export const useContractActions = () => {
  const context = useContext(ContractActionContext);
  if (context === undefined)
    throw new Error(
      "useContractActions must be used within a ContractProvider",
    );
  return context;
};
