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
    //try {
      //const res = await instance.get('/api/Activities');
      const res : any = {};
      res.data= 
      [
  {
    "id": "a1b2c3d4-0001-4562-b3fc-2c963f66afa6",
    "type": 1,
    "typeName": "Call",
    "subject": "Follow-up call with Acme Corporation",
    "description": "Discuss the progress of the enterprise software deal and address any concerns about the implementation timeline.",
    "relatedToType": 1,
    "relatedToTypeName": "Opportunity",
    "relatedToId": "87a0995e-25b5-4c2b-baf5-44518be58fc8",
    "relatedToTitle": "Enterprise Software Solution",
    "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
    "assignedToName": "System Administrator",
    "status": 1,
    "statusName": "Pending",
    "priority": 3,
    "priorityName": "High",
    "dueDate": "2026-02-20T10:00:00.000Z",
    "completedDate": null,
    "duration": 30,
    "location": "",
    "outcome": "",
    "createdById": "4446e829-4761-4da5-8f38-8c20a778500c",
    "createdByName": "System Administrator",
    "createdAt": "2026-02-18T08:00:00.000Z",
    "updatedAt": "2026-02-18T08:00:00.000Z",
    "isOverdue": true,
    "participantsCount": 0
  },
  {
    "id": "a1b2c3d4-0002-4562-b3fc-2c963f66afa6",
    "type": 3,
    "typeName": "Meeting",
    "subject": "Proposal review meeting — Acme Corporation",
    "description": "Walk through the full proposal document with the client's procurement team and answer technical questions about integration with their existing ERP system.",
    "relatedToType": 2,
    "relatedToTypeName": "Proposal",
    "relatedToId": "b40307b4-726f-4d0d-a57e-5f3be55f03b9",
    "relatedToTitle": "Enterprise Software Proposal v2",
    "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
    "assignedToName": "System Administrator",
    "status": 3,
    "statusName": "Completed",
    "priority": 2,
    "priorityName": "Medium",
    "dueDate": "2026-02-22T14:00:00.000Z",
    "completedDate": "2026-02-22T15:30:00.000Z",
    "duration": 90,
    "location": "Conference Room B, Acme HQ",
    "outcome": "Client requested minor adjustments to payment terms. Follow-up email sent with revised proposal.",
    "createdById": "4446e829-4761-4da5-8f38-8c20a778500c",
    "createdByName": "System Administrator",
    "createdAt": "2026-02-19T09:00:00.000Z",
    "updatedAt": "2026-02-22T16:00:00.000Z",
    "isOverdue": false,
    "participantsCount": 4
  },
  {
    "id": "a1b2c3d4-0003-4562-b3fc-2c963f66afa6",
    "type": 2,
    "typeName": "Email",
    "subject": "Send revised contract to legal team",
    "description": "Forward the updated contract with amended clause 7.3 regarding liability caps to both internal legal and client-side counsel for final review before signing.",
    "relatedToType": 3,
    "relatedToTypeName": "Contract",
    "relatedToId": "c50418c5-837g-5e1e-bd68-96804d117b8b",
    "relatedToTitle": "Acme Master Services Agreement",
    "assignedToId": "9bcbc10e-c326-4e17-9405-31217c9a25a4",
    "assignedToName": "Jane Smith",
    "status": 1,
    "statusName": "Pending",
    "priority": 2,
    "priorityName": "Medium",
    "dueDate": "2026-02-28T17:00:00.000Z",
    "completedDate": null,
    "duration": 15,
    "location": "",
    "outcome": "",
    "createdById": "4446e829-4761-4da5-8f38-8c20a778500c",
    "createdByName": "System Administrator",
    "createdAt": "2026-02-23T11:00:00.000Z",
    "updatedAt": "2026-02-23T11:00:00.000Z",
    "isOverdue": false,
    "participantsCount": 2
  },
  {
    "id": "a1b2c3d4-0004-4562-b3fc-2c963f66afa6",
    "type": 4,
    "typeName": "Task",
    "subject": "Prepare Q1 pipeline report",
    "description": "Compile all open opportunities, their current stage, estimated close dates and weighted values into the Q1 pipeline deck for the sales leadership review on March 3rd.",
    "relatedToType": 1,
    "relatedToTypeName": "Opportunity",
    "relatedToId": "620a4aca-8d68-42b4-8e36-3851782149b7",
    "relatedToTitle": "Enterprise Software Solution",
    "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
    "assignedToName": "System Administrator",
    "status": 2,
    "statusName": "In Progress",
    "priority": 1,
    "priorityName": "Low",
    "dueDate": "2026-03-02T09:00:00.000Z",
    "completedDate": null,
    "duration": 120,
    "location": "",
    "outcome": "",
    "createdById": "4446e829-4761-4da5-8f38-8c20a778500c",
    "createdByName": "System Administrator",
    "createdAt": "2026-02-24T07:30:00.000Z",
    "updatedAt": "2026-02-25T10:00:00.000Z",
    "isOverdue": false,
    "participantsCount": 0
  },
  {
    "id": "a1b2c3d4-0005-4562-b3fc-2c963f66afa6",
    "type": 5,
    "typeName": "Demo",
    "subject": "Product demo for TechStart Inc",
    "description": "Live product demonstration covering modules 1–4. Focus on the reporting dashboard and API integration capabilities that the client specifically asked about during discovery.",
    "relatedToType": 1,
    "relatedToTypeName": "Opportunity",
    "relatedToId": "87a0995e-25b5-4c2b-baf5-44518be58fc8",
    "relatedToTitle": "Test",
    "assignedToId": "9bcbc10e-c326-4e17-9405-31217c9a25a4",
    "assignedToName": "Jane Smith",
    "status": 1,
    "statusName": "Pending",
    "priority": 3,
    "priorityName": "High",
    "dueDate": "2026-02-15T11:00:00.000Z",
    "completedDate": null,
    "duration": 60,
    "location": "Zoom — link in calendar invite",
    "outcome": "",
    "createdById": "9bcbc10e-c326-4e17-9405-31217c9a25a4",
    "createdByName": "Jane Smith",
    "createdAt": "2026-02-10T08:00:00.000Z",
    "updatedAt": "2026-02-10T08:00:00.000Z",
    "isOverdue": true,
    "participantsCount": 3
  },
  {
    "id": "a1b2c3d4-0006-4562-b3fc-2c963f66afa6",
    "type": 1,
    "typeName": "Call",
    "subject": "Renewal discussion — Acme support contract",
    "description": "Check in on satisfaction with the current support tier and present options for the upcoming renewal. Highlight the new premium SLA package.",
    "relatedToType": 3,
    "relatedToTypeName": "Contract",
    "relatedToId": "c50418c5-837g-5e1e-bd68-96804d117b8b",
    "relatedToTitle": "Acme Support Contract 2025",
    "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
    "assignedToName": "System Administrator",
    "status": 3,
    "statusName": "Completed",
    "priority": 2,
    "priorityName": "Medium",
    "dueDate": "2026-02-21T10:30:00.000Z",
    "completedDate": "2026-02-21T11:00:00.000Z",
    "duration": 25,
    "location": "",
    "outcome": "Client is happy with current tier. Will review premium options internally and revert by end of month.",
    "createdById": "4446e829-4761-4da5-8f38-8c20a778500c",
    "createdByName": "System Administrator",
    "createdAt": "2026-02-20T14:00:00.000Z",
    "updatedAt": "2026-02-21T11:05:00.000Z",
    "isOverdue": false,
    "participantsCount": 1
  }
]
      dispatch(fetchSuccess(res.data));
   /*  } catch (error) {
      console.error("Failed to fetch activities:", error);
      dispatch(fetchError());
      throw error;
    } */
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