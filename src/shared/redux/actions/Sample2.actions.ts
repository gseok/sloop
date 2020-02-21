import { createAction } from 'typesafe-actions';

enum ActionType {
  INCREASE = 'SAMPLE2/INCREASE',
  DECREASE = 'SAMPLE2/DECREASE',
  SET = 'SAMPLE2/SET',
}

export const increaseAction = createAction(ActionType.INCREASE)();
export const decreaseAction = createAction(ActionType.DECREASE)();
export const setAction = createAction(ActionType.SET)<number>();

export type Action = ReturnType<typeof increaseAction | typeof decreaseAction | typeof setAction>;
