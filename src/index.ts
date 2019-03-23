import uranus from './Application';

const app = new uranus();

let responseData = {} as any;

app.use(async (ctx, next) => {
  responseData.name = 'tom';
  await next();
  ctx.body = responseData;
});

app.use(async (ctx, next) => {
  responseData.age = 16;
  await next();
});

app.use(async ctx => {
  responseData.sex = 'male';
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
