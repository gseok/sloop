/* eslint-disable no-console */
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import RoutesPath from '../models/RoutesPath.model';
import Loading from '../components/Loading';
import getSearchApi from '../api/getSearch.api';
import getGeoCodeApi from '../api/getGeoCode.api';

const Search = () => {
  const internalApiCall = useCallback(async () => {
    const res0 = await getGeoCodeApi();
    const res1 = await getGeoCodeApi('local');
    const res2 = await getGeoCodeApi('dev');
    const res3 = await getGeoCodeApi('test');
    const res4 = await getGeoCodeApi('real');
    console.log('internal >', res0, res1, res2, res3, res4);
  }, []);

  const externalApiCall = useCallback(async () => {
    const res0 = await getSearchApi();
    const res1 = await getSearchApi('local');
    const res2 = await getSearchApi('dev');
    const res3 = await getSearchApi('test');
    const res4 = await getSearchApi('real');
    console.log('external >', res0, res1, res2, res3, res4);
  }, []);

  return (
    <>
      Search View !?!?!?
      <input type="text" />
      <Loading />
      <li>
        <Link to={RoutesPath.Home}>Go Home</Link>
      </li>
      <button type="button" onClick={internalApiCall}>
        api internal test
      </button>
      <button type="button" onClick={externalApiCall}>
        api external test
      </button>
    </>
  );
};

export default Search;
