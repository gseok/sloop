import { SAMPLE1_ACTION_TYPE } from '../actions/Sample1.actions';

export const initialState = {
  number: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Sample1Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAMPLE1_ACTION_TYPE.INCREASE:
      return {
        ...state,
        number: state.number + 1,
      };
    case SAMPLE1_ACTION_TYPE.DECREASE:
      return {
        ...state,
        number: state.number - 1,
      };
    case SAMPLE1_ACTION_TYPE.SET:
      return {
        ...state,
        number: action.payload,
      };
    default:
      return state;
  }
};

export default Sample1Reducer;
