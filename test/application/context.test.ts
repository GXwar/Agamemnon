import assert from 'assert';
import request from 'supertest';

import Agamemnon from '../../src/Application';

describe('app.context', () => {
  const app1 = new Agamemnon();
  app1.context.msg = 'hello';
  const app2 = new Agamemnon();

  it('should merge properties', () => {
    app1.use((ctx, next) => {
      assert(ctx.msg, 'hello');
      ctx.status = 204;
    });

    return request(app1.listen())
      .get('/')
      .expect(204);
  });
});
