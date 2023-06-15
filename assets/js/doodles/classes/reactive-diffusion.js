// ---
// layout: doodle
// title: Reactive petri dish
// subtitle: growing life.
// js: [
//     "/assets/js/doodles/classes/diffusion.js", 
//     "/assets/js/doodles/classes/reactive-diffusion.js"
// ]
// date: 13-06-2023
// ---

// <div id="specific-doodle-container"></div>

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
        return vel.mult(5);
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

        this.finished = false;
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


    animate(flag){
        clear();

        if(this.walkers.length == 0){
            this.finished = true;
        }

        if(this.walkers.length == 0 && !flag){
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

    isFinished(){
        return this.finished;
    }

    static getName(){
        return "diff-lim-agg"
    }
 }



class ReactiveDifussion extends Doodle{
    constructor(baseDoodle){
        super();

        this.grid = null;
        this.next = null;

        // from previus
        // only populated when the previus one finishes;
        this.seed = null;
        this.prev_doodle = baseDoodle;


        // parameters
        this.dA = 1.0;
        this.dB = 0.5;
        this.feed = 0.055;
        this.k = 0.061;

    }

    pre_processing(){
        this.grid = [];
        this.next = []

        pixelDensity(1);

        for(let i = 0; i < width; i++){
            this.grid[i] = [];
            this.next[i] = [];
            for(let j = 0; j < height; j++){
                this.grid[i][j] = {a: 1, b: 0};
                this.next[i][j] = {a: 1, b: 0};
            }
        }

        return this;
    }

    draw(){
        // console.log(this.seed.length)
        // only once
        // if(this.seed !== 1001){
        //     return this;
        // }

       
        // for(let i = 0; i < this.seed.length; i++){
        //     let x = floor(this.seed[i].pos.x);
        //     let y = floor(this.seed[i].pos.y);

        //     console.log(x, y)

        //     this.grid[x][y].b = 1;
        // }

        for(let i = 50; i < 150; i++){
            for(let j = 50; j < 150; j++){
                this.grid[i][j].b = 1;
            }
        }

        return this;
    }

    swap(){
        let temp = this.grid;
        this.grid = this.next;
        this.next = temp;
    }

    laplace(property, i, j){
        let sum = 0;

        sum += this.grid[i][j][property] * -1;
        sum += this.grid[i-1][j][property] * 0.2;
        sum += this.grid[i+1][j][property] * 0.2;
        sum += this.grid[i][j-1][property] * 0.2;
        sum += this.grid[i][j+1][property] * 0.2;
        sum += this.grid[i-1][j-1][property] * 0.05;
        sum += this.grid[i+1][j-1][property] * 0.05;
        sum += this.grid[i-1][j+1][property] * 0.05;
        sum += this.grid[i+1][j+1][property] * 0.05;

        return sum;
    }


    animate(){
        background(245);
        // if(this.prev_doodle.isFinished() && this.seed === null){
        //     this.seed = this.prev_doodle.tree;

        //     console.log("finished and set to", this.prev_doodle.tree)
        //     return this;
        // }

        // if(this.seed === null){ 
        //     return this;
        // }

        

        for(let i = 1; i < width-1; i++){
            for(let j = 1; j < height-1; j++){
                let a = this.grid[i][j].a;
                let b = this.grid[i][j].b;

                this.next[i][j].a = a + 
                                    (this.dA * this.laplace('a', i, j)) - 
                                    (a * b * b) + 
                                    (this.feed * (1 - a));

                this.next[i][j].b = b + 
                                    (this.dB * this.laplace('b', i, j)) +
                                    (a * b * b) -
                                    ((this.k + this.feed) * b);

                this.next[i][j].a = constrain(this.next[i][j].a, 0, 1);
                this.next[i][j].b = constrain(this.next[i][j].b, 0, 1);
            }
        }

        loadPixels();
            for(let i = 0; i < width; i++){
                for(let j = 0; j < height; j++){
                    let idx = (i + j * width) * 4;
                    let a = this.next[i][j].a;
                    let b = this.next[i][j].b;
                    let c = floor((a-b) * 245);
                    c = constrain(c, 0, 245);

                    pixels[idx + 0] = c;
                    pixels[idx + 1] = c;
                    pixels[idx + 2] = c;
                    pixels[idx + 3] = 255;
                }
            }
        updatePixels();

        this.swap();

        return this;
    }
}

let doodle = null;
let baseDoodle = null;

function preprocesDoodle(){
    // diffussion doodle
    // baseDoodle = new DiffusionLimitetAgg();
    // baseDoodle.pre_processing()

    doodle = new ReactiveDifussion(baseDoodle);
    doodle.pre_processing();
}

function drawDoodle(){
    // baseDoodle.draw();
    doodle.draw();
}

function animateDoodle(){
    doodle.animate();
    // baseDoodle.animate(true);

    // if(baseDoodle.isFinished()){
    //     doodle.animate();
    //     doodle.draw();
    // }
}


// function mousePressedDoodle(){
//     if(baseDoodle.hasMousePressed()){
//         baseDoodle.mousePressed();
//     }
// }


// function mouseMovedDoodle(){
//     if(baseDoodle.hasMouseMoved()){
//         baseDoodle.mouseMoved();
//     }
// }