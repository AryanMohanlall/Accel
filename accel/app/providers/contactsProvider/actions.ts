import { createAction } from "redux-actions";
import { IContactStateContext, Contact } from "./context";

export enum ContactActionEnums {
  fetchPending = "CONTACT_FETCH_PENDING",
  fetchSuccess = "CONTACT_FETCH_SUCCESS",
  fetchError = "CONTACT_FETCH_ERROR",
  mutatePending = "CONTACT_MUTATE_PENDING",
  mutateSuccess = "CONTACT_MUTATE_SUCCESS",
  mutateError = "CONTACT_MUTATE_ERROR",
  setSelected = "CONTACT_SET_SELECTED",
}

export const fetchPending = createAction(
  ContactActionEnums.fetchPending,
  (): Partial<IContactStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const fetchSuccess = createAction(
  ContactActionEnums.fetchSuccess,
  ({
    items,
    totalCount,
  }: {
    items: Contact[];
    totalCount: number;
  }): Partial<IContactStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    contacts: items,
    totalCount,
  }),
);

export const fetchError = createAction(
  ContactActionEnums.fetchError,
  (): Partial<IContactStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const mutatePending = createAction(
  ContactActionEnums.mutatePending,
  (): Partial<IContactStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const mutateSuccess = createAction(
  ContactActionEnums.mutateSuccess,
  (): Partial<IContactStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  }),
);

export const mutateError = createAction(
  ContactActionEnums.mutateError,
  (): Partial<IContactStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const setSelectedAction = createAction(
  ContactActionEnums.setSelected,
  (selected: Contact | null): Partial<IContactStateContext> => ({ selected }),
);
