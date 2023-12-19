import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

const PORT = 8000;

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises
        .access(filePath)
        .then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found
        ? filePath
        : STATIC_PATH + '/404.html';
    const ext = path
        .extname(streamPath)
        .substring(1)
        .toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

http.createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType =
        MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);


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
