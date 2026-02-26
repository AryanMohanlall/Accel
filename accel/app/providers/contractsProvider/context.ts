import { createContext } from "react";

export interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  opportunityId: string;
  opportunityTitle: string;
  proposalId: string;
  proposalNumber: string;
  title: string;
  contractValue: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: number;
  statusName: string;
  renewalNoticePeriod: number;
  autoRenew: boolean;
  terms: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  daysUntilExpiry: number;
  isExpiringSoon: boolean;
  renewalsCount: number;
}

export interface IContractStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contracts: Contract[];
  selected: Contract | null;
}

export interface IContractActionContext {
  fetchContracts: () => Promise<void>;
  setSelected: (contract: Contract | null) => void;
  createContract: (payload: any) => Promise<void>;
  updateContract: (id: string, payload: any) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  activateContract: (id: string) => Promise<void>;
  cancelContract: (id: string) => Promise<void>;
}

export const INITIAL_CONTRACT_STATE: IContractStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  contracts: [],
  selected: null,
};

export const ContractStateContext =
  createContext<IContractStateContext>(INITIAL_CONTRACT_STATE);

export const ContractActionContext =
  createContext<IContractActionContext | undefined>(undefined);