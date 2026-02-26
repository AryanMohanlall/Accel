import { createContext } from "react";

export interface IUser {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  tenantId: string;
  expiresAt: string;
}

export interface IUserStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  user: IUser | null;
  isAuthenticated: boolean;
}

export interface IUserActionContext {
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const INITIAL_USER_STATE: IUserStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  user: null,
  isAuthenticated: false,
};

export const UserStateContext =
  createContext<IUserStateContext>(INITIAL_USER_STATE);

export const UserActionContext =
  createContext<IUserActionContext | undefined>(undefined);