const koa = require('koa');

const app = new koa();

app.use(async ctx => {
  ctx.body = 'hello, world';
  // console.log(ctx);
  console.log(ctx.request);
  // console.log(ctx.response);
  // console.log(ctx.res);
  // console.log(ctx.req);
});

app.listen(3000);
