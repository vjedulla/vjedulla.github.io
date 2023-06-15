
/**
 * Abstract Class Doodle.
 *
 * @class Doodle
 */
class Doodle {
    // constructor(p5inst) {
    //     if (this.constructor == DoodleObject) {
    //         throw new Error("Abstract classes can't be instantiated.");
    //     }

    //     this.p = p5inst;
    // }

    preprocessing() {
        throw new Error("Method 'preprocessing()' must be implemented.");
    }

    draw(){
        throw new Error("Method 'draw()' must be implemented.");
    }

    animate(){
        // nothing by default
        noLoop();
    }

    hasMousePressed(){
        return false;
    }

    mousePressed(){
        return false;
    }

    hasMouseMoved(){
        return false;
    }

    mouseMoved(){
        return false;
    }

    static getName(){
        return "";
    }
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

    let canvas = createCanvas(width, height);
    canvas.parent(container_name);

    
    if (typeof preprocesDoodle === 'function') {
        // The function exists in the current scope
        // Your code here
        preprocesDoodle();
    }

    if (type === 1 && typeof drawDoodle === 'function') {
        // The function exists in the current scope
        // Your code here
        drawDoodle();
    }

}

function draw() {
    if (typeof animateDoodle === 'function') {
        // The function exists in the current scope
        // Your code here
        animateDoodle();
    } else {
        // The function does not exist in the current scope
        // Your code here
        noLoop()
    }
}

function mousePressed(){
    if (typeof mousePressedDoodle === 'function') {
        // The function exists in the current scope
        // Your code here
        mousePressedDoodle();
    }
}

function mouseMovedDoodle(){
    if (typeof mouseMovedDoodle === 'function') {
        // The function exists in the current scope
        // Your code here
        mouseMovedDoodle();
    }
}