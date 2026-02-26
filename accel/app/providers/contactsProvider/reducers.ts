import { handleActions } from "redux-actions";
import { INITIAL_CONTACT_STATE, IContactStateContext } from "./context";
import { ContactActionEnums } from "./actions";

export const ContactReducer = handleActions<
  IContactStateContext,
  Partial<IContactStateContext>
>(
  {
    [ContactActionEnums.fetchPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.fetchSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.fetchError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.mutatePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.mutateSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.mutateError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContactActionEnums.setSelected]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_CONTACT_STATE,
);
