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
  fetchPending, fetchSuccess, fetchError,
  mutatePending, mutateSuccess, mutateError,
  setSelectedAction,
} from "./actions";

export const ContractProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [state, dispatch] = useReducer(ContractReducer, INITIAL_CONTRACT_STATE);
  const instance = getAxiosInstance();

  const fetchContracts = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get('/api/Contracts');
      dispatch(fetchSuccess(res.data));
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
      await instance.post('/api/Contracts', payload);
      dispatch(mutateSuccess());
      await fetchContracts();
    } catch (error) {
      console.error("Failed to create contract:", error);
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
    deleteContract,
  };

  return React.createElement(
    ContractStateContext.Provider,
    { value: state },
    React.createElement(
      ContractActionContext.Provider,
      { value: actions },
      children
    )
  );
};

export const useContractState = () => {
  const context = useContext(ContractStateContext);
  if (context === undefined) throw new Error("useContractState must be used within a ContractProvider");
  return context;
};

export const useContractActions = () => {
  const context = useContext(ContractActionContext);
  if (context === undefined) throw new Error("useContractActions must be used within a ContractProvider");
  return context;
};