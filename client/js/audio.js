var context = null;

var bufferLoader;

function finishedLoading(bufferList) {
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();

  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

/*
  source3.buffer = bufferList[2];
  source4.buffer = bufferList[3];
  source5.buffer = bufferList[4];
*/

  source1.connect(context.destination);
  source1.noteOn(0);

  source2.connect(context.destination);
  source2.noteOn(0);

/*
  source3.connect(context.destination);
  source3.noteOn(0);
  source4.connect(context.destination);
  source4.noteOn(0);
  source5.connect(context.destination);
  source5.noteOn(0);
*/

}
var sampleBuffer = null;

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

function init() {
  try {
    context = new webkitAudioContext();
	bufferLoader = new BufferLoader(
    context,
    [
      '../server/samples/banjo_b1.wav',
      '../server/samples/banjo_d1.wav',
    //  '../server/samples/banjo_d2.wav',
    //  '../server/samples/banjo_g1.wav',
    //  '../server/samples/banjo_g2.wav',
    ],
    finishedLoading
    );

  	bufferLoader.load();

  }
  catch(e) {
    alert('Web Audio API is not supported in this browser.');
  }
}

$(document).ready(function(){
	init();
});