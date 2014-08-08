var querystring = require('querystring'),
    fs = require('fs'),
    formidable = require("formidable");

function start(response, postData) {
  console.log("Request handler 'start' was called.");
  var body = '<html>' + 
    '<head>' + 
    '<meta http-equiv="Content-Type" content="text/html;"' + 
    'charset=UTF-8 />' + 
    '</head>' + 
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="file" name="upload" />' + 
    '<input type="submit" value="上传" />' +
    '</form>' +
    '</body>' +
    '</html>';
    response.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    response.write(body);
    response.end();
}
function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();
  //由于Node.js安装的盘符和写的地方不在一个盘符，跨目录重命名文件导致的问题。可以多些下面一句代码，重设临时上传路径
  form.uploadDir = "./tmp";  
  console.log("about to parse");
  form.parse(request, function(error, fields, files){
    console.log("parsing done");
    fs.renameSync(files.upload.path, "./tmp/test.png");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show'/>");
    response.end();
  });
}

function show(response, postData) {
  console.log("Rqeust Handler 'show' was called");
  fs.readFile("./tmp/test.png", "binary", function(error, file){
    console.log('reading img');
    if (error) {
      response.writeHead(500, {'Content-Type': 'text/plain;charset=UTF-8'});
      response.write(error + "\n");
      response.end();
    }else {
      response.writeHead(200, {'Content-Type': 'image/png;charset=UTF-8'});
      response.write(file, "binary");
      response.end();
    }
  });
}
exports.start = start;
exports.upload = upload;
exports.show = show;