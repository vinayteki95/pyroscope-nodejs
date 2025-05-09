import { describe, it, expect } from 'vitest';

import Pyroscope from '../src/index.js';
import request from 'supertest';
import express from 'express';
import koa from 'koa';

// You only need appName for the pull mode
Pyroscope.init();

describe('express middleware', () => {
  it('should be a function', () => {
    expect(typeof Pyroscope.expressMiddleware).toBe('function');
  });
  it('should respond to cpu calls', async () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());
    return request(app)
      .get('/debug/pprof/profile?seconds=1')
      .then((result) => {
        expect(result.statusCode).toBe(200);
      })
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });
  it('should respond to repetitive cpu calls', async () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());
    return request(app)
      .get('/debug/pprof/profile?seconds=1')
      .then((result) => {
        expect(result.statusCode).toBe(200);
      })
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });

  // it('should respond to simultaneous cpu calls', () => {
  //   const app = express()
  //   app.use(Pyroscope.expressMiddleware())
  //   console.log('0', Date.now()/1000);
  //   return Promise.all([
  //     request(app)
  //       .get('/debug/pprof/profile?seconds=1')
  //       .then((result) => {
  //         expect(result.statusCode).toBe(200)
  //       })
  //       .catch((result) => {
  //         expect(result.statusCode).toBe(200)
  //       }),
  //     request(app)
  //       .get('/debug/pprof/profile?seconds=1')
  //       .then((result) => {
  //         expect(result.statusCode).toBe(200)
  //       })
  //       .catch((result) => {
  //         expect(result.statusCode).toBe(200)
  //       }),
  //   ])
  // })
  it('should respond to heap profiling calls', () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());
    return request(app)
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });
  it('should respond to repetitive heap profiling calls', () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());
    return request(app)
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });

  it('should respond to simultaneous heap profiling calls', () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());
    return Promise.all([
      request(app)
        .get('/debug/pprof/heap?seconds=1')
        .then((result) => expect(result.statusCode).toBe(200))
        .catch((result) => {
          expect(result.statusCode).toBe(200);
        }),
      request(app)
        .get('/debug/pprof/heap?seconds=1')
        .then((result) => expect(result.statusCode).toBe(200))
        .catch((result) => {
          expect(result.statusCode).toBe(200);
        }),
    ]);
  });

  it('should be fine using two middlewares at the same time', () => {
    const app = express();
    app.use(Pyroscope.expressMiddleware());

    const app2 = express();
    app2.use(Pyroscope.expressMiddleware());

    request(app)
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });

    request(app2)
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });
});


describe('koa middleware', () => {
  it('should be a function', () => {
    expect(typeof Pyroscope.koaMiddleware).toBe('function');
  });
  it('should respond to cpu calls', async () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());
    return request(app.callback())
      .get('/debug/pprof/profile?seconds=1')
      .then((result) => {
        expect(result.statusCode).toBe(200);
      })
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });
  it('should respond to repetitive cpu calls', async () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());
    return request(app.callback())
      .get('/debug/pprof/profile?seconds=1')
      .then((result) => {
        expect(result.statusCode).toBe(200);
      })
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });

  // it('should respond to simultaneous cpu calls', async () => {
  //   const app = new koa();
  //   app.use(Pyroscope.koaMiddleware());
  //   const callback = app.callback();

  //   const requests = [
  //     request(callback).get('/debug/pprof/profile?seconds=1'),
  //     request(callback).get('/debug/pprof/profile?seconds=1')
  //   ];

  //   const results = await Promise.all(requests);

  //   results.forEach(result => {
  //     expect(result.statusCode).toBe(200);
  //   });
  // });
  it('should respond to heap profiling calls', () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());
    return request(app.callback())
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });
  it('should respond to repetitive heap profiling calls', () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());
    return request(app.callback())
      .get('/debug/pprof/heap')
      .then((result) => expect(result.statusCode).toBe(200))
      .catch((result) => {
        expect(result.statusCode).toBe(200);
      });
  });

  it('should respond to simultaneous heap profiling calls', async () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());
    const callback = app.callback();

    const requests = [
      request(callback).get('/debug/pprof/heap?seconds=1'),
      request(callback).get('/debug/pprof/heap?seconds=1')
    ];

    const results = await Promise.all(requests);

    results.forEach(result => {
      expect(result.statusCode).toBe(200);
    });
  });

  it('should be fine using two middlewares at the same time', async () => {
    const app = new koa();
    app.use(Pyroscope.koaMiddleware());

    const app2 = express();
    app2.use(Pyroscope.expressMiddleware());

    const requests = [
      request(app.callback()).get('/debug/pprof/heap'),
      request(app2).get('/debug/pprof/heap')
    ];

    const results = await Promise.all(requests);

    results.forEach(result => {
      expect(result.statusCode).toBe(200);
    });
  });
});
