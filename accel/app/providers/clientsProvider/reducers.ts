import { handleActions } from "redux-actions";
import { INITIAL_CLIENT_STATE, IClientStateContext } from "./context";
import { ClientActionEnums } from "./actions";

export const ClientReducer = handleActions<
  IClientStateContext,
  Partial<IClientStateContext>
>(
  {
    [ClientActionEnums.fetchPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.fetchSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.fetchError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.mutatePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.mutateSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.mutateError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ClientActionEnums.setSelected]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_CLIENT_STATE,
);
