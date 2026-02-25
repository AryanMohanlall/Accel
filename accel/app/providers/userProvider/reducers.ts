import { handleActions } from "redux-actions";
import { INITIAL_USER_STATE, IUserStateContext } from "./context";
import { UserActionEnums } from "./actions";

export const UserReducer = handleActions<IUserStateContext, IUserStateContext>(
  {
    // --- Login Handlers ---
    [UserActionEnums.loginPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UserActionEnums.loginSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UserActionEnums.loginError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // --- Register Handlers ---
    [UserActionEnums.registerPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UserActionEnums.registerSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [UserActionEnums.registerError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // --- Logout Handler ---
    [UserActionEnums.logout]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_USER_STATE
);