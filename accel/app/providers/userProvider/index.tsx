"use client";

import React, { useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import { 
  INITIAL_USER_STATE, 
  UserStateContext, 
  UserActionContext, 
  IUser 
} from "./context";
import { UserReducer } from "./reducers";
import { 
  loginPending, loginSuccess, loginError, 
  registerPending, registerSuccess, registerError, 
  logoutAction 
} from "./actions";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_USER_STATE);
  const instance = getAxiosInstance();

  const login = async (payload: any) => {
    dispatch(loginPending()); 
    
    try {
      const response = await instance.post(`/api/Auth/login`, payload);
      const userData: IUser = response.data;

      Cookies.set("token", userData.token, { expires: 1, secure: false });
      Cookies.set("accel_user", JSON.stringify(userData), { expires: 1 });

      dispatch(loginSuccess(userData));
    } catch (error) {
      console.error("Login failed:", error);
      dispatch(loginError());
      throw error; // rethrow so login.tsx catch block can handle it
    }
  };

  const checkAuth = () => {
    const savedUser = Cookies.get("accel_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(loginSuccess(userData));
      } catch (e) {
        logout();
      }
    }
  };

  const register = async (payload: any) => {
    dispatch(registerPending());

    try {
      await instance.post(`/api/Auth/register`, payload);
      dispatch(registerSuccess());
    } catch (error: any) {
      const errorData = error.response?.data;
      console.log("Server Error Detail:", errorData?.detail);
      console.log("Server Error Title:", errorData?.title);
      console.log(error.response);
      dispatch(registerError());
      throw error; // rethrow so register page catch block can handle it
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("accel_user");
    dispatch(logoutAction());
    window.location.href = "/login";
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      <UserActionContext.Provider value={{ login, register, logout, checkAuth }}>
        {children}
      </UserActionContext.Provider>
    </UserStateContext.Provider>
  );
};

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
};

export const useUserActions = () => {
  const context = useContext(UserActionContext);
  if (context === undefined) {
    throw new Error("useUserActions must be used within a UserProvider");
  }
  return context;
};