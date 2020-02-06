import React from 'react';
import { Link } from 'react-router-dom';
import RoutesPath from '../models/RoutesPath.model';
import Loading from '../components/Loading';

const Home = () => (
  <>
    Search View !?!?!?
    <input type="text" />
    <Loading />
    <li>
      <Link to={RoutesPath.Home}>Go Home</Link>
    </li>
  </>
);

export default Home;
