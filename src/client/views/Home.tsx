import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import RoutesPath from '../models/RoutesPath.model';
import NumberView from './NumberView';
import * as Number1Action from '../../shared/redux/actions/Sample1.actions';
import * as Number2Action from '../../shared/redux/actions/Sample2.actions';

const Home = () => {
  const dispatch = useDispatch();
  const incrementCounter = useCallback(() => dispatch(Number1Action.increaseAction()), [dispatch]);
  const decrementCounter = useCallback(() => dispatch(Number1Action.decreaseAction()), [dispatch]);
  const incrementCounter2 = useCallback(() => dispatch(Number2Action.increaseAction()), [dispatch]);
  const decrementCounter2 = useCallback(() => dispatch(Number2Action.decreaseAction()), [dispatch]);

  return (
    <>
      Home View !!!!@@@
      <li>
        <Link to={RoutesPath.Search}>Go Search</Link>
      </li>
      <h5>Number1 Control</h5>
      <div>
        <button type="button" onClick={incrementCounter}>
          Increase
        </button>
        <button type="button" onClick={decrementCounter}>
          Decrease
        </button>
      </div>
      <h5>Number2 Control</h5>
      <div>
        <button type="button" onClick={incrementCounter2}>
          Increase
        </button>
        <button type="button" onClick={decrementCounter2}>
          Decrease
        </button>
      </div>
      <NumberView />
    </>
  );
};

export default Home;
