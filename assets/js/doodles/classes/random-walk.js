class RandomWalk extends Doodle{
    constructor() {
        super();

        this.points = [];
        this.x = 0;

        this.to_add = 15;
        
        this.end = 3 * width / 4;
    }


    pre_processing(){
        return this;
    }

    animate(){
        // background(255);
        let color = 100;

        clear();
        stroke(color);
        strokeWeight(2);

        let scale = 0.01;

        let x_to_remove = 0;

        if(this.x > this.end){
            x_to_remove = this.points[this.to_add].x;
            this.points = this.points.splice(this.to_add);
        }

        // console.log(this.points)

        for (let i = 1; i < this.points.length; i++) {
            // let h = map(i, 0, this.points.length, 0, 100)
            // fill(130, 130, 130, h);    
            line(this.points[i].x - x_to_remove, this.points[i].y, this.points[i - 1].x - x_to_remove, this.points[i - 1].y);
        }

        let n = this.points.length - 1;

        if(n > 1){
            fill(color);
            circle(this.points[n].x - x_to_remove, this.points[n].y, 8)
        }

        for(let i=0; i < this.to_add; i++){
            let x = this.x;
            let rnd_number = noise(this.x * scale);
            let y = map(rnd_number, 0, 1, height/4, 3*height/4);
            this.points.push(createVector(x, y))

            this.x += 0.08;
        }

        return this;
    }

    draw(){
        return this;
    }


    static getName(){
        return "smooth-curve"
    }
}


let doodle = null;

function preprocesDoodle(){
    doodle = new RandomWalk();
    doodle.pre_processing();
}

function drawDoodle(){
    background(0);
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