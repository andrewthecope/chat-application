var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Filter = require('bad-words');
    filter = new Filter();


var watson = require('watson-developer-cloud');


//thresholds
var angerThreshold = 0.1;


var ibmCreds = {
  "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
  "password": "nSpbtvaNeK6h",
  "username": "71573fa1-5bf8-44ba-8cb3-f06aaabdd61e"
}

var tone_analyzer = watson.tone_analyzer({
  username: ibmCreds.username,
  password: ibmCreds.password,
  version: 'v3',
  version_date: '2016-05-19'
});
 
// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', function(req, res) {
  
  res.send("This is from the server!");
  res.end("File is uploaded...");
  
});
 
// Register events on socket connection
io.on('connection', function(socket){ 
  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });
  
  socket.on('getTone', function(msg) {
    console.log('index.js getTone')
    tone_analyzer.tone({ text: msg },
      function(err, tone) {
        if (err)
          console.log(err);
        else {
          //tone
          console.log(JSON.stringify(tone, null, 2));
          //console.log(tone);
          if (tone.sentences_tone) {

            console.log('emitting tone.sentences_tone', tone.sentences_tone);
            io.emit('tooAngry', msg, tone.sentences_tone);
          
            
          }
          
          
          //io.emit('getTone', tone);
        }
        
    });
    
  });

  socket.on('BadWords', function(msg) {
      var cleanString = filter.clean(msg);
      console.log(cleanString);
  });
  
  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });
});
 
// Listen application request on port 3000
http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
