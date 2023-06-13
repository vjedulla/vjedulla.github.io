class Walker{
    constructor(radius, x, y, is_struck){
        this.stuck = is_struck;
        this.radius = radius;

        if(x != undefined && y != undefined){
            this.pos = createVector(x, y);
        }else{
            this.pos = this.randomStartLocation();
        }        

        this.vel = this.randomWalkVelocity();
    }

    walk(){
        this.vel = this.randomWalkVelocity();

        this.pos.add(this.vel);

        this.pos.x = constrain(this.pos.x, this.radius, width - this.radius);
        this.pos.y = constrain(this.pos.y, this.radius, height - this.radius);
    }

    randomWalkVelocity(){
        // let scale = 0.01;
        // let scale = 0.01;
        // const PI = 3.1415926535;

        // let n = noise(this.pos.x * scale, this.pos.y * scale);
        // n = map(n, 0, 1, -1, 1);

        // let center = createVector(width/2, height/2);
        // let d = this.distanceSquared(this.pos, center);
        // let cos = Math.sqrt(d) / this.pos.x;

        // let angle = 2*PI * n;

        // let x = Math.cos(angle);
        // let y = Math.sin(angle);

        // let velPerlin = createVector(x, y);

        let vel = p5.Vector.random2D().mult(0.95);
        return vel.mult(2.5);
        // return velPerlin.mult(0.1); //.mult(random(-1, 1));
    }

    showVel(){
        stroke(0);
        line(this.pos.x, this.pos.y, (this.pos.x + this.vel.x) * 1.02, (this.pos.y + this.vel.y) * 1.02);
    }

    randomStartLocation(){
        let start_locations = [
            createVector(this.radius + 1, random(height)),
            createVector(width - (this.radius + 1), random(height)),
            createVector(random(width), this.radius + 1),
            createVector(random(width), height - (this.radius + 1)),
        ]

        let idx = Math.floor(random(4));
        return start_locations[idx];
    }

    checkStuck(tree){
        let r = this.radius;
        for(let i = 0; i < tree.length; i++){
            var d = this.distanceSquared(this.pos, tree[i].pos)
            
            if(d < (r * r)){
                this.stuck = true;
                return true;
            }
        }
        return false
    }

    distanceSquared(a, b){
        let dx = b.x - a.x;
        let dy = b.y - a.y;

        return dx*dx + dy*dy;
    }

    show(){
        noStroke();
        noFill();
        if(this.stuck){
            fill(0, 90, 120);
        }

        ellipse(this.pos.x, this.pos.y, this.radius)
    }


 }

class DiffusionLimitetAgg extends Doodle{
    constructor() {
        super();
        this.tree = [];
        this.walkers = [];
        this.MAX_WALKERS = 1000;
        this.MAX_ITER = 100;
        this.RADIUS = 10;
    }

    pre_processing(){
        this.tree[0] = new Walker(this.RADIUS, width / 2, height / 2, true);

        for(let i = 0; i < this.MAX_WALKERS; i++){
            this.walkers[i] = new Walker(this.RADIUS);
        }

        return this;
    }

    draw(){
        for(let i = 0; i < this.tree.length; i++){
            this.tree[i].show();
        }

        for(let i = 0; i < this.walkers.length; i++){
            this.walkers[i].show();
        }

        frameRate(16)

        return this;
    }


    animate(){
        clear();

        if(this.walkers.length == 0){
            console.log('finished')
            noLoop();
        }

        for(let i = 0; i < this.tree.length; i++){
            this.tree[i].show();
        }
        for(let i = 0; i < this.walkers.length; i++){
            this.walkers[i].show();
            // this.walkers[i].showVel();
        }

        for(let k=0; k < this.MAX_ITER; k++){
            for(let i = 0; i < this.walkers.length; i++){
                this.walkers[i].walk();
                
                if(this.walkers[i].checkStuck(this.tree)){
                    this.tree.push(this.walkers[i]);
                    this.walkers.splice(i, 1);
                }
            }
        }

        return this;
    }

    static getName(){
        return "diff-lim-agg"
    }
 }


let doodle = null;

function preprocesDoodle(){
    doodle = new DiffusionLimitetAgg();
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