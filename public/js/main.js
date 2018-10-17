
var fields = ["speed", "spacing", "size", "angle", "colorScale", "rotation"];

function queryString(param) {
    var hash = window.location.hash.substring(1);
    var params = hash.split("&");
    for (var i=0;i<params.length;i++) {
        var p = params[i].split("=");
        if (p[0] == param) {
            return p[1];
        }
    }
}

function updateCreations(data){
  $('#savedCreations').html('');
  var template = $('#saved-creation-template').html();
  for(var i=0; i<data.length; i++) {
    var query = $.param(data[i].query);
    var ts = Date.parse(new Date(data[i].timestamp).toUTCString());
    var item = $(template).clone();
    $(item).find('.text').html(query);
    $(item).find('.link').attr('href', '#'+query);
    $(item).find('.timestamp').html(ts.toString('h:mm:ss'));
    $('#savedCreations').append(item);
  }
  
  if( data.length > 0 ) {
    $("#deleteCreations").show();
  } else {
    $("#deleteCreations").hide();
  }

}


function saveCreation() {
  var item = {};
  for(var i=0; i<fields.length; i++) {
    item[fields[i]] = document.getElementById(fields[i]).value;
  }
  $.post('/create', item, function(data){
    updateCreations(data);
  });
}

function deleteCreations() {
  console.log('deleting creations...');
  $.post('/clear', function(data){
    updateCreations(data);
  });
}

function getCreations() {
  console.log('getting creations...');
  $.get('/creations', function(data){
    updateCreations(data);
  });
}

function updateFields() {
  for(var i=0; i<fields.length; i++) {
    document.getElementById(fields[i]).value = queryString(fields[i]);
  }
  myp5.resetViz();
}

function randomPatterns() {
  for(var i=0; i<fields.length; i++) {
    randomize(fields[i]);
  }
  if(myp5) {
    myp5.resetViz();
  }
}

function randomize(property) {
  var minVal = parseInt(document.getElementById(property).min);
  var maxVal = parseInt(document.getElementById(property).max);
  var randVal = (Math.random() * (minVal - maxVal) + maxVal).toFixed(4)
  document.getElementById(property).value = randVal;
}

var myp5;
$(document).ready(function(){
  for(var i=0; i<fields.length; i++) {
    var fieldValue = queryString(fields[i]);
    $('#'+fields[i]).val(fieldValue);
  }
  myp5 = new p5(phyllotaxis);
  
  $(document).keydown(function(e) {
    if(e.keyCode !=e.metaKey) {
      e.preventDefault();
      randomPatterns();
    }
    
  });
});

function tweetPattern() {
  var url = encodeURIComponent(window.location.href);
  window.open('https://twitter.com/intent/tweet?url='+url+'&via=patternschool&text=check out out my phyllotaxy 🌻');
}

function exportGif() {
  console.log('rendering gif');
  myp5.renderGif();
}