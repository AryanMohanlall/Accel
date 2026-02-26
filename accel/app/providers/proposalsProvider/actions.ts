import { createAction } from "redux-actions";
import { IProposalStateContext, Proposal } from "./context";

export enum ProposalActionEnums {
  fetchPending = "PROPOSAL_FETCH_PENDING",
  fetchSuccess = "PROPOSAL_FETCH_SUCCESS",
  fetchError = "PROPOSAL_FETCH_ERROR",
  mutatePending = "PROPOSAL_MUTATE_PENDING",
  mutateSuccess = "PROPOSAL_MUTATE_SUCCESS",
  mutateError = "PROPOSAL_MUTATE_ERROR",
  setSelected = "PROPOSAL_SET_SELECTED",
}

export const fetchPending = createAction(
  ProposalActionEnums.fetchPending,
  (): Partial<IProposalStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const fetchSuccess = createAction(
  ProposalActionEnums.fetchSuccess,
  (proposals: Proposal[]): Partial<IProposalStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    proposals,
  }),
);

export const fetchError = createAction(
  ProposalActionEnums.fetchError,
  (): Partial<IProposalStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const mutatePending = createAction(
  ProposalActionEnums.mutatePending,
  (): Partial<IProposalStateContext> => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  }),
);

export const mutateSuccess = createAction(
  ProposalActionEnums.mutateSuccess,
  (): Partial<IProposalStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  }),
);

export const mutateError = createAction(
  ProposalActionEnums.mutateError,
  (): Partial<IProposalStateContext> => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  }),
);

export const setSelectedAction = createAction(
  ProposalActionEnums.setSelected,
  (selected: Proposal | null): Partial<IProposalStateContext> => ({ selected }),
);
