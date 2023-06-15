let screen;
let glitchShader;

function preload() {
  glitchShader = loadShader('/assets/js/doodles/classes/shaders/shader.vert', '/assets/js/doodles/classes/shaders/shader.frag');
  console.log(glitchShader);
}


function getCorrectContainer(){
    let firstTry = 'specific-doodle-container'; // inside the doodle detailed view
    let element = document.getElementById(firstTry);

    if(element !== null){
        return {
            type: 1,
            container_name: firstTry,
            element: element
        };
    }

    let secondTry = 'doodle-container'; // inside the doodle detailed view
    element = document.getElementById(secondTry);

    return {
        type: 2,
        container_name: secondTry,
        element: element
    };
}


// Your p5.js code goes here
function setup() {
    let obj = getCorrectContainer();

    let container_name = obj.container_name;
    let element = obj.element;
    let type = obj.type;

    let containerWidth = element.offsetWidth;
    let containerHeight = element.offsetHeight;

    width = containerWidth;
    height = containerHeight;

    let canvas = createCanvas(width, height, WEBGL);
    canvas.parent(container_name);

    screen = createGraphics(width, height);

    screen.background(50);
    screen.stroke(255);
    screen.strokeWeight(10);

    shader(glitchShader);
}



function draw() {
  if(mouseIsPressed) {
    screen.line(mouseX, mouseY, pmouseX, pmouseY);
  }
  
  drawScreen();
}


function drawScreen() {
  glitchShader.setUniform('texture', screen);
  glitchShader.setUniform('noise', getNoiseValue());
  
  rect(-width/2, -height/2, width, height);
}

function getNoiseValue() { 
  let v = noise(millis()/100);
  const cutOff = 0.5;
  
  if(v < cutOff) {
    return 0;
  }
  
  v = pow((v-cutOff) * 1/(1-cutOff), 2);
  
  return v;
}
