import { createContext } from "react";

export interface ProposalLineItem {
  id: string;
  proposalId: string;
  productServiceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalPrice: number;
  sortOrder: number;
}
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
  validUntil: string | null;
  submittedDate: string | null;
  approvedDate: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  lineItemsCount: number;
  lineItems: ProposalLineItem[];
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
  submitProposal: (id: string) => Promise<void>;
  approveProposal: (id: string) => Promise<void>;
  rejectProposal: (id: string, reason: string) => Promise<void>;
}

export const INITIAL_PROPOSAL_STATE: IProposalStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  proposals: [],
  selected: null,
};

export const ProposalStateContext = createContext<IProposalStateContext>(
  INITIAL_PROPOSAL_STATE,
);

export const ProposalActionContext = createContext<
  IProposalActionContext | undefined
>(undefined);