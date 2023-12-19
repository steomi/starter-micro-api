// var http = require('http');
// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('Yo!');
//     res.end();
// }).listen(process.env.PORT || 3000);

var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`);

    // Получить путь к запрошенному файлу
    var filePath = '.' + req.url;
    
    // Если путь оканчивается на '/', добавить 'index.html'
    if (filePath == './') {
        filePath = './index.html';
    }

    // Прочитать файл
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                // Если файл не найден, вернуть ошибку 404
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('404 Not Found');
            }
            else {
                // Если произошла другая ошибка, вернуть ошибку 500
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('500 Internal Server Error: ' + error.code);
            }
        }
        else {
            // Если файл найден, отправить его клиенту
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        }
    });

}).listen(process.env.PORT || 3000);

console.log('Server running at http://localhost:3000/');
