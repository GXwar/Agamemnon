import Agamemnon from './src/Application';

const app = new Agamemnon();
app.context.msg = 'world';
app.use(async (ctx, next) => {
  ctx.res.end('hello' + ctx.msg);
});

app.listen(3000, () => {

});
