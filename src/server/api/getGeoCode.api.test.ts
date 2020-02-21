/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import config from './configs/apiPathConfig';
import app from '../app';
import getGeoCodeApi from './getGeoCode.api';

describe('[server] getGeoCode api test', () => {
  const phaseList = ['local', 'dev', 'test', 'real'];
  let server: import('http').Server;
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    server = app.listen(3131);
    request = supertest(server);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it('URL config of geocode api check', () => {
    expect(config.geocode).toBeDefined();
  });

  it('URL definition check', () => {
    phaseList.forEach((phase) => {
      expect(config.geocode[phase]).toBe(`http://geocode/${phase}/`);
    });
  });

  describe('getGeoCodeApi direct call check', () => {
    it(`getGeoCodeApi() called`, async (done) => {
      const result = await getGeoCodeApi();
      expect(result).toBeUndefined();
      done();
    });

    phaseList.forEach((phase) => {
      it(`getGeoCodeApi(${phase}) called`, async (done) => {
        const result = await getGeoCodeApi(phase);
        expect(result).toBe(`http://geocode/${phase}/`);
        done();
      });
    });
  });

  describe('getGeoCodeApi ajax call check', () => {
    it(`getGeoCodeApi call by /api/geocode`, async (done) => {
      const response = await request.get(`/api/geocode`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.res).toBeUndefined();
      done();
    });

    phaseList.forEach((phase) => {
      it(`getGeoCodeApi call by /api/geocode?phase=${phase}`, async (done) => {
        const response = await request.get(`/api/geocode?phase=${phase}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.res).toBe(`http://geocode/${phase}/`);
        done();
      });
    });
  });
});
