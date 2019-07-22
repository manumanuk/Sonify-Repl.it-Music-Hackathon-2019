window.onload = function loadPicture() {
  /*var picSource = window.localStorage.getItem("picLocation");
  var x = document.createElement("IMG");
  x.setAttribute("src", picSource);
  x.setAttribute("left", "50%");
  x.setAttribute("width", "50%");
  document.body.appendChild(x);*/
  
  img.src = window.localStorage.getItem("picLocation");
}
var imagePixels = [];
var pixelsTaken = [];
var img = new Image();
img.crossOrigin = "Anonymous";
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function() {
  canvas.width = img.width;
  canvas.height=img.height;
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var cursorDirection = window.localStorage.getItem("analysisDirection");
  if (cursorDirection=="left") {
    document.getElementById("div2").removeChild(document.getElementById("cursor-top"));
    document.getElementById("cursor-left").style.left = canvas.offsetLeft-10 + "px";
  } else {
    document.getElementById("div1").removeChild(document.getElementById("cursor-left"));
    document.getElementById("cursor-top").style.top=canvas.offsetTop-5+"px";
    document.getElementById("cursor-top").style.left=canvas.offsetLeft-10+"px";
  }
};

function collectPixelsLeftToRight(){
  imagePixels = [];
  //console.log(canvas.width);
  //console.log(canvas.height);
  var increment = 0;
  if (canvas.width>canvas.height) {
    increment = Math.ceil(canvas.width/160);
  } else {
    increment = Math.ceil(canvas.height/160);
  }

  //var increment=25; //ratio is 160 for ~10 second calculation time
  var yVal=0;
  for (xVal=0; xVal<canvas.width; xVal+=Math.abs(increment)) {
    while (true) {
      if (yVal>canvas.height) {
        yVal=0;
        break;
      } else {
          var pixel=ctx.getImageData(xVal, yVal, 1, 1).data;
          pixelsTaken.push([xVal, yVal]);
          imagePixels.push(pixel);
          //console.log(xVal + ", " + yVal);
          yVal+=increment;
      }
    }
  }
  playMusic(Math.abs(increment), 'left');
}

function collectPixelsTopToBottom(){
  imagePixels = [];
  console.log(canvas.width);
  console.log(canvas.height);
  var increment = 0;
  if (canvas.width>canvas.height) {
    increment = Math.ceil(canvas.width/160);
  } else {
    increment = canvas.height/160;
  }

  //var increment=25; //ratio is 160 for ~10 second calculation time
  var xVal=0;
  for (yVal=0; yVal<canvas.height; yVal+=Math.abs(increment)) {
    while (true) {
      if (xVal>canvas.width) {
        xVal=0;
        break;
      } else {
          var pixel=ctx.getImageData(xVal, yVal, 1, 1).data;
          imagePixels.push(pixel);
          xVal+=increment;
      }
    }
  }
  playMusic(Math.abs(increment), 'top');
}

function playMusic(incrementValue, analysisDirection) {
  var pixel = 0;
  var playtime = 500;
  var numOfLoops = 0;
  var canvasSide = canvas.width;
  if (analysisDirection=="left") {
    canvasSide=canvas.height;
  } else {
    canvasSide=canvas.width;
  }
  function playLoop() {
    setTimeout (
      function() {
        for (i=0; i<canvasSide/incrementValue; i++) {
          var redIntensity = imagePixels[pixel][0];
          var blueIntensity = imagePixels[pixel][1];
          var greenIntensity = imagePixels[pixel][2];
          var volume = redIntensity + blueIntensity + greenIntensity/(255*3);
        
          if (redIntensity>30)
            playNote(redIntensity*4, playtime, "sine", volume);
          if (blueIntensity>30)
            playNote(blueIntensity*4, playtime, "sine", volume);
          if (greenIntensity>30)
            playNote(greenIntensity*4, playtime, "sine", volume);
          pixel++;
        }
        if (pixel<imagePixels.length) {
          playLoop();
          if (analysisDirection == 'left') {
            document.getElementById("cursor-left").style.left = canvas.offsetLeft-10+incrementValue*numOfLoops + "px";
          } else {
            document.getElementById('cursor-top').style.top = (canvas.offsetTop+(incrementValue*numOfLoops))-5+"px";
          }
          numOfLoops++;
        }
      }, playtime);
  }
  playLoop();
}

//SOUNDS
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration, type, amplitude) {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator();
  var gain = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency; // value in hertz
  gain.gain.value = 0.1;
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();

  setTimeout(
    function() {
      oscillator.stop();
    }, duration);
}
function collectPixels() {
  var pixelDirection = window.localStorage.getItem("analysisDirection");
  if (pixelDirection == "left") {
    collectPixelsLeftToRight();
  } else {
    collectPixelsTopToBottom();
  }
}