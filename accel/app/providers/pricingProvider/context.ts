import { createContext } from "react";

export interface PricingRequest {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  requestNumber: string;
  title: string;
  description: string | null;
  requestedById: string;
  requestedByName: string;
  assignedToId: string | null;
  assignedToName: string | null;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  requestedDate: string;
  requiredByDate: string;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPricingRequestStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  pricingRequests: PricingRequest[];
  selected: PricingRequest | null;
  totalCount: number;
}

export interface IPricingRequestActionContext {
  fetchPricingRequests: (params?: Record<string, any>) => Promise<void>;
  fetchMyRequests: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  setSelected: (request: PricingRequest | null) => void;
  createPricingRequest: (payload: any) => Promise<void>;
  updatePricingRequest: (id: string, payload: any) => Promise<void>;
  assignPricingRequest: (id: string, userId: string) => Promise<void>;
  completePricingRequest: (id: string) => Promise<void>;
}

export const INITIAL_PRICING_REQUEST_STATE: IPricingRequestStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  pricingRequests: [],
  selected: null,
  totalCount: 0,
};

export const PricingRequestStateContext =
  createContext<IPricingRequestStateContext>(INITIAL_PRICING_REQUEST_STATE);

export const PricingRequestActionContext =
  createContext<IPricingRequestActionContext | undefined>(undefined);