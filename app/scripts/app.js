var multiplier = 3.0;
var modulus = 2;
var base = 50;
var radius = 20;
var circlePoints = [];
var computedLines = [];
var displayedLines = [];
var scene;

var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function (callback) {
  scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", 6 * Math.PI / 2, 0, 50, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, false);
  if(callback) callback();
};

var createCirclePoints = function(callback){
  var result = [];
  var slice = 2 * Math.PI / base;
  for(var i = 0; i < base; i++){
    var angle = slice * i;
    result.push(new BABYLON.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
  }
  result.push(result[0]);
  circlePoints = result;
  if(callback) callback();
};

var createMultipliedPoints = function(callback){
  for(var i = 1; i < base; i++) {
    computedLines.push([
      circlePoints[i],
      circlePoints[(i*multiplier) % base]
    ])
  }
  if(callback) callback();
};

var drawElements = function(callback){
  displayedLines.push(BABYLON.Mesh.CreateLines("lines", circlePoints, scene));
  computedLines.forEach(function(line){
    displayedLines.push(BABYLON.Mesh.CreateLines("lines", line, scene));
  });
  if(callback) callback();
};

createScene(function(){
  createCirclePoints(function(){
    createMultipliedPoints(function(){
      drawElements(function(){
        engine.runRenderLoop(function () {
          scene.render();
        });
      });
    });
  });
});

var slider = new Slider('#ex1', {
  formatter: function(value) {
    base = value;
    displayedLines.forEach(function(line){
      line.dispose();
    });
    computedLines = [];
    createCirclePoints(function() {
      createMultipliedPoints(drawElements);
    });
  }
});

var slider = new Slider('#ex2', {
  formatter: function(value) {
    multiplier = value;
    displayedLines.forEach(function(line){
      line.dispose();
    });
    computedLines = [];
    createCirclePoints(function() {
      createMultipliedPoints(drawElements);
    });
  }
});

