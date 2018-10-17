var phyllotaxis = function(p) {
  var n = 0;
  var start = 0;
  var reverseIt = false;
  var c;
  var gifFrames;
  var numFrames=0;
  var doneBuildingGif = false;
  
  p.setup = function() {
    var container = p.select('#viz');
    var canvas = p.createCanvas(container.height,container.width);
    canvas.parent('viz'); 

    p.angleMode(p.DEGREES);
    p.colorMode(p.HSB, 360,100,100);
    p.background(0,0,0);  
    if(window.location.hash==='') {
      document.getElementById('speed').value = 1;
      document.getElementById('spacing').value = 8;
      document.getElementById('size').value = 10;
      document.getElementById('angle').value = 137.5;
      document.getElementById('colorScale').value = 1.1;
      document.getElementById('rotation').value = 0;
    }
    p.windowResized();
  };

  p.windowResized = function() {
    var container = p.select('#viz');
    p.resizeCanvas(container.width, container.height);
    //p.size(window.innerWidth, window.innerHeight);
    $('#viz').attr('style', 'max-height:'+container.height+'px; max-width:'+container.width+'px');
  }
  
  p.renderGif = function() {
    console.log('rendering phyllotaxis gif');
    gifFrames.on('finished', function(blob) {
      console.log('finished!', blob);
      window.open(URL.createObjectURL(blob));
    });
    console.log(gifFrames);
    gifFrames.render();
    
  }


  p.draw = function() {
     p.background(0,0,0);
    var speed = p.select('#speed').value();
    var c = p.select('#spacing').value();
    var scl = p.select('#size').value();
    var angle = p.select('#angle').value();
    var clr = document.getElementById('colorScale').value;
    var rotation = p.select('#rotation').value();

    window.location.hash = '#speed=' + speed 
              + '&spacing=' + c
              + '&size=' + scl
              + '&angle=' + angle
              + '&colorScale=' + clr
              + '&rotation=' + rotation
              + '&type=phyllotaxy';
    
    
    

    p.translate(p.width/2, p.height/2);
    p.rotate(n*rotation);
    p.noStroke();
    for(var i=0; i<n; i++) {
      var a = i * angle;
      var r = c * p.sqrt(i);
      var x = r * p.cos(a);
      var y = r * p.sin(a);
      var Rhu = p.sin(start+i*clr);
      var Ghu = n%256;//p.cos(start+i*clr);
      var Bhu = (a-r)%256;//p.tan(start+i*clr);
      Rhu = p.map(Rhu,-1,1,0,255);
      
      var hu = p.sin((angle * 180 / Math.PI - r)*clr%360);
      hu = p.map(hu,-1,1,0,360);
      p.fill(hu,100,100);
      p.ellipse(x,y,scl,scl);
  
      if( p.dist(x, y, 0, -p.height/2) <= 30 ) {
        reverseIt = true;
        // console.log(p);
        //console.log(numFrames, gifFrames);
        //numFrames = 0;
        doneBuildingGif = true;
      } else {
        
      }
    }
    
    if(reverseIt) {
      n-=speed;
      start-=1;
    } else {
      n+=speed;
      start+=1;
    }

    if(n<10) {
      reverseIt=false;
    }


  }
  
  p.resetViz = function() {
    p.background(0,0,0);
    n=0;
    reverseIt = false;
  }
  
};
