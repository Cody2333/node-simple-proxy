const http = require('http');
const pathToRegexp = require('path-to-regexp');

module.exports = (req, res, options) => {
  const {
    target,
    protocol = 'http:'
  } = options;
  const urls = Object
    .keys(target)
    .filter(pattern => req.url.match(pathToRegexp(pattern)))
  if (urls.length === 0) 
    return;
  const [hostname,
    port = '80'] = target[urls[0]].split(":");
  const reqOptions = {
    protocol,
    hostname,
    port,
    path: req.url,
    headers: req.headers
  }
  const id = `${req.method} ${req.url} => ${hostname}:${port}`;
  const req2 = http.request(reqOptions, res2 => {
    console.log("[%s] 响应: %s", id, res2.statusCode);
    res.writeHead(res2.statusCode, res2.headers);
    res2.pipe(res);
  });
  req.pipe(req2);
}