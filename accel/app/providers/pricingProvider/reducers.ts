import {
  IPricingRequestStateContext,
  INITIAL_PRICING_REQUEST_STATE,
} from "./context";
import {
  PricingRequestAction,
  FETCH_PENDING,
  FETCH_SUCCESS,
  FETCH_ERROR,
  MUTATE_PENDING,
  MUTATE_SUCCESS,
  MUTATE_ERROR,
  SET_SELECTED,
} from "./actions";

export const PricingRequestReducer = (
  state: IPricingRequestStateContext,
  action: PricingRequestAction,
): IPricingRequestStateContext => {
  switch (action.type) {
    case FETCH_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };

    case FETCH_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        pricingRequests: action.payload.items,
        totalCount: action.payload.totalCount,
      };

    case FETCH_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case MUTATE_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };

    case MUTATE_SUCCESS:
      return { ...state, isPending: false, isSuccess: true, isError: false };

    case MUTATE_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case SET_SELECTED:
      return { ...state, selected: action.payload };

    default:
      return state;
  }
};
