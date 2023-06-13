class Blob extends Doodle{
    constructor() {
        super();
    }

    create_point(){
        let val = map(random(1), 0, 1, -1, 1);
        return createVector(random(width) + val*this.difference, random(height) + val*this.difference)
    }

    pre_processing(){       
        

        return this;
    }

    draw(){
        // const col_points = color('rgba(0, 187, 205, 0.8)');
        // stroke(col_points);
        // frameRate(5);
        return this;
    }

    animate(){
        clear();
        let length = 400;
        let randomvalues = []


        let scale = 0.05
        let zscale = 0.05

        for(let i = 0; i < sqrt(length); i++){
            randomvalues.push(noise(0 * scale, i * scale, millis() * scale * zscale))
            // console.log(0, i)
        }

        for(let i = 1; i < sqrt(length)-1; i++){
            randomvalues.push(noise(i * scale, sqrt(length)-1 * scale, millis() * scale* zscale))
            // console.log(i, sqrt(length)-1)
        }

        for(let i = sqrt(length)-1; i > 0; i--){
            randomvalues.push(noise(sqrt(length)-1 * scale, i * scale, millis() * scale* zscale))
            // console.log(sqrt(length)-1, i)
        }

        for(let i = sqrt(length)-1; i > -1; i--){
            randomvalues.push(noise(i * scale, 0 * scale, millis() * scale * zscale))
            // console.log(i, 0)
        }

        // console.log(randomvalues);

        let subdiv = TWO_PI / randomvalues.length;
        let radius = 200;

        strokeWeight(5)
        stroke(0);

        push();
            translate(width / 2, height / 2)

            let rad = 0;

            beginShape();
            fill(0, noise(millis() * 0.001) * 110, noise(millis() * 0.001) * 160)
                for(let j = 0; j < randomvalues.length + 1; j++){
                    rad += subdiv;
                    let x = radius * randomvalues[j % randomvalues.length] * cos(rad);
                    let y = radius * randomvalues[j % randomvalues.length] * sin(rad);
                    // let rnd = noise(x * scale, y * scale, millis() * scale * zscale)
                    // x *= rnd
                    // y *= rnd
                    vertex(x, y);
                    // console.log(j, x, y)
                }
            endShape();
        pop();


        // noLoop();
        return this;
    }

    static getName(){
        return "blob"
    }
 }

let doodle = null;

function preprocesDoodle(){
    doodle = new Blob();
    doodle.pre_processing()
}

function drawDoodle(){
    doodle.draw();
}

function animateDoodle(){
    doodle.animate();
}


function mousePressedDoodle(){
    if(doodle.hasMousePressed()){
        doodle.mousePressed();
    }
}


function mouseMovedDoodle(){
    if(doodle.hasMouseMoved()){
        doodle.mouseMoved();
    }
}