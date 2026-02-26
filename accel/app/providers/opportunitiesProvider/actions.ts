import { createAction } from "redux-actions";
import { IOpportunityStateContext, Opportunity } from "./context";

export enum OpportunityActionEnums {
  fetchPending = "OPPORTUNITY_FETCH_PENDING",
  fetchSuccess = "OPPORTUNITY_FETCH_SUCCESS",
  fetchError = "OPPORTUNITY_FETCH_ERROR",
  mutatePending = "OPPORTUNITY_MUTATE_PENDING",
  mutateSuccess = "OPPORTUNITY_MUTATE_SUCCESS",
  mutateError = "OPPORTUNITY_MUTATE_ERROR",
  setSelected = "OPPORTUNITY_SET_SELECTED",
}

export const fetchPending = createAction(
  OpportunityActionEnums.fetchPending,
  (): Partial<IOpportunityStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const fetchSuccess = createAction(
  OpportunityActionEnums.fetchSuccess,
  ({
    items,
    totalCount,
  }: {
    items: Opportunity[];
    totalCount: number;
  }): Partial<IOpportunityStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    opportunities: items.filter((o) => o.isActive !== false), // filter soft-deletes
    totalCount,
  }),
);

export const fetchError = createAction(
  OpportunityActionEnums.fetchError,
  (): Partial<IOpportunityStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const mutatePending = createAction(
  OpportunityActionEnums.mutatePending,
  (): Partial<IOpportunityStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const mutateSuccess = createAction(
  OpportunityActionEnums.mutateSuccess,
  (): Partial<IOpportunityStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  }),
);

export const mutateError = createAction(
  OpportunityActionEnums.mutateError,
  (): Partial<IOpportunityStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const setSelectedAction = createAction(
  OpportunityActionEnums.setSelected,
  (selected: Opportunity | null): Partial<IOpportunityStateContext> => ({
    selected,
  }),
);
