import { createAction } from "redux-actions";
import { IUser, IUserStateContext } from "./context";

// Enum defining the type of actions for Authentication
export enum UserActionEnums {
  loginPending = "LOGIN_PENDING",
  loginSuccess = "LOGIN_SUCCESS",
  loginError = "LOGIN_ERROR",

  registerPending = "REGISTER_PENDING",
  registerSuccess = "REGISTER_SUCCESS",
  registerError = "REGISTER_ERROR",

  logout = "LOGOUT",
}

// --- Login Actions ---

export const loginPending = createAction<IUserStateContext>(
  UserActionEnums.loginPending,
  () => ({ isPending: true, isSuccess: false, isError: false, isAuthenticated: false })
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
  () => ({ isPending: false, isSuccess: false, isError: true, isAuthenticated: false })
);

// --- Register Actions ---

export const registerPending = createAction<IUserStateContext>(
  UserActionEnums.registerPending,
  () => ({ isPending: true, isSuccess: false, isError: false, isAuthenticated: false })
);

export const registerSuccess = createAction<IUserStateContext>(
  UserActionEnums.registerSuccess,
  () => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    isAuthenticated: false, // Registration doesn't usually auto-login in this flow
  })
);

export const registerError = createAction<IUserStateContext>(
  UserActionEnums.registerError,
  () => ({ isPending: false, isSuccess: false, isError: true, isAuthenticated: false })
);

// --- Logout Action ---

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