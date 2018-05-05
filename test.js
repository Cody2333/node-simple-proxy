const http = require('http');
const simpleProxy = require('./index');
const request = require('supertest');
const mocha = require('mocha');

const options = {
  // 若有多个路由匹配，则选择排列在前的
  target: {
    '/foo/(.*)': 'localhost:8001',
    '/bar/(.*)': 'localhost:8002',
    '/(.*)': 'localhost:8001'
  }
};

const createProxyServer = (port) => new Promise((resolve) => {
  const proxyServer = http.createServer((req, res) => {
    // you can add custom logic here
    simpleProxy(req, res, options);
  });
  proxyServer.listen(port, () => {
    console.log('proxyServer started.');
    resolve(proxyServer);
  });
})

const createExampleServer = (port, text) => new Promise((resolve) => {
  const exampleServer = http.createServer((req, res) => {
    res.end(text);
  });
  exampleServer.listen(port, () => {
    console.log('exampleServer started.');
    resolve(exampleServer);
  });
})

describe('simple proxy test:', function () {
  let proxyServer = null;
  let exampleServers = [];

  before(async() => {
    proxyServer = await createProxyServer(7777);
    exampleServers.push(await createExampleServer(8001, 'hello'));
    exampleServers.push(await createExampleServer(8002, 'world'));
  });

  after(async() => {
    exampleServers.forEach(server => {
      server.close();
    })
    proxyServer.close();
  });

  it('should proxy /foo/(.*) -> localhost:8001', async() => {
    await request(proxyServer)
      .get('/foo/ii')
      .expect(200)
      .expect('hello')
  })
  it('should proxy /bar/(.*) -> localhost:8002', async() => {
    await request(proxyServer)
      .get('/bar/ii')
      .expect(200)
      .expect('world')
  })
  it('should proxy / -> localhost:8001', async() => {
    await request(proxyServer)
      .get('/')
      .expect(200)
      .expect('hello')
  })
})