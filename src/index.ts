import uranus from './Application';

const app = new uranus();
app.use(async ctx => {
  console.log(ctx);
  ctx.body = 'hello' + ctx.query.name;
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
