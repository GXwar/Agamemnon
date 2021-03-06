# Agamemnon
![Build Status](https://travis-ci.org/GXwar/Agamemnon.svg?branch=master)
![Node Version](https://img.shields.io/badge/npm-%3E%3D7.6.0-blue.svg)

**This project is inspired by [koa.js](<https://github.com/koajs/koa>), and it can just be used for study purpose, not for business.**

Agamemnon is an expressive HTTP middleware framework for node.js to make web applications and APIs more enjoyable to write. Agamemnon's middleware stack flows in a stack-like manner, allowing you to perform actions downstream then filter and manipulate the response upstream.

Agamemnon is not bundled with any middleware.

## Installation

Agamemnon requires **node v7.6.0** or higher for ES2015 and async function support.

```
$ npm install agamenon
```

## Say Hello to Agamemnon

```typescript
import agamenon from 'agamenon';
const app = new agamenon();

// response
app.use(async ctx => {
  ctx.body = 'Hello Agamemnon';
});

app.listen(3000);
```

## Middleware

Agamemnon is a middleware framework that can take two different kinds of functions as middleware:

* async function
* Common function

### *async* functions (node v7.6+)

```
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### Common function

```
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
```