import { handleActions } from "redux-actions";
import { INITIAL_ACTIVITY_STATE, IActivityStateContext } from "./context";
import { ActivityActionEnums } from "./actions";

export const ActivityReducer = handleActions<
  IActivityStateContext,
  Partial<IActivityStateContext>
>(
  {
    [ActivityActionEnums.fetchPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.fetchSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.fetchError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.mutatePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.mutateSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.mutateError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ActivityActionEnums.setSelected]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_ACTIVITY_STATE,
);
