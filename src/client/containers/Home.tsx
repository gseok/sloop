import React from 'react';
import { Link } from 'react-router-dom';
import RoutesPath from '../models/RoutesPath.model';

const Home = () => (
  <>
    Home View !!!!@@@
    <li>
      <Link to={RoutesPath.Search}>Go Search</Link>
    </li>
  </>
);

export default Home;
