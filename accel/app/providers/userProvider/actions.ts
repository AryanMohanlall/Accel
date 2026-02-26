import { createAction } from "redux-actions";
import { IUser, IUserStateContext } from "./context";

export enum UserActionEnums {
  loginPending    = "LOGIN_PENDING",
  loginSuccess    = "LOGIN_SUCCESS",
  loginError      = "LOGIN_ERROR",
  registerPending = "REGISTER_PENDING",
  registerSuccess = "REGISTER_SUCCESS",
  registerError   = "REGISTER_ERROR",
  logout          = "LOGOUT",
}

export const loginPending = createAction<IUserStateContext>(
  UserActionEnums.loginPending,
  () => ({ isPending: true, isSuccess: false, isError: false, isAuthenticated: false, user: null })
);

export const loginSuccess = createAction<IUserStateContext, IUser>(
  UserActionEnums.loginSuccess,
  (user: IUser) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    user,
    isAuthenticated: true,
  })
);

export const loginError = createAction<IUserStateContext>(
  UserActionEnums.loginError,
  () => ({ isPending: false, isSuccess: false, isError: true, isAuthenticated: false, user: null })
);

export const registerPending = createAction<IUserStateContext>(
  UserActionEnums.registerPending,
  () => ({ isPending: true, isSuccess: false, isError: false, isAuthenticated: false, user: null })
);

export const registerSuccess = createAction<IUserStateContext, IUser>(
  UserActionEnums.registerSuccess,
  (user: IUser) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    user,
    isAuthenticated: true,
  })
);

export const registerError = createAction<IUserStateContext>(
  UserActionEnums.registerError,
  () => ({ isPending: false, isSuccess: false, isError: true, isAuthenticated: false, user: null })
);

export const logoutAction = createAction<IUserStateContext>(
  UserActionEnums.logout,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    user: null,
    isAuthenticated: false,
  })
);