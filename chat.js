
var socket = io(); 
function submitfunction(){
  var from = $('#user').val();
  var message = $('#m').val();
  getTone(message);
  getWords(message);
  if(message != '') {
  socket.emit('chatMessage', from, message);
}
$('#m').val('').focus();
  return false;
}
 
function notifyTyping() { 
  var user = $('#user').val();
  socket.emit('notifyUser', user);
}

function getTone(message) {
  console.log("run tone");
  socket.emit('getTone', message);
}

function getWords(message)
{
    console.log("run words")
    socket.emit('BadWords', message);
    
}
 
socket.on('chatMessage', function(from, msg){
  var me = $('#user').val();
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
 
socket.on('notifyUser', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#notifyUser').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
});

socket.on('tooAngry', function(msg, sentences) {
 

  //console.log(tone);
 

var angryReplacements = [
  "I don't understand",
  "I don't agree."

];
    console.log(sentences);
    var subtext= "<p>";
    for (var i = 0; i < sentences.length; i++) {
      if (sentences[i].tone_categories[0].tones[0].score > 0.1){
        subtext += '<span class= "angry">' + sentences[i].text + '</span>';
      }
      else{
        subtext += '<span class= "normal">' + sentences[i].text + '</span>';
      }
    }
    subtext+="</p>";

      console.log(subtext);
      $("#modal-body").append(subtext);

      var headerText = document.getElementById('Header_Text');
      var modalText = document.getElementById('Quote');
      var modal = document.getElementById('myModal');

      modal.style.display = "block";

      headerText.textContent = "Your message was not very nice";

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
          modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
});
 
$(document).ready(function(){
  var name = makeid();
  $('#user').val(name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
});
 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
