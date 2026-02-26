import { handleActions } from "redux-actions";
import { INITIAL_OPPORTUNITY_STATE, IOpportunityStateContext } from "./context";
import { OpportunityActionEnums } from "./actions";

export const OpportunityReducer = handleActions<IOpportunityStateContext, Partial<IOpportunityStateContext>>(
  {
    [OpportunityActionEnums.fetchPending]:  (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.fetchSuccess]:  (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.fetchError]:    (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.mutatePending]: (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.mutateSuccess]: (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.mutateError]:   (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.setSelected]:   (state: any, action: { payload: any; }) => ({ ...state, ...action.payload }),
  },
  INITIAL_OPPORTUNITY_STATE
);