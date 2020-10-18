var http = require('http');
var url = require('url');
var fs = require('fs');
var path=require('path');
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  var ext= path.extname(filename);
  var contentType='text/html'; 
    switch (ext) {
    case '.css':
        contentType = 'text/css';
        break;
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;
    case '.jpg':
        contentType = 'image/jpg';
        break;
}
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': contentType});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
    res.write("dasdasda");
    return res.end();
  });
}).listen(8080);