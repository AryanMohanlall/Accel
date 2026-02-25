"use client";

import React, { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import {
  INITIAL_ACTIVITY_STATE,
  ActivityStateContext,
  ActivityActionContext,
  Activity,
} from "./context";
import { ActivityReducer } from "./reducers";
import {
  fetchPending, fetchSuccess, fetchError,
  mutatePending, mutateSuccess, mutateError,
  setSelectedAction,
} from "./actions";

export const ActivityProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [state, dispatch] = useReducer(ActivityReducer, INITIAL_ACTIVITY_STATE);
  const instance = getAxiosInstance();

  const fetchActivities = async () => {
    dispatch(fetchPending());
    try {
      const res = await instance.get('/api/Activities');
      dispatch(fetchSuccess(res.data));
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      dispatch(fetchError());
      throw error;
    }
  };

  const setSelected = (activity: Activity | null) => {
    dispatch(setSelectedAction(activity));
  };

  const createActivity = async (payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.post('/api/Activities', payload);
      dispatch(mutateSuccess());
      await fetchActivities();
    } catch (error) {
      console.error("Failed to create activity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const updateActivity = async (id: string, payload: any) => {
    dispatch(mutatePending());
    try {
      await instance.put(`/api/Activities/${id}`, payload);
      dispatch(mutateSuccess());
      await fetchActivities();
    } catch (error) {
      console.error("Failed to update activity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    dispatch(mutatePending());
    try {
      await instance.delete(`/api/Activities/${id}`);
      dispatch(mutateSuccess());
      await fetchActivities();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      dispatch(mutateError());
      throw error;
    }
  };

  const actions = {
    fetchActivities,
    setSelected,
    createActivity,
    updateActivity,
    deleteActivity,
  };

  return React.createElement(
    ActivityStateContext.Provider,
    { value: state },
    React.createElement(
      ActivityActionContext.Provider,
      { value: actions },
      children
    )
  );
};

export const useActivityState = () => {
  const context = useContext(ActivityStateContext);
  if (context === undefined) throw new Error("useActivityState must be used within an ActivityProvider");
  return context;
};

export const useActivityActions = () => {
  const context = useContext(ActivityActionContext);
  if (context === undefined) throw new Error("useActivityActions must be used within an ActivityProvider");
  return context;
};