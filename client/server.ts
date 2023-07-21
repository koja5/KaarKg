import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as request from 'request';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './src/main.server';

//additional modules
import 'localstorage-polyfill';
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mock = new MockBrowser();

// api
const api = require('../server/providers/api');

const { createProxyMiddleware } = require('http-proxy-middleware');
const apiProxy = createProxyMiddleware('/api/**', {
  target: 'http://localhost:3001',
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const server = express();
  server.use(apiProxy);
  const distFolder = join(process.cwd(), 'dist/client/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: bootstrap,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  // import different staff
  global['localStorage'] = localStorage;
  global['window'] = mock.getWindow();

  //api implementedget

  // server.use('/api/**', function(req, res) {
  //   req.pipe(request(req.originalUrl)).pipe(res);
  // });

  server.get('/api/**', (req, res) => {
    console.log(req.originalUrl);
    console.log("USAO U DFSAKJJDKASJ!");
    // const url = `${backendUrl}${req.originalUrl}`;
    request(req.originalUrl).pipe(res);
  });

  // server.get('/api/*', (req, res) => {
  //   res.status(404).send('data requests are not supported');
  // });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';