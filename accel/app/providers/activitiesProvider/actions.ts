import { createAction } from "redux-actions";
import { IActivityStateContext, Activity } from "./context";

export enum ActivityActionEnums {
  fetchPending  = "ACTIVITY_FETCH_PENDING",
  fetchSuccess  = "ACTIVITY_FETCH_SUCCESS",
  fetchError    = "ACTIVITY_FETCH_ERROR",
  mutatePending = "ACTIVITY_MUTATE_PENDING",
  mutateSuccess = "ACTIVITY_MUTATE_SUCCESS",
  mutateError   = "ACTIVITY_MUTATE_ERROR",
  setSelected   = "ACTIVITY_SET_SELECTED",
}

export const fetchPending = createAction(
  ActivityActionEnums.fetchPending,
  (): Partial<IActivityStateContext> => ({
    isPending: true, isSuccess: false, isError: false,
  })
);

export const fetchSuccess = createAction(
  ActivityActionEnums.fetchSuccess,
  (activities: Activity[]): Partial<IActivityStateContext> => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    activities,
  })
);

export const fetchError = createAction(
  ActivityActionEnums.fetchError,
  (): Partial<IActivityStateContext> => ({
    isPending: false, isSuccess: false, isError: true,
  })
);

export const mutatePending = createAction(
  ActivityActionEnums.mutatePending,
  (): Partial<IActivityStateContext> => ({
    isPending: true, isSuccess: false, isError: false,
  })
);

export const mutateSuccess = createAction(
  ActivityActionEnums.mutateSuccess,
  (): Partial<IActivityStateContext> => ({
    isPending: false, isSuccess: true, isError: false,
  })
);

export const mutateError = createAction(
  ActivityActionEnums.mutateError,
  (): Partial<IActivityStateContext> => ({
    isPending: false, isSuccess: false, isError: true,
  })
);

export const setSelectedAction = createAction(
  ActivityActionEnums.setSelected,
  (selected: Activity | null): Partial<IActivityStateContext> => ({ selected }),
);