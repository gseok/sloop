import { createReducer } from 'typesafe-actions';
import * as SAMPLE2_ACTION from '../actions/Sample2.actions';

interface State {
  number: number;
}

export const initialState: State = {
  number: 0,
};

export default createReducer<State, SAMPLE2_ACTION.Action>(initialState)
  .handleAction(SAMPLE2_ACTION.increaseAction, (state) => ({
    ...state,
    number: state.number + 1,
  }))
  .handleAction(SAMPLE2_ACTION.decreaseAction, (state) => ({
    ...state,
    number: state.number - 1,
  }))
  .handleAction(SAMPLE2_ACTION.setAction, (state, action) => ({
    ...state,
    number: action.payload,
  }));
