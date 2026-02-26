import { handleActions } from "redux-actions";
import { INITIAL_PROPOSAL_STATE, IProposalStateContext } from "./context";
import { ProposalActionEnums } from "./actions";

export const ProposalReducer = handleActions<IProposalStateContext, Partial<IProposalStateContext>>(
  {
    [ProposalActionEnums.fetchPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.fetchSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.fetchError]:    (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.mutatePending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.mutateSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.mutateError]:   (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.setSelected]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_PROPOSAL_STATE
);