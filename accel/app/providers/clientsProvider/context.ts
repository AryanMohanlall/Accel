import { createContext } from "react";

export interface Client {
  id: string;
  name: string;
  industry: string;
  companySize: string;
  website: string;
  billingAddress: string;
  taxNumber: string;
  clientType: number;
  isActive: boolean;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  contactsCount: number;
  opportunitiesCount: number;
  contractsCount: number;
}

export interface IClientStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  clients: Client[];
  selected: Client | null;
  totalCount: number;
}

export interface IClientActionContext {
  fetchClients: () => Promise<void>;
  setSelected: (client: Client | null) => void;
  createClient: (payload: any) => Promise<void>;
  updateClient: (id: string, payload: any) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const INITIAL_CLIENT_STATE: IClientStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  clients: [],
  selected: null,
  totalCount: 0,
};

export const ClientStateContext =
  createContext<IClientStateContext>(INITIAL_CLIENT_STATE);

export const ClientActionContext = createContext<
  IClientActionContext | undefined
>(undefined);
