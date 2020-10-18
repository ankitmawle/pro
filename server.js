var http = require('http');
var u= require('url');
var request= require('request');
var port = process.env.PORT || 1337;
var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;

var path=require('path');
var fs=require('fs');
http.createServer(function (req, res) {
    if(req.url=='/'){
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            
            return res.end();
            
         }); 
    }
    else if(req.url=='/loc'){
        fs.readFile('loc.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
         });
    }
    else if(u.parse(req.url,true).pathname=="/locid.php"){
        MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
               
                dbo.collection("ploc").find({location:u.parse(req.url,true).query.q.toLowerCase},{projection: { _id: 0,id:1 }}).toArray(function(err, result) {
                  if (err) throw err;
                  res.write(result[0]["id"].toString());
                  //console.log(result[0]["id"]);
                  db.close();
                  res.end();
                });
            });
    }
    else if(req.url=="/loc.php"){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var op='<input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">';
            dbo.collection("ploc").find({},{projection: { _id: 0,id:1,location:1 }}).toArray(function(err, result) {
              if (err) throw err;
              for (a of result){
                 op+='<a onclick="sss(\''+a.location+'\')">'+a.location+'</a>';  
              } 
              res.write(op);
              console.log(result);
              db.close();
              res.end();
            });
        });
    }
    else if(u.parse(req.url,true).pathname=="/shops.php"){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            op='';
            dbo.collection("pharmacy").find({},{projection: { _id: 0,lid:0 }}).toArray(function(err, result) {
              if (err) throw err;
              for (a of result){
                 op+=a.shopid+","+a.name+","+a.type+";";  
              } 
              res.write(op);
              console.log(result);
              db.close();
              res.end();
            });
        });
    }
    else if(u.parse(req.url,true).pathname=="/display"){
        fs.readFile('display.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.write("<div id='pid'>"+u.parse(req.url,true).query.s+"."+u.parse(req.url,true).query.p+"</div>");
            return res.end();
         });

    }
    else if(u.parse(req.url,true).pathname=="/d"){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            op='';
            console.log(u.parse(req.url,true).query.q);
            dbo.collection("products").find({shopid: parseInt(u.parse(req.url,true).query.s),pid:parseInt(u.parse(req.url,true).query.p )},{projection: { _id: 0}}).toArray(function(err, result) {
              if (err) throw err;
              
              res.write(JSON.stringify(result));
              console.log(result);
              db.close();
              res.end();
            });
        });
    
    }
    else if(u.parse(req.url,true).pathname=="/shop"){
        fs.readFile('shop.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.write("<div id='shopid'>"+u.parse(req.url,true).query.id+"</div>");
            return res.end();
         });


    }
    else if(u.parse(req.url,true).pathname=="/pid"){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            op='';
            console.log(u.parse(req.url,true).query.q);
            dbo.collection("products").find({shopid: parseInt(u.parse(req.url,true).query.q)},{projection: { _id: 0}}).toArray(function(err, result) {
              if (err) throw err;
              for (a of result){
              op+='<div class="s-12 m-6 l-3 margin-bottom background-white" ><div onclick="pp('+a.shopid+','+a.pid+')" class="s-12 m-6 l-2 margin-bottom" style="padding:2%" ><a id="'+a.shopid+'.'+a.pid+'"><img alt="image" style="padding:5%; " src="data:image/jpeg;base64,'+a.img+'"></a><h4 class="background-primary padding text-strong" style="text-align:center">'+a.name+'</h4> <p class="margin-bottom-10 text-blue text-strong text-uppercase" style="text-align:center"><b>Click here to buy</b></p></div></div>';  
              } 
              res.write(op);
              console.log(result);
              db.close();
              res.end();
            });
        });

    }

    else if(req.url=="/cart"){
        fs.readFile('cart.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
         });

    }

    else if(u.parse(req.url,true).pathname=="/place"){
        var kll= new Date();
        var klm="oid="+kll.getTime().toString()+";";
        klm+="name=";
        klm+=u.parse(req.url,true).query.firstname +";";
        klm+="email="; 
        
         klm+=u.parse(req.url,true).query.email +";";
         klm+="adr="; 
        

         klm+=u.parse(req.url,true).query.adr +";";
          
        
         klm+=u.parse(req.url,true).query.data +";";

        request('https://api.telegram.org/bot1178326435:AAGWlB7pkuUMys02YEzky2DmUl8tYniNrh0/sendMessage?chat_id=-463219871&text='+klm);
        res.write('<html><body onload="kk()"><script>function kk(){ var cookies = document.cookie.split(";");for (var i = 0; i < cookies.length; i++) {var cookie = cookies[i];var eqPos = cookie.indexOf("=");var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie; document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";}window.alert("Order Palced"); window.location="index.html"}</script></body></html>'); 
        res.end();
    }


    else{  
        var q = u.parse(req.url, true);
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
          return res.end();
        });
    }

}).listen(8090);