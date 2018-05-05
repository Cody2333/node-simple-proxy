# Node-Simple-Proxy

A simple implemention of reverse proxy using node
## Installation

```
npm install node-simple-proxy
```

## Usage

```javascript
  const proxyServer = http.createServer((req, res) => {
    // you can add custom logic here
    simpleProxy(req, res, {
      target: {
        // based on path-to-regexp module
        '/foo/(.*)': 'localhost:8001',
        '/bar/(.*)': 'localhost:8002',
        '/(.*)': 'localhost:8001',
      }
    });
  }).listen(8000);

/**
 * curl localhost:8000/foo/i -> localhost:8001/foo/i
 * curl localhost:8000/bar/i -> localhost:8002/bar/i
 * curl localhost:8000/ -> localhost:8001/
 **/
```