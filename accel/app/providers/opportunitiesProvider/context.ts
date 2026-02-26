import { createContext } from "react";

export interface Opportunity {
  id: string;
  title: string;
  clientId: string;      
  clientName: string;
  contactId: string | null;
  contactName: string | null;
  ownerName: string;
  estimatedValue: number;
  currency: string;
  probability: number;
  source: number;         
  stage: number;
  stageName: string;
  expectedCloseDate: string;
  description: string | null;
  isActive: boolean;
}

export interface IOpportunityStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  opportunities: Opportunity[];
  selected: Opportunity | null;
  totalCount: number;
}

export interface IOpportunityActionContext {
  fetchOpportunities: () => Promise<void>;
  setSelected: (opportunity: Opportunity | null) => void;
  createOpportunity: (payload: any) => Promise<void>;
  updateOpportunity: (id: string, payload: any) => Promise<void>;
  moveOpportunityStage: (id: string, newStage: number, notes?: string, lossReason?: string) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
}

export const INITIAL_OPPORTUNITY_STATE: IOpportunityStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  opportunities: [],
  selected: null,
  totalCount: 0,
};

export const OpportunityStateContext =
  createContext<IOpportunityStateContext>(INITIAL_OPPORTUNITY_STATE);

export const OpportunityActionContext =
  createContext<IOpportunityActionContext | undefined>(undefined);