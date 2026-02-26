import { createAction } from "redux-actions";
import { IContractStateContext, Contract } from "./context";

export enum ContractActionEnums {
  fetchPending = "CONTRACT_FETCH_PENDING",
  fetchSuccess = "CONTRACT_FETCH_SUCCESS",
  fetchError = "CONTRACT_FETCH_ERROR",
  mutatePending = "CONTRACT_MUTATE_PENDING",
  mutateSuccess = "CONTRACT_MUTATE_SUCCESS",
  mutateError = "CONTRACT_MUTATE_ERROR",
  setSelected = "CONTRACT_SET_SELECTED",
}

export const fetchPending = createAction(
  ContractActionEnums.fetchPending,
  (): Partial<IContractStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const fetchSuccess = createAction(
  ContractActionEnums.fetchSuccess,
  (contracts: Contract[]): Partial<IContractStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    contracts,
  }),
);

export const fetchError = createAction(
  ContractActionEnums.fetchError,
  (): Partial<IContractStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const mutatePending = createAction(
  ContractActionEnums.mutatePending,
  (): Partial<IContractStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const mutateSuccess = createAction(
  ContractActionEnums.mutateSuccess,
  (): Partial<IContractStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  }),
);

export const mutateError = createAction(
  ContractActionEnums.mutateError,
  (): Partial<IContractStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const setSelectedAction = createAction(
  ContractActionEnums.setSelected,
  (selected: Contract | null): Partial<IContractStateContext> => ({ selected }),
);
