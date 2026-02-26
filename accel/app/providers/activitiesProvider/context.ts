import { createContext } from "react";

export interface Activity {
  id: string;
  type: number;
  typeName: string;
  subject: string;
  description: string;
  relatedToType: number;
  relatedToTypeName: string;
  relatedToId: string;
  relatedToTitle: string;
  assignedToId: string;
  assignedToName: string;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  dueDate: string;
  completedDate: string | null;
  duration: number;
  location: string;
  outcome: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  participantsCount: number;
}

export interface IActivityStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  activities: Activity[];
  selected: Activity | null;
}

export interface IActivityActionContext {
  fetchActivities: () => Promise<void>;
  setSelected: (activity: Activity | null) => void;
  createActivity: (payload: any) => Promise<void>;
  updateActivity: (id: string, payload: any) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const INITIAL_ACTIVITY_STATE: IActivityStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  activities: [],
  selected: null,
};

export const ActivityStateContext =
  createContext<IActivityStateContext>(INITIAL_ACTIVITY_STATE);

export const ActivityActionContext =
  createContext<IActivityActionContext | undefined>(undefined);