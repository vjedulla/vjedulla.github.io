let WIDTH = null;
let HEIGHT = null;


class helper{
    static randomNumber(a, b){
        return parseInt(a + Math.round(Math.random() * (b+1)));   
    }

    static binomialCoefficient(n, k) {
        // Handle base cases
        if (k === 0 || k === n) {
          return 1;
        }
        
        // Initialize the result
        let result = 1;
        
        // Calculate the coefficient using Pascal's triangle
        for (let i = 1; i <= k; i++) {
          result = result * (n - i + 1) / i;
        }
        
        return result;
      }
}


/**
 * Abstract Class Doodle.
 *
 * @class Doodle
 */
 class Doodle {
    constructor(p5inst) {
        if (this.constructor == Doodle) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.p = p5inst;
    }

    generate_points() {
        throw new Error("Method 'generate_points()' must be implemented.");
    }

    draw(points, settings){
        throw new Error("Method 'draw()' must be implemented.");
    }

    animate(){
        // nothing by default
        this.p.noLoop();
    }

    mouseMoved(){
        return false;
    }

    mousePressed(){
        return false;
    }
}


/**
 * Weierstrass doodle.
 *
 * @class Weierstrass
 * @extends {Doodle}
 */
class Weierstrass extends Doodle{
    constructor(p5inst) {
        super(p5inst);
    }

    generate_points(){
        let linspace = function(startValue, stopValue, cardinality) {
            var arr = [];
            var step = (stopValue - startValue) / (cardinality - 1);
            for (var i = 0; i < cardinality; i++) {
                arr.push(startValue + (step * i));
            }
            return arr;
        }

        var xs = linspace(-3, 3, 5000);

        let weierstrass_fn = function(points){
            const n = 40;
            var ys = Array(points.length).fill(0);

            const a = 0.5, b = 7;

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < points.length; j++) {
                    const x = points[j];
                    var num = Math.pow(a, i) * Math.cos(
                        Math.pow(b, i) * Math.PI * x
                    )
                    ys[j] += num; 
                }
            }

            return ys;
        }


        var ys = weierstrass_fn(xs);

        this.points = xs;
        this.values = ys;
        return this;
    }

    draw(){

        const x_scale = 115;
        const y_scale = 60;

        for (let i = 0; i < this.points.length - 1; i++) {
            const x_ = this.points[i];
            const y_ = this.values[i];
            
            const x = this.points[i + 1];
            const y = this.values[i + 1];
            
            this.p.strokeWeight(0.2);
            // console.log(x * 10 + WIDTH/2, y*10 - HEIGHT / 2);

            this.p.line(
                x_ * x_scale + WIDTH/2, y_ * y_scale + HEIGHT / 2,
                x * x_scale + WIDTH/2, y * y_scale + HEIGHT / 2
            );
        }

        return this;
    }
}

/**
 * Voronoi doodle.
 *
 * @class Voronoi
 * @extends {Doodle}
 */
 class RandomVoronoi extends Doodle {
    constructor(p5inst, number) {
        super();
        this.p = p5inst;
        this.number = (number == null) ? helper.randomNumber(50, 100) : helper.randomNumber(number * 0.5, number * 1.5);
    }

    generate_points() {
        var voronoi = new Voronoi();
        var bbox = {xl: 0, xr: WIDTH, yt: 0, yb: HEIGHT}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

        const n = this.number;
        var points = [];

        for (let j = 0; j < n; j++) {
            const w = helper.randomNumber(0, WIDTH);
            const h = helper.randomNumber(0, HEIGHT);
            points.push({x: w, y: h});
        }

        var diagram = voronoi.compute(points, bbox);

        this.points = points;
        this.diagram = diagram;

        return this;
    }

    draw(points, settings){
        const col_points = this.p.color(217, 63, 81);
        const col_lines = this.p.color(0, 109, 161);

        this.p.stroke(col_lines);

        for (let i = 0; i < this.diagram.edges.length; i++) {
            const e = this.diagram.edges[i];
        
            if (e.rSite != null && e.lSite != null){
                this.p.line(e.va.x, e.va.y, e.vb.x, e.vb.y);
            }
        }

        // 1/4 of the time draw the points as well
        if(helper.randomNumber(0, 3) <= 3) return;

        this.p.fill(col_points);
        this.p.noStroke();
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            this.p.circle(element.x, element.y, 3);
        }

        return this;
    }
}

/**
 * Voronoi doodle.
 *
 * @class Voronoi
 * @extends {Doodle}
 */
 class WebVoronoi extends Doodle {
    constructor(p5inst) {
        super(p5inst);
        let number = 100;
        this.number = helper.randomNumber(number * 0.5, number * 1.5);
    }

    generate_points() {
        var voronoi = new Voronoi();
        var bbox = {xl: 0, xr: WIDTH, yt: 0, yb: HEIGHT}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

        const n = this.number;
        var points = [];
        const zoomFactor = helper.randomNumber(3, 6);

        const offsetX = WIDTH / 2; //randomNumber(-WIDTH*0.25, WIDTH * 0.25);
        const offsetY = HEIGHT / 2; // randomNumber(-HEIGHT * 0.25, HEIGHT * 0.25);

        for (let j = 0; j < n; j++) {
            const w = helper.randomNumber(0, WIDTH);
            const h = helper.randomNumber(0, HEIGHT);
            points.push({x: (w * Math.cos(w)) / zoomFactor + offsetX, y: (h * Math.sin(h)) / zoomFactor + offsetY});
        }

        var diagram = voronoi.compute(points, bbox);

        this.points = points;
        this.diagram = diagram;

        return this;
    }

    draw(){
        const col_points = this.p.color(217, 63, 81);
        const col_lines = this.p.color(0, 109, 161);

        this.p.stroke(col_lines);

        for (let i = 0; i < this.diagram.edges.length; i++) {
            const e = this.diagram.edges[i];
        
            if (e.rSite != null && e.lSite != null){
                this.p.line(e.va.x, e.va.y, e.vb.x, e.vb.y);
            }
        }

        // 1/4 of the time draw the points as well
        if(helper.randomNumber(0, 3) <= 3){
            return this;
        }

        this.p.fill(col_points);
        this.p.noStroke();
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            this.p.circle(element.x, element.y, 3);
        }

        return this;
    }
}


/**
 * Voronoi doodle.
 *
 * @class Voronoi
 * @extends {Doodle}
 */
 class HoneycombVoronoi extends Doodle {
    constructor(p5inst) {
        super(p5inst);
    }

    generate_points() {
        // Initialize Voronoi object and bounding box for Voronoi diagram
        const voronoi = new Voronoi();
        const boundingBox = {xl: 0, xr: WIDTH, yt: 0, yb: HEIGHT};
    
        const points = [];
    
        // Define random divisor using helper function for generating random numbers

        let divisorX = helper.randomNumber(5, 15);
        let divisorY = divisorX / 3; //helper.randomNumber(2, 15);
    
        // Calculate the distance between the points in the grid (X and Y directions)
        const deltaX = WIDTH / divisorX;
        const deltaY = HEIGHT / divisorY;
    
        // Define the offset value for even or odd rows
        // const randomOffset = helper.randomNumber(2, 6);
        const offsetX = deltaX / 3;
        const offsetY = deltaY / 3;

        // console.log("Parameters:")
        // console.log("divisorX: ", divisorX)
        // console.log("divisorY: ", divisorY)
        // console.log("randomOffset: ", randomOffset)
        // console.log("deltaX: ", deltaX)
        // console.log("deltaY: ", deltaY)
    
        // Generate points for odd rows
        for (let y = 0, row = 0; y <= HEIGHT + offsetY; y += deltaX, row++) {
            if (row % 2 !== 0) continue;  // Skip even rows
            for (let x = 0; x <= WIDTH + offsetY; x += deltaX) {
                // console.log(x, y);
                points.push({x, y});
            }
        }
    
        // Generate points for even rows with offset
        for (let y = 0, row = 0; y <= HEIGHT * offsetX; y += deltaX, row++) {
            if (row % 2 === 0) continue;  // Skip odd rows
            for (let x = 0; x <= WIDTH * offsetX; x += deltaY) {
                // console.log(x + offset, y);
                points.push({x: x + offsetX, y});
            }
        }

        // console.log(points)
    
        // Compute Voronoi diagram using the generated points
        const diagram = voronoi.compute(points, boundingBox);
    
        // Assign the points and Voronoi diagram to instance variables
        this.points = points;
        this.diagram = diagram;
    
        // Return the instance for method chaining
        return this;
    }

    draw(points, settings){
        const col_points = this.p.color(217, 63, 81);
        const col_lines = this.p.color(0, 109, 161);

        this.p.stroke(col_lines);

        for (let i = 0; i < this.diagram.edges.length; i++) {
            const e = this.diagram.edges[i];
        
            if (e.rSite != null && e.lSite != null){
                this.p.line(e.va.x, e.va.y, e.vb.x, e.vb.y);
            }
        }

        // return;

        this.p.fill(col_points);
        this.p.noStroke();
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            this.p.circle(element.x, element.y, 3);
        }

        return this;
    }
}



/**
 * SierpinskiTriangle doodle.
 *
 * @class SierpinskiTriangle
 * @extends {Doodle}
 */
 class SierpinskiTriangle extends Doodle {
    constructor(p5inst) {
        super(p5inst);
        this.side = 240;
        this.number = 3500;
    }

    random_idx(points){
        var idx_a = -1;
        var idx_b = -1;

        while(true){
            idx_a = helper.randomNumber(0, points.length - 2);
            idx_b = helper.randomNumber(0, points.length - 2);

            if(idx_a != idx_b) break;
        }
        return [idx_a, idx_b];
    }


    choose_random(points, m_s, c_s){
        var rnd_idx = this.random_idx(points);
        const idx_a = rnd_idx[0];
        const idx_b = rnd_idx[1];

        var rnd_x = helper.randomNumber(
                    Math.min(points[idx_a][0], points[idx_b][0]),
                    Math.max(points[idx_a][0], points[idx_b][0])
        );

        var det_y = m_s[idx_b] * rnd_x + c_s[idx_b];
        
        // console.log(points, idx_a, idx_b, rnd_x, det_y);
        // console.log(Math.min(points[idx_a][0], points[idx_b][0]), Math.max(points[idx_a][0], points[idx_b][0]));
        // console.log(m_s, c_s);

        return [rnd_x, det_y];
    }

    generate_points() {
        var side = this.side;
        var h = side * (Math.sqrt(3)/2);

        var a = [-side / 2, h / 2];
        var b = [side / 2, h / 2];
        var c = [0, -h / 2];

        var m_ab = (a[1] - b[1]) / (a[0] - b[0]);
        var c_ab = b[1] - m_ab * b[0];
        
        var m_bc = (b[1] - c[1]) / (b[0] - c[0]);
        var c_bc = c[1] - m_bc * c[0];


        var m_ca = (c[1] - a[1]) / (c[0] - a[0]);
        var c_ca = a[1] - m_ca * a[0];


        var rnd_point = this.choose_random([a, b, c], [m_ab, m_bc, m_ca], [c_ab, c_bc, c_ca]);

        var n = this.number;

        var points = [a, b, c];

        var all_points = []

        for (let i = 0; i < n; i++) {
            var which = this.random_idx(points)[0];

            var midpoint_x = (points[which][0] + rnd_point[0]) / 2;
            var midpoint_y = (points[which][1] + rnd_point[1]) / 2;
            
            rnd_point = [midpoint_x, midpoint_y];
            all_points.push({x: rnd_point[0], y: rnd_point[1]})
        }

        this.side_points = [
            {x: a[0], y: a[1]},
            {x: b[0], y: b[1]},
            {x: c[0], y: c[1]},
        ]
        
        this.points = all_points;
        return this;
    }

    draw(){
        const sps = this.side_points;
        const size_bg = 5;
        const size_sm = 1;
        const cx = WIDTH/2, cy = HEIGHT/2;

        this.p.noStroke();
        this.p.fill(100);
        this.p.circle(sps[0].x + cx, sps[0].y + cy, size_bg);
        this.p.circle(sps[1].x + cx, sps[1].y + cy, size_bg);
        this.p.circle(sps[2].x + cx, sps[2].y + cy, size_bg);

        const n = this.number;

        for (let i = 0; i < n; i++) {
            this.p.noStroke();
            this.p.fill(100);
            this.p.circle(this.points[i].x + cx, this.points[i].y + cy, size_sm);
        }

        return this;
    }
}


/**
 * Mandelbrot doodle.
 *
 * @class Mandelbrot
 * @extends {Doodle}
 */
 class Mandelbrot extends Doodle{
    constructor(p5inst) {
        super();
        this.p = p5inst;
    }

    generate_points(){
        return this;
    }

    draw(){
        this.p.pixelDensity(1);
        this.p.loadPixels();

        var maxiter = 2500;

        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {

                var a = this.p.map(x, 0, WIDTH, -3, 2.0);
                var b = this.p.map(y, 0, HEIGHT, -1.2, 1.2);


                var ca = a;
                var cb = b;

                var n = 0;
                var z = 0;

                while(n < maxiter){
                    var aa = a*a - b*b; // real
                    var bb = 2*a*b; // imaginary

                    a = ca + aa;
                    b = cb + bb;

                    if (a * a + b * b > 150){
                        break;
                    }

                    n++;
                }

                var bright = this.p.map(n, 0, maxiter, 0, 1);
                bright = this.p.map(Math.sqrt(bright), 0, 1, 0, 255);
                // var bright = 255;
                if(n == maxiter){
                    bright = 0;
                }

                var pix = (x + y * WIDTH) * 4;
                this.p.pixels[pix + 0] = bright;
                this.p.pixels[pix + 1] = bright;
                this.p.pixels[pix + 2] = bright;
                this.p.pixels[pix + 3] = 255; // alpha
            }
            
        }

        this.p.updatePixels();

        return this;
    }
 }

 class BiFurcation extends Doodle{
    constructor(p5inst) {
        super(p5inst);
    }

    generate_points(){
        let points = []

        let from = 0;
        let to = 399999;
        let divider = 100000;
        let step = 100;
        
        for (let r = from; r < to; r+=step) {
            let random_start = helper.randomNumber(20, 80);
            let x_n = random_start / 100;
            let x_n_1 = 0;

            for (let i = 0; i < 100; i++) {
                x_n_1 = r/divider * x_n * (1 - x_n);
                x_n = x_n_1;
            }
            
            if(r/divider > 1 && x_n_1 < 0.01){
                continue;
            }
            
            points.push({x: r/divider * WIDTH / 4, y: x_n_1 * -(HEIGHT) + HEIGHT - 1}); // stable value
            
            if(r % 10000 == 0){
                // console.log(r, step)
                step = Math.max(4, step - 10);
            }
        }
        
        this.points = points;

        return this;
    }

    draw(){
        const col_points = this.p.color(217, 63, 81);
        const col_lines = this.p.color(0, 109, 161);

        this.p.stroke(col_lines);

        const size_sm = 1.2;
        const cx = WIDTH/2, cy = HEIGHT/2;

        for (let i = 0; i < this.points.length; i++) {
            const x = this.points[i].x;
            const y = this.points[i].y;

            // console.log(x, y)

            this.p.noStroke();
            this.p.fill(100);
            this.p.circle(x, y, size_sm);
        }

        return this;
    }
 }


 class BlueNoise extends Doodle{
    constructor(p5inst) {
        super(p5inst);
        this.max_radius = helper.randomNumber(20, 30);
    }

    generate_points(){
        const minDistance = this.max_radius * Math.sqrt(2) + 0.2;
        const points = [];
        const activePoints = [];
        
        // Helper function to check if a point is inside the canvas
        function isInCanvas(x, y, rad) {
            return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT
                    && x+rad < WIDTH && y+rad < HEIGHT
                    && x-rad >= 0 && y-rad >= 0;
        }
        
        // Helper function to check if a point is too close to existing points
        function isFarEnough(x, y) {
            for (const point of points) {
                const dx = x - point.x;
                const dy = y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                    return false;
                }
            }
            
            return true;
        }
        
        // Pick a random starting point
        // const startX = Math.floor(Math.random() * WIDTH);
        // const startY = Math.floor(Math.random() * HEIGHT);

        const startX = WIDTH / 2;
        const startY = HEIGHT / 2;
        
        // Add the starting point to the active points list
        activePoints.push({ x: startX, y: startY });
        
        while (activePoints.length > 0) {
            // Pick a random active point
            const index = Math.floor(Math.random() * activePoints.length);
            const activePoint = activePoints[index];
            
            // Generate new points around the active point
            for (let i = 0; i < 50; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * minDistance + minDistance;
                
                const x = Math.round(activePoint.x + Math.cos(angle) * distance);
                const y = Math.round(activePoint.y + Math.sin(angle) * distance);
                
                if (isInCanvas(x, y, this.max_radius) && isFarEnough(x, y)) {
                    // Add the new point to the points list and active points list
                    points.push({ x, y });
                    activePoints.push({ x, y });
                }
            }
            
            // Remove the active point from the active points list
            activePoints.splice(index, 1);
        }
            
        this.points = points;

        return this;
    }

    draw(){
        const col_points = this.p.color(69, 69, 69);
        
        const size_sm = helper.randomNumber(this.max_radius / 1.8, this.max_radius / 1.4);

        const col_lines = this.p.color(2, 84, 100);
        this.p.stroke(col_lines);

        // console.log(this.points.length)

        let allow_link_to = size_sm * 2.5;
        for(let i = 0; i < this.points.length - 1; i++){
            for(let j = 0; j < this.points.length - 1; j++){
                let rnd_number = helper.randomNumber(0, 1000);

                if( i == j || rnd_number < 50){
                    // console.log(i, j, rnd_number, rnd_number < 50)
                    break;
                }

                let pa = this.points[i];
                let pb = this.points[j];

                const distance = Math.sqrt((pa.x - pb.x) * (pa.x - pb.x)  + (pa.y - pb.y) * (pa.y - pb.y));
                
                if(distance < allow_link_to){
                    this.p.line(pa.x, pa.y, pb.x, pb.y);
                }
            }
        }

        
        for (let i = 0; i < this.points.length; i++) {
            const x = this.points[i].x;
            const y = this.points[i].y;

            this.p.noStroke();
            this.p.fill(col_points);
            this.p.circle(x, y, size_sm);
        }

        return this;
    }
 }

 class FlowField extends Doodle{
    constructor(p5inst) {
        super(p5inst);
        this.current_z = 0;
        this.difference = helper.randomNumber(20, 200);
        this.num_particles = helper.randomNumber(1000, 15000);
        this.speed_factor = helper.randomNumber(1, 4);
        console.log(this.num_particles, this.difference, this.speed_factor)

        this.is_playing = true;
    }

    create_point(){
        let val = this.p.map(this.p.random(1), 0, 1, -1, 1);
        return this.p.createVector(this.p.random(WIDTH) + val*this.difference, this.p.random(HEIGHT) + val*this.difference)
    }

    generate_points(){
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
        this.p.background(0);
        const col_points = this.p.color('rgba(0, 187, 205, 0.8)');
        this.p.stroke(col_points);
        return this;
    }

    animate(){
        this.p.background(0, 2);
        // this.current_z = (this.p.millis() * 0.05) % 10000;
        let scale = 0.0055;
        const PI = 3.1415926535;

        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];

            this.p.point(point.x, point.y);

            let n = this.p.noise(point.x * scale, point.y * scale, this.current_z * scale*10);
            n = this.p.map(n, 0, 1, -1, 1);
            let angle = 2*PI * n;

            // let power_factor = parseInt(this.p.map(this.current_z, 0, 1, 1, 100) / 10);
            // point.x += Math.pow(Math.cos(angle), power_factor);
            // point.y += Math.pow(Math.sin(angle), power_factor);
            point.x += Math.cos(angle) / this.speed_factor;
            point.y += Math.sin(angle) / this.speed_factor;

            if(! this.on_canvas(point, true)){
                let new_point = this.create_point()
                point.x = new_point.x;
                point.y = new_point.y;
            }

        }

        return this;
    }

    on_canvas(point, use_difference){
        let difference = this.difference ? use_difference : 0;
        return point.x + difference >= 0 
                && point.x <= WIDTH + difference 
                && point.y + difference >= 0 
                && point.y <= HEIGHT + difference;
    }

    mousePressed(){
        let is_clicked_on_canvas = this.on_canvas(
            this.p.createVector(this.p.mouseX, this.p.mouseY),
            false
        );

        if( ! is_clicked_on_canvas){
            return false;
        }

        if(this.is_playing){
            this.p.noLoop();
        }else{
            this.p.loop();
        }

        this.is_playing = ! this.is_playing;        
    }
 }


function sketch(p) {
    const box = document.getElementById('canvas-container');

    if(box === null){
        return null;
    }

    WIDTH = box.clientWidth;
    HEIGHT = box.clientHeight;

    let doodleInstance = null;

    p.setup = function () {
        p.createCanvas(WIDTH, 250);
        
        possibilities = {
            0: SierpinskiTriangle, 
            1: WebVoronoi,
            2: HoneycombVoronoi, 
            3: Weierstrass, 
            4: BiFurcation,
            5: BlueNoise, 
            6: FlowField
        };

        let N = Object.keys(possibilities).length
        var method = helper.randomNumber(0, N-2);
        method = 6;
        console.log("method:", method)
        let doodle = possibilities[method];

        doodleInstance = new doodle(p).generate_points().draw();
    }

    p.draw = function () {
        // console.log(doodleInstance)
        doodleInstance.animate();
    }

    p.mousePressed = function(){
        doodleInstance.mousePressed();
    }
}

new p5(sketch, 'canvas-container');