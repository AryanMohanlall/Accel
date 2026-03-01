import { PricingRequest } from "./context";

// ── Action types ──────────────────────────────────────────────────────────────
export const FETCH_PENDING   = "FETCH_PENDING";
export const FETCH_SUCCESS   = "FETCH_SUCCESS";
export const FETCH_ERROR     = "FETCH_ERROR";
export const MUTATE_PENDING  = "MUTATE_PENDING";
export const MUTATE_SUCCESS  = "MUTATE_SUCCESS";
export const MUTATE_ERROR    = "MUTATE_ERROR";
export const SET_SELECTED    = "SET_SELECTED";

// ── Action creators ───────────────────────────────────────────────────────────
export const fetchPending  = () => ({ type: FETCH_PENDING  as typeof FETCH_PENDING });
export const fetchError    = () => ({ type: FETCH_ERROR    as typeof FETCH_ERROR });
export const mutatePending = () => ({ type: MUTATE_PENDING as typeof MUTATE_PENDING });
export const mutateSuccess = () => ({ type: MUTATE_SUCCESS as typeof MUTATE_SUCCESS });
export const mutateError   = () => ({ type: MUTATE_ERROR   as typeof MUTATE_ERROR });

export const fetchSuccess = (payload: { items: PricingRequest[]; totalCount: number }) => ({
  type: FETCH_SUCCESS as typeof FETCH_SUCCESS,
  payload,
});

export const setSelectedAction = (payload: PricingRequest | null) => ({
  type: SET_SELECTED as typeof SET_SELECTED,
  payload,
});

export type PricingRequestAction =
  | ReturnType<typeof fetchPending>
  | ReturnType<typeof fetchSuccess>
  | ReturnType<typeof fetchError>
  | ReturnType<typeof mutatePending>
  | ReturnType<typeof mutateSuccess>
  | ReturnType<typeof mutateError>
  | ReturnType<typeof setSelectedAction>;