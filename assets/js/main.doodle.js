// GLOBAL VARAIBLES
let WIDTH = null;
let HEIGHT = null;
let current_doodle_method = null;
let possibilities = null;


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

    draw(){
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

    hasMousePressed(){
        return false;
    }

    static getName(){
        return "";
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

    static getName(){
        return "weierstrass"
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
        if(helper.randomNumber(0, 3) <= 3) return this;

        this.p.fill(col_points);
        this.p.noStroke();
        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            this.p.circle(element.x, element.y, 3);
        }

        return this;
    }

    static getName(){
        return "random-voronoi"
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

    static getName(){
        return "web-voronoi"
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

    static getName(){
        return "honeycomb-voronoi"
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

    static getName(){
        return "sierpinski-triangle"
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

    static getName(){
        return "bifurcation"
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

    static getName(){
        return "blue-noise"
    }
 }

 class FlowField extends Doodle{
    constructor(p5inst) {
        super(p5inst);
        this.current_z = 0;
        this.difference = helper.randomNumber(20, 200);
        this.num_particles = helper.randomNumber(1000, 15000);
        this.speed_factor = helper.randomNumber(1, 4);
        // console.log(this.num_particles, this.difference, this.speed_factor)

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

    hasMousePressed(){
        return true;
    }

    static getName(){
        return "flow-field"
    }
 }

 class HilbertCurve extends Doodle{
    constructor(p5inst) {
        super(p5inst);
        this.is_playing = true;
        this.order = 4;
        this.counter = 0;
    }

    calc_hilbert_point(index){
        let order = this.order;

        let points = [
            new p5.Vector(0, 0),
            new p5.Vector(0, 1),
            new p5.Vector(1, 1),
            new p5.Vector(1, 0)
        ]

        // Extract the least significant two bits of the index
        let i = index & 3
        let base = points[i]

        for(let j = 1; j < order; j++){
            // Right-shift the index by 2 bits to obtain the next two bits
            index = index >> 2
            i = index & 3
            length = 2 ** j

            if(i == 0){
                // Perform a swap of x and y coordinates for quadrant 0
                let temp = base.x
                base.x = base.y
                base.y = temp
            }else if (i == 1){
                // Update y coordinate for quadrant 1
                base.y += length
            }else if (i == 2){
                // Update x and y coordinates for quadrant 2
                base.x += length
                base.y += length
            }else if (i == 3){
                // Perform a reflection and update x and y coordinates for quadrant 3
                let temp = length - 1 - base.x
                base.x = length - 1 - base.y
                base.y = temp
                base.x += length
            }
        }

        return base
    }

    generate_points(){
        let points = [];

        let mobile_hack = WIDTH < 500;
        
        const n = Math.pow(2, this.order)
        const total = Math.pow(n, 2)
        let len = HEIGHT / n;

        for(let i=0; i < total; i++){
            let p = this.calc_hilbert_point(i)
            p.mult(len);
            if(mobile_hack){
                p.add(WIDTH / 5, len / 4);
            }else{
                p.add(WIDTH / 3, len / 4);
            }
            points.push(p)
        }

        this.points = points;
        return this;
    }

    draw(){
        return this;
    }

    animate(){
        this.p.stroke(0);
        this.p.strokeWeight(2);
        this.p.noFill();

        let max_x = 0;
        for (let i = 1; i < this.counter; i++) {
            let h = this.p.map(i, 0, this.points.length, 0, 360);
            this.p.stroke(50, 50, h/2);
            this.p.line(this.points[i].x, this.points[i].y, this.points[i - 1].x, this.points[i - 1].y);
        }
        
        if(! this.is_playing){
            this.p.noLoop();
        }

        this.counter += this.p.map(this.p.noise(max_x), 0, 1, 5, this.points.length / 10);
        if (this.counter > this.points.length) {
            this.counter = this.points.length;
            this.is_playing = false;
        }

        return this;
    }
    static getName(){
        return "hilbert-curve"
    }
 }



 class SmoothCurve extends Doodle{
    constructor(p5inst) {
        super(p5inst);

        this.points = [];
        this.x = 0;

        this.to_add = 15;
        
        this.end = 3 * WIDTH / 4;
    }


    generate_points(){
        return this;
    }

    animate(){
        // this.p.background(255);
        let color = 100;

        this.p.clear();
        this.p.stroke(color);
        this.p.strokeWeight(2);

        let scale = 0.01;

        let x_to_remove = 0;

        if(this.x > this.end){
            x_to_remove = this.points[this.to_add].x;
            this.points = this.points.splice(this.to_add);
        }

        // console.log(this.points)

        for (let i = 1; i < this.points.length; i++) {
            // let h = this.p.map(i, 0, this.points.length, 0, 100)
            // this.p.fill(130, 130, 130, h);    
            this.p.line(this.points[i].x - x_to_remove, this.points[i].y, this.points[i - 1].x - x_to_remove, this.points[i - 1].y);
        }

        let n = this.points.length - 1;

        if(n > 1){
            this.p.fill(color);
            this.p.circle(this.points[n].x - x_to_remove, this.points[n].y, 8)
        }

        for(let i=0; i < this.to_add; i++){
            let x = this.x;
            let rnd_number = this.p.noise(this.x * scale);
            let y = this.p.map(rnd_number, 0, 1, HEIGHT/4, 3*HEIGHT/4);
            this.points.push(this.p.createVector(x, y))

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

 class GameOfLife extends Doodle{
    constructor(p5inst) {
        super(p5inst);

        this.playing = true;

        this.cell_size = 5;
        this.grid = this.createMatrix(HEIGHT, WIDTH, this.cell_size);
    }

    createMatrix(row, col, cell_size){
        let col_cell = parseInt(Math.round(col / cell_size));
        let row_cell = parseInt(Math.round(row / cell_size));
        // console.log(row_cell, col_cell)
        let grid = new Array(col_cell);

        for(let i=0; i < grid.length; i++){
            grid[i] = new Array(row_cell);
        }

        return grid;
    }

    randomXY(num){
        return [
            parseInt(Math.round(this.p.noise(num)*this.grid.length)), 
            parseInt(Math.round(this.p.noise(num*num)*this.grid[0].length))
        ]
    }

    generate_points(){
        // for(let i=0; i < this.grid.length; i++){
        //     for(let j=0; j < this.grid[0].length; j++){
        //         let rnd = Math.floor(this.p.random(25))
        //         if (rnd == 5){
        //             rnd = 1;
        //         }else{
        //             rnd = 0;
        //         }

        //         this.grid[i][j] = rnd;
        //     }
        // }

        for(let i=0; i < this.grid.length; i++){
            for(let j=0; j < this.grid[0].length; j++){
                this.grid[i][j] = 0;
            }
        }

        for(let k=0; k < 150; k++){
            let point = this.randomXY(k);
            let x = point[0];
            let y = point[1];
            // console.log(x, y, this.grid.length, this.grid[0].length);

            this.grid[x][y] = 1;
        }

        this.p.frameRate(10);

        return this;
    }

    countNeighbours(row, col){
        let sum = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                // dont count oneselft
                // if(i == 0 && j == 0) continue;

                let pos_row = Math.min(Math.max(0, row + i), this.grid.length - 1);
                let pos_col = Math.min(Math.max(0, col + j), this.grid[0].length - 1);
                // console.log(row, col, i, j, pos_row, pos_col, sum, this.grid[pos_row][pos_col]);
                sum += this.grid[pos_row][pos_col];
            }
        }

        // console.log(sum);
        return sum;
    }

    draw(){
        return this;
    }

    nextGenerationGrid(){
        let next = this.createMatrix(HEIGHT, WIDTH, this.cell_size);

        for(let i=0; i < this.grid.length; i++){
            for(let j=0; j < this.grid[0].length; j++){
                let num = this.countNeighbours(i, j);

                // Alternative
                // if(this.grid[i][j] == 1  && num < 2){
                //     // Rule 1:
                //     // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                //     this.grid[i][j] = 1
                // }else if(this.grid[i][j] == 1 && num >= 2 && num <= 3){
                //     // Rule 2:
                //     // Any live cell with two or three live neighbours lives on to the next generation.
                //     this.grid[i][j] = 1
                //     // do nothing.
                // }else if(this.grid[i][j] == 1 && num > 3){
                //     // Rule 3:
                //     // Any live cell with more than three live neighbours dies, as if by overpopulation.
                //     this.grid[i][j] = 0;
                // }else if(this.grid[i][j] == 0 && num == 3){
                //     // Rule 4:
                //     // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                //     this.grid[i][j] = 1;
                // }

                if(this.grid[i][j] == 1  && num < 2){
                    // Rule 1:
                    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                    next[i][j] = 1
                }else if(this.grid[i][j] == 1 && num >= 2 && num <= 3){
                    // Rule 2:
                    // Any live cell with two or three live neighbours lives on to the next generation.
                    next[i][j] = 1
                    // do nothing.
                }else if(this.grid[i][j] == 1 && num > 3){
                    // Rule 3:
                    // Any live cell with more than three live neighbours dies, as if by overpopulation.
                    next[i][j] = 0;
                }else if(this.grid[i][j] == 0 && num == 3){
                    // Rule 4:
                    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                    next[i][j] = 1;
                }else{
                    next[i][j] = this.grid[i][j]
                }

            }
        }

        // return this.grid;
        return next
    }

    animate(){
        let BACKGROUND = 50;
        let FOREGROUND = 190;

        this.p.background(BACKGROUND);

        for(let i=0; i < this.grid.length; i++){
            for(let j=0; j < this.grid[0].length; j++){
                let x = i * this.cell_size;
                let y = j * this.cell_size;
                
                if(this.grid[i][j] === 1){
                    this.p.fill(FOREGROUND);
                }else{
                    this.p.fill(BACKGROUND);
                }

                this.p.stroke(BACKGROUND);
                this.p.rect(x, y, this.cell_size - 1, this.cell_size - 1);
            }
        }

        // compute next grid
        this.grid = this.nextGenerationGrid();

        // this.p.noLoop();

        if(this.p.random() < 0.01){
            this.p.noLoop();
            this.playing = false;
        }


        return this;
    }

    hasMousePressed(){
        return true;
    }

    mousePressed(){
        let is_clicked_on_canvas = on_canvas(
            this.p.createVector(this.p.mouseX, this.p.mouseY)
        );

        console.log(is_clicked_on_canvas);

        if( ! is_clicked_on_canvas){
            return false;
        }

        if(this.playing){
            this.p.noLoop();
        }else{
            this.p.loop();
        }

        this.playing = ! this.playing;
    }

    static getName(){
        return "game-of-life"
    }
 }


 class Walker{
    constructor(p5inst, radius, x, y, is_struck){
        this.p = p5inst;

        this.stuck = is_struck;
        this.radius = radius;

        if(x != undefined && y != undefined){
            this.pos = this.p.createVector(x, y);
        }else{
            this.pos = this.randomStartLocation();
        }        

        this.vel = this.randomWalkVelocity();
    }

    walk(){
        this.vel = this.randomWalkVelocity();

        this.pos.add(this.vel);

        this.pos.x = this.p.constrain(this.pos.x, this.radius, WIDTH - this.radius);
        this.pos.y = this.p.constrain(this.pos.y, this.radius, HEIGHT - this.radius);
    }

    randomWalkVelocity(){
        // let scale = 0.01;
        // let scale = 0.01;
        // const PI = 3.1415926535;

        // let n = this.p.noise(this.pos.x * scale, this.pos.y * scale);
        // n = this.p.map(n, 0, 1, -1, 1);

        // let center = this.p.createVector(WIDTH/2, HEIGHT/2);
        // let d = this.distanceSquared(this.pos, center);
        // let cos = Math.sqrt(d) / this.pos.x;

        // let angle = 2*PI * n;

        // let x = Math.cos(angle);
        // let y = Math.sin(angle);

        // let velPerlin = this.p.createVector(x, y);

        let vel = p5.Vector.random2D().mult(0.95);
        return vel.mult(2.5);
        // return velPerlin.mult(0.1); //.mult(this.p.random(-1, 1));
    }

    showVel(){
        this.p.stroke(0);
        this.p.line(this.pos.x, this.pos.y, (this.pos.x + this.vel.x) * 1.02, (this.pos.y + this.vel.y) * 1.02);
    }

    randomStartLocation(){
        let start_locations = [
            this.p.createVector(this.radius + 1, this.p.random(HEIGHT)),
            this.p.createVector(WIDTH - (this.radius + 1), this.p.random(HEIGHT)),
            this.p.createVector(this.p.random(WIDTH), this.radius + 1),
            this.p.createVector(this.p.random(WIDTH), HEIGHT - (this.radius + 1)),
        ]

        let idx = Math.floor(this.p.random(4));
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
        this.p.noStroke();
        this.p.noFill();
        if(this.stuck){
            this.p.fill(0, 90, 120);
        }

        this.p.ellipse(this.pos.x, this.pos.y, this.radius)
    }


 }

 class DiffusionLimitetAgg extends Doodle{
    constructor(p5inst) {
        super(p5inst);
        this.tree = [];
        this.walkers = [];
        this.MAX_WALKERS = 1000;
        this.MAX_ITER = 100;
        this.RADIUS = 4;
    }

    generate_points(){
        this.tree[0] = new Walker(this.p, this.RADIUS, WIDTH / 2, HEIGHT / 2, true);

        for(let i = 0; i < this.MAX_WALKERS; i++){
            this.walkers[i] = new Walker(this.p, this.RADIUS);
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

        this.p.frameRate(16)

        return this;
    }


    animate(){
        this.p.clear();

        if(this.walkers.length == 0){
            console.log('finished')
            this.p.noLoop();
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


function on_canvas(point){
    return point.x >= 0 
            && point.x <= WIDTH 
            && point.y >= 0 
            && point.y <= HEIGHT;
}

possibilities = {
    0: SierpinskiTriangle, 
    1: WebVoronoi,
    2: HoneycombVoronoi, 
    3: Weierstrass, 
    4: BiFurcation,
    5: BlueNoise, 
    6: FlowField,
    7: HilbertCurve,
    8: SmoothCurve,
    9: RandomVoronoi,
    // 10: GameOfLife,
    10: DiffusionLimitetAgg
};

function element_exists(element_id){
    return document.getElementById(element_id) !== null;
}

function createSketch(manual_choice_doodle) {
    return function sketch(p) {
        const box = document.getElementById(p._userNode)
        
        if(box === null){
            return null;
        }
    
        WIDTH = box.clientWidth;
        HEIGHT = box.clientHeight;
        current_doodle_method = -1;
    
        let doodleInstance = null;
    
        function sampleDoodle(possibilities){
            let N = Object.keys(possibilities).length
            var method = helper.randomNumber(0, N-2);
            // method = 10;
            console.log("method:", method)
            return method;
        }
    
        p.setup = function () {
            p.createCanvas(WIDTH, HEIGHT);
            
            if(manual_choice_doodle !== null){
                new_doodle_method = manual_choice_doodle;
            }else{
                new_doodle_method = sampleDoodle(possibilities)
            }
            
            let doodle = possibilities[new_doodle_method];
            doodleInstance = new doodle(p).generate_points().draw();
        }
    
        p.draw = function () {
            doodleInstance.animate();
        }
    
        p.mousePressed = function(){
            if(doodleInstance.hasMousePressed()){
                doodleInstance.mousePressed();
            }
        }
    };
  }


const {
host, hostname, href, origin, pathname, port, protocol, search
} = window.location

let current_path = pathname.slice(1, -1)

if(!current_path.includes('doodles')){
    new p5(createSketch(null), 'doodle-container');
}

// if(current_path.includes('doodles')){

//     Object.entries(possibilities).forEach(([key, element]) => {
//         let element_name = element.getName();
//         if(element_exists(element_name)){
//             new p5(createSketch(key), element_name);
//         }
//     });

// }
