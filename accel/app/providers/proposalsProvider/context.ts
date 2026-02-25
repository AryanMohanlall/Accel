import { createContext } from "react";

export interface Proposal {
  id: string;
  proposalNumber: string;
  opportunityId: string;
  opportunityTitle: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  status: number;
  statusName: string;
  totalAmount: number;
  currency: string;
  validUntil: string;
  submittedDate: string;
  approvedDate: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  lineItemsCount: number;
}

export interface IProposalStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  proposals: Proposal[];
  selected: Proposal | null;
}

export interface IProposalActionContext {
  fetchProposals: () => Promise<void>;
  setSelected: (proposal: Proposal | null) => void;
  createProposal: (payload: any) => Promise<void>;
  updateProposal: (id: string, payload: any) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;
}

export const INITIAL_PROPOSAL_STATE: IProposalStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  proposals: [],
  selected: null,
};

export const ProposalStateContext =
  createContext<IProposalStateContext>(INITIAL_PROPOSAL_STATE);

export const ProposalActionContext =
  createContext<IProposalActionContext | undefined>(undefined);