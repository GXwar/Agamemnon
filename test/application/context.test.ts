import assert from 'assert';
import request from 'supertest';

import Agamemnon from '../../src/Application';

describe('app.context', () => {
  const app1 = new Agamemnon();
  app1.context.msg = 'hello';
  const app2 = new Agamemnon();

  afterAll(() => {
    if (app1.server) app1.server.close();
    if (app2.server) app2.server.close();
  });

  it('should merge properties', () => {
    app1.use((ctx, next) => {
      assert(ctx.msg, 'hello');
      ctx.status = 204;
    });

    return request(app1.listen())
      .get('/')
      .expect(204);
  });

  it('should not affect the original prototype', () => {
    app2.use((ctx, next) => {
      assert.equal(ctx.msg, undefined);
      ctx.status = 204;
    });

    return request(app2.listen())
      .get('/')
      .expect(204);
  });
});
