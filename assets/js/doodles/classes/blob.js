class Blob extends Doodle{
    constructor() {
        super();
        this.xphase = 0;
        this.yphase = 0;
    }

    create_point(){
        let val = map(random(1), 0, 1, -1, 1);
        return createVector(random(width) + val*this.difference, random(height) + val*this.difference)
    }

    pre_processing(){       

        return this;
    }

    draw(){
        // blendMode(SOFT_LIGHT);
        blendMode(DODGE);
        // blendMode(SUBTRACT);
        // const col_points = color('rgba(0, 187, 205, 0.8)');
        // stroke(col_points);
        // frameRate(5);
        return this;
    }

    blob(transx, transy, radius, color, bloboffset){
        let noiseMax = 2;
        let scale = 0.001;

        let subdivCount = 1000;

        let subdiv = TWO_PI / subdivCount;

        strokeWeight(0)
        stroke(0);

        push();
            translate(transx, transy)

            beginShape();
            // fill(0, noise(millis() * 0.001) * color, noise(millis() * 0.001) * 160, 120)

            fill(color.red, color.green, color.blue, color.alpha)

            for(let a = 0, i = 0; a < TWO_PI; a+= subdiv, i++){
                let xoff = map(cos(a + this.xphase + bloboffset), -1, 1, 0, noiseMax)
                let yoff = map(sin(a + this.yphase + bloboffset), -1, 1, 0, noiseMax)

                let r = map(noise(xoff, yoff, millis() * scale), 0, 1, radius, radius * 2)

                let x = r * cos(a);
                let y = r * sin(a);

                if(i % 50 == 0){
                    ellipse(x, y, 7, 7)
                }

                vertex(x, y);
            }
            endShape(CLOSE);
        pop();


        this.xphase += PI/2000;
        this.yphase += PI/1000;
    }

    animate(){
        clear();
        let blobOff = map(noise(frameCount) * 0.01, 0, 1, 35, 50)
        
        color = {
            red: 0, 
            green: map(noise(millis() * 0.001), 0, 1, 180, 220),
            blue: map(noise(millis() * 0.001), 0, 1, 60, 170),
            alpha: 120
        }
        this.blob(width / 2 -  width / blobOff, height / 2, 100, color, 0.2);

        color = {
            red: 0, 
            green: map(noise(millis() * 0.001), 0, 1, 50, 100),
            blue: map(noise(millis() * 0.001), 0, 1, 100, 160),
            alpha: 120
        }
        this.blob(width / 2, height / 2, 100, color, 0);

        color = {
            red: 0, 
            green: map(noise(millis() * 0.001), 0, 1, 0, 50),
            blue: map(noise(millis() * 0.001), 0, 1, 30, 160),
            alpha: 120
        }
        this.blob(width / 2, height / 2 + height / blobOff, 100, color, 1);


        color = {
            red: map(noise(millis() * 0.001), 0, 1, 50, 160), 
            green: map(noise(millis() * 0.001), 0, 1, 0, 20),
            blue: map(noise(millis() * 0.001), 0, 1, 0, 30),
            alpha: 120
        }
        this.blob(width / 2 - width / blobOff - 20, height / 2 + height / blobOff + 20, 100, color, 0.5);

        return this;
    }

    static getName(){
        return "blobs"
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