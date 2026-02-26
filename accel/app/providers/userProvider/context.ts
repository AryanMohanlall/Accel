import { createContext } from "react";

// Interface representing the specific login response from your API
export interface IUser {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  expiresAt: string;
}

// Interface for the authentication state
export interface IUserStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  user: IUser | null;
  isAuthenticated: boolean;
}

// Interface for the authentication actions
export interface IUserActionContext {
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void; // Used to re-hydrate state from localStorage on refresh
}

// Initial state for the User Context
export const INITIAL_USER_STATE: IUserStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  user: null,
  isAuthenticated: false,
};

// 1. UserStateContext - Holds the current auth status and user details
export const UserStateContext = 
  createContext<IUserStateContext>(INITIAL_USER_STATE);

// 2. UserActionContext - Holds the login/register/logout methods
// Using undefined! or a typed interface to ensure it's provided in the tree
export const UserActionContext = 
  createContext<IUserActionContext | undefined>(undefined);