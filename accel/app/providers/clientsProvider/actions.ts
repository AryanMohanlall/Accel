import { createAction } from "redux-actions";
import { IClientStateContext, Client } from "./context";

export enum ClientActionEnums {
  fetchPending  = "CLIENT_FETCH_PENDING",
  fetchSuccess  = "CLIENT_FETCH_SUCCESS",
  fetchError    = "CLIENT_FETCH_ERROR",
  mutatePending = "CLIENT_MUTATE_PENDING",
  mutateSuccess = "CLIENT_MUTATE_SUCCESS",
  mutateError   = "CLIENT_MUTATE_ERROR",
  setSelected   = "CLIENT_SET_SELECTED",
}

export const fetchPending = createAction(
  ClientActionEnums.fetchPending,
  (): Partial<IClientStateContext> => ({
    isPending: true, isSuccess: false, isError: false,
  })
);

export const fetchSuccess = createAction(
  ClientActionEnums.fetchSuccess,
  ({ items, totalCount }: { items: Client[]; totalCount: number }): Partial<IClientStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    clients: items,
    totalCount,
  })
);

export const fetchError = createAction(
  ClientActionEnums.fetchError,
  (): Partial<IClientStateContext> => ({
    isPending: false, isSuccess: false, isError: true,
  })
);

export const mutatePending = createAction(
  ClientActionEnums.mutatePending,
  (): Partial<IClientStateContext> => ({
    isPending: true, isSuccess: false, isError: false,
  })
);

export const mutateSuccess = createAction(
  ClientActionEnums.mutateSuccess,
  (): Partial<IClientStateContext> => ({
    isPending: false, isSuccess: true, isError: false,
  })
);

export const mutateError = createAction(
  ClientActionEnums.mutateError,
  (): Partial<IClientStateContext> => ({
    isPending: false, isSuccess: false, isError: true,
  })
);

export const setSelectedAction = createAction(
  ClientActionEnums.setSelected,
  (selected: Client | null): Partial<IClientStateContext> => ({ selected }),
);