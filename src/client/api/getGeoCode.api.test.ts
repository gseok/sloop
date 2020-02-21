/* eslint-disable @typescript-eslint/no-var-requires */
import getGeoCodeApi from './getGeoCode.api';
import requestGet from './helpers/requestGet';

jest.mock('./helpers/requestGet');
requestGet.mockImplementation(() => 'success');

describe('[client] getGeoCode api test', () => {
  const phaseList = ['local', 'dev', 'test', 'real'];

  describe('getGeoCodeApi direct call check', () => {
    it(`getGeoCodeApi() called`, async (done) => {
      const data = await getGeoCodeApi();
      expect(data).toBe('success');
      expect(requestGet).toBeCalled();
      done();
    });

    phaseList.forEach((phase) => {
      it(`getSearchApi(${phase}) called`, async (done) => {
        await getGeoCodeApi(phase);
        expect(requestGet).toBeCalled();
        done();
      });
    });
  });
});
