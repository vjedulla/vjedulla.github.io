class FlowField extends Doodle{
    constructor() {
        super();
        this.current_z = 0;
        this.difference = utils.randomNumber(20, 200);
        this.num_particles = utils.randomNumber(1000, 15000);
        this.speed_factor = utils.randomNumber(1, 4);
        this.is_playing = true;
    }

    create_point(){
        let val = map(random(1), 0, 1, -1, 1);
        return createVector(random(width) + val*this.difference, random(height) + val*this.difference)
    }

    pre_processing(){
        const points = [];

        for(let i=0; i < this.num_particles; i++){
            points.push(
                this.create_point()
            )
        }

        this.points = points;
        return this;
    }

    draw(){
        background(0);
        const col_points = color('rgba(0, 187, 205, 0.8)');
        stroke(col_points);
        return this;
    }

    animate(){
        background(0, 2);
        // this.current_z = (millis() * 0.05) % 10000;
        let scale = 0.0055;

        for (let i = 0; i < this.points.length; i++) {
            let current_point = this.points[i];

            point(current_point.x, current_point.y);

            let n = noise(current_point.x * scale, current_point.y * scale, this.current_z * scale*10);
            n = map(n, 0, 1, -1, 1);
            let angle = 2*PI * n;

            // let power_factor = parseInt(map(this.current_z, 0, 1, 1, 100) / 10);
            // point.x += Math.pow(Math.cos(angle), power_factor);
            // point.y += Math.pow(Math.sin(angle), power_factor);
            current_point.x += Math.cos(angle) / this.speed_factor;
            current_point.y += Math.sin(angle) / this.speed_factor;

            if(! this.on_canvas(current_point, true)){
                let new_point = this.create_point()
                current_point.x = new_point.x;
                current_point.y = new_point.y;
            }

        }

        return this;
    }

    on_canvas(point, use_difference){
        let difference = this.difference ? use_difference : 0;
        return point.x + difference >= 0 
                && point.x <= width + difference 
                && point.y + difference >= 0 
                && point.y <= height + difference;
    }

    mousePressed(){
        let is_clicked_on_canvas = this.on_canvas(
            createVector(mouseX, mouseY),
            false
        );

        if( ! is_clicked_on_canvas){
            return false;
        }

        if(this.is_playing){
            noLoop();
        }else{
            loop();
        }

        this.is_playing = ! this.is_playing;        
    }

    hasMousePressed(){
        return true;
    }

    static getName(){
        return "flow-field"
    }
 }

let doodle = null;

function preprocesDoodle(){
    doodle = new FlowField();
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