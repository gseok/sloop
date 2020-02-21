import getSearchApi from './getSearch.api';

describe('[client] getSearch api test', () => {
  const phaseList = ['local', 'dev', 'test', 'real'];

  describe('getSearchApi direct call check', () => {
    it(`getSearchApi() called`, async (done) => {
      const result = await getSearchApi();
      expect(result).toBeUndefined();
      done();
    });

    phaseList.forEach((phase) => {
      it(`getSearchApi(${phase}) called`, async (done) => {
        const result = await getSearchApi(phase);
        expect(result).toBe(`http://external/search/${phase}`);
        done();
      });
    });
  });
});
