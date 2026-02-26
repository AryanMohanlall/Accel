import { createContext } from "react";

export interface Contact {
  id: string;
  clientId: string;
  clientName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  isPrimaryContact: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IContactStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contacts: Contact[];
  selected: Contact | null;
  totalCount: number;
}

export interface IContactActionContext {
  fetchContacts: (clientId?: string) => Promise<void>;
  setSelected: (contact: Contact | null) => void;
  createContact: (payload: any) => Promise<void>;
  updateContact: (id: string, payload: any) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const INITIAL_CONTACT_STATE: IContactStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  contacts: [],
  selected: null,
  totalCount: 0,
};

export const ContactStateContext = createContext<IContactStateContext>(
  INITIAL_CONTACT_STATE,
);

export const ContactActionContext = createContext<
  IContactActionContext | undefined
>(undefined);
