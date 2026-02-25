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

  // Handle Login
  const login = async (payload: any) => {
    dispatch(loginPending());
    const endpoint = `/api/Auth/login`;
    
    await instance.post(endpoint, payload)
      .then((response) => {
        const userData: IUser = response.data;
        
        // --- COOKIE PERSISTENCE ---
        // We set 'token' for the Axios interceptor and 'accel_user' for the state
        // expires: 1 means the cookie lasts for 1 day.
        Cookies.set("token", userData.token, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set("accel_user", JSON.stringify(userData), { expires: 1 });
        
        dispatch(loginSuccess(userData));
      })
      .catch((error) => {
        console.error("Login failed:", error);
        dispatch(loginError());
      });
  };

  // Handle Registration
  const register = async (payload: any) => {
    dispatch(registerPending());
    const endpoint = `/api/Auth/register`;

    console.log(payload);
    
    await instance.post(endpoint, payload)
      .then(() => {
        dispatch(registerSuccess());
      })
      .catch((error) => {
// 1. Extract the specific error info from the Swagger response
    const errorData = error.response?.data;
    
    // 2. Log it so you can see the "detail" in the console
    console.log("Server Error Detail:", errorData?.detail);
    console.log("Server Error Title:", errorData?.title);
    console.log(error.response);

    // 3. Display the most descriptive message to the user
    const friendlyMsg = errorData?.detail || errorData?.title || "Registration failed";
    
    // If the server sends a list of strings (common in .NET Identity)

        dispatch(registerError());
      });
  };

  // Handle Logout
  const logout = () => {
    // --- CLEAR COOKIES ---
    Cookies.remove("token");
    Cookies.remove("accel_user");
    
    dispatch(logoutAction());
    window.location.href = "/login";
  };

  // Check Auth (Re-hydrate state from Cookies)
  const checkAuth = () => {
    const savedUser = Cookies.get("accel_user");
    if (savedUser) {
      try {
        dispatch(loginSuccess(JSON.parse(savedUser)));
      } catch (e) {
        console.error("Failed to parse user cookie", e);
        logout(); // Clean up if cookie is corrupted
      }
    }
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

// ... custom hooks stay the same

// Custom Hooks for consumption
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