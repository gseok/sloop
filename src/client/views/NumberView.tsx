import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/redux/reducers/reducers';

const NumberDisplay = () => {
  const number1 = useSelector((state: RootState) => state.Sample1Reducer.number);
  const number2 = useSelector((state: RootState) => state.Sample2Reducer.number);

  return (
    <>
      <h5>Number Display...</h5>
      <div>{number1}</div>
      <div>{number2}</div>
    </>
  );
};

export default NumberDisplay;
