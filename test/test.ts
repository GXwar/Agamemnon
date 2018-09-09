import Uranus from '../src/application';

let app = new Uranus();

let responseData = {};

app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
    console.log(ctx.request.headers, ctx.request.url, ctx.request.origin, ctx.request.href);
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    responseData.sex = 'male';
});

app.on('error', (err) => {
  console.log(err.stack);
});

app.listen(3000, () => {
    console.log('listening on 3000');
});

