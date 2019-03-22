import supertest, { SuperTest, Test } from 'supertest';

import server from '../src/index';

describe('app', () => {
  let request: SuperTest<Test>;
  beforeEach(() => {
    request = supertest(server);
  });
  it('should return a successful response for GET /', done => {
    request.get('/')
      .expect(200, done);
  });
});
