import { combineReducers } from 'redux';
import Sample1Reducer from './Sample1.reducer';
import Sample2Reducer from './Sample2.reducer';

export interface RootState {
  Sample1Reducer: ReturnType<typeof Sample1Reducer>;
  Sample2Reducer: ReturnType<typeof Sample2Reducer>;
}

const appReducer = combineReducers({
  Sample1Reducer,
  Sample2Reducer,
});

export default appReducer;
