var http = require("http");
var fs = require("fs");
var path = require("path");

http.createServer(function (request, response) {
    console.log("request ", request.url);

    var filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };

    var contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n",
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(3000);
console.log("Server running at http://127.0.0.1:8125/");



// var http = require('http');
// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('Yo!');
//     res.end();
// }).listen(process.env.PORT || 3000);

// var http = require('http');
// var fs = require('fs');
// var path = require('path');

// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`);

//     // Получить путь к запрошенному файлу
//     var filePath = '.' + req.url;
    
//     // Если путь оканчивается на '/', добавить 'index.html'
//     if (filePath == './') {
//         filePath = './index.html';
//     }

//     // Прочитать файл
//     fs.readFile(filePath, function(error, content) {
//         if (error) {
//             if(error.code == 'ENOENT'){
//                 // Если файл не найден, вернуть ошибку 404
//                 res.writeHead(404, {'Content-Type': 'text/html'});
//                 res.end('404 Not Found');
//             }
//             else {
//                 // Если произошла другая ошибка, вернуть ошибку 500
//                 res.writeHead(500, {'Content-Type': 'text/html'});
//                 res.end('500 Internal Server Error: ' + error.code);
//             }
//         }
//         else {
//             // Если файл найден, отправить его клиенту
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.end(content);
//         }
//     });

// }).listen(process.env.PORT || 3000);

// console.log('Server running at http://localhost:3000/');
