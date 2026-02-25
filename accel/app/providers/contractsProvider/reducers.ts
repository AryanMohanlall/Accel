import { handleActions } from "redux-actions";
import { INITIAL_CONTRACT_STATE, IContractStateContext } from "./context";
import { ContractActionEnums } from "./actions";

export const ContractReducer = handleActions<IContractStateContext, Partial<IContractStateContext>>(
  {
    [ContractActionEnums.fetchPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.fetchSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.fetchError]:    (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.mutatePending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.mutateSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.mutateError]:   (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.setSelected]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_CONTRACT_STATE
);