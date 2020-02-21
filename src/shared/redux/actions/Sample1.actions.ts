// action types
export const SAMPLE1_ACTION_TYPE = {
  INCREASE: 'SAMPLE1/INCREMENT',
  DECREASE: 'SAMPLE1/DECREMENT',
  SET: 'SAMPLE1/SET',
};

// action creator
export const increaseAction = () => ({ type: SAMPLE1_ACTION_TYPE.INCREASE });
export const decreaseAction = () => ({ type: SAMPLE1_ACTION_TYPE.DECREASE });
export const setAction = (num: number) => ({ type: SAMPLE1_ACTION_TYPE.SET, payload: num });
