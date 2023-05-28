const box = document.getElementById('canvas-container');

let width = box.clientWidth;
let height = box.clientHeight;


class helper{
    static randomNumber(a, b){
        return parseInt(a + Math.round(Math.random() * (b+1)));   
    }
}


/**
 * Abstract Class Doodle.
 *
 * @class Doodle
 */
 class Doodle {
    constructor() {
        if (this.constructor == Doodle) {
        throw new Error("Abstract classes can't be instantiated.");
        }
    }

    generate_points() {
        throw new Error("Method 'generate_points()' must be implemented.");
    }

    draw(points, settings){
        throw new Error("Method 'draw()' must be implemented.");
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
        super();
        this.p = p5inst;
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
            // console.log(x * 10 + width/2, y*10 - height / 2);

            this.p.line(
                x_ * x_scale + width/2, y_ * y_scale + height / 2,
                x * x_scale + width/2, y * y_scale + height / 2
            );
        }
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
        var bbox = {xl: 0, xr: width, yt: 0, yb: height}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

        const n = this.number;
        var points = [];

        for (let j = 0; j < n; j++) {
            const w = helper.randomNumber(0, width);
            const h = helper.randomNumber(0, height);
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
    }
}

/**
 * Voronoi doodle.
 *
 * @class Voronoi
 * @extends {Doodle}
 */
 class WebVoronoi extends Doodle {
    constructor(p5inst, number) {
        super();
        this.p = p5inst;
        this.number = (number == null) ? helper.randomNumber(50, 100) : helper.randomNumber(number * 0.5, number * 1.5);
    }

    generate_points() {
        var voronoi = new Voronoi();
        var bbox = {xl: 0, xr: width, yt: 0, yb: height}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

        const n = this.number;
        var points = [];
        const zoomFactor = helper.randomNumber(3, 6);

        const offsetX = width / 2; //randomNumber(-width*0.25, width * 0.25);
        const offsetY = height / 2; // randomNumber(-height * 0.25, height * 0.25);

        for (let j = 0; j < n; j++) {
            const w = helper.randomNumber(0, width);
            const h = helper.randomNumber(0, height);
            points.push({x: (w * Math.cos(w)) / zoomFactor + offsetX, y: (h * Math.sin(h)) / zoomFactor + offsetY});
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
        super();
        this.p = p5inst;
    }

    generate_points() {
        // Initialize Voronoi object and bounding box for Voronoi diagram
        const voronoi = new Voronoi();
        const boundingBox = {xl: 0, xr: width, yt: 0, yb: height};
    
        const points = [];
    
        // Define random divisor using helper function for generating random numbers

        let divisorX = helper.randomNumber(5, 15);
        let divisorY = divisorX / 3; //helper.randomNumber(2, 15);
    
        // Calculate the distance between the points in the grid (X and Y directions)
        const deltaX = width / divisorX;
        const deltaY = height / divisorY;
    
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
        for (let y = 0, row = 0; y <= height + offsetY; y += deltaX, row++) {
            if (row % 2 !== 0) continue;  // Skip even rows
            for (let x = 0; x <= width + offsetY; x += deltaX) {
                // console.log(x, y);
                points.push({x, y});
            }
        }
    
        // Generate points for even rows with offset
        for (let y = 0, row = 0; y <= height * offsetX; y += deltaX, row++) {
            if (row % 2 === 0) continue;  // Skip odd rows
            for (let x = 0; x <= width * offsetX; x += deltaY) {
                // console.log(x + offset, y);
                points.push({x: x + offsetX, y});
            }
        }

        console.log(points)
    
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
    }
}



/**
 * SierpinskiTriangle doodle.
 *
 * @class SierpinskiTriangle
 * @extends {Doodle}
 */
 class SierpinskiTriangle extends Doodle {
    constructor(p5inst, side_length, number) {
        super();
        this.side = side_length;
        this.p = p5inst;
        this.number = (number == null) ? 2000 : number;
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
        const cx = width/2, cy = height/2;

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

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {

                var a = this.p.map(x, 0, width, -3, 2.0);
                var b = this.p.map(y, 0, height, -1.2, 1.2);


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

                var pix = (x + y * width) * 4;
                this.p.pixels[pix + 0] = bright;
                this.p.pixels[pix + 1] = bright;
                this.p.pixels[pix + 2] = bright;
                this.p.pixels[pix + 3] = 255; // alpha
            }
            
        }

        this.p.updatePixels();
    }
 }

 class BiFurcation extends Doodle{
    constructor(p5inst) {
        super();
        this.p = p5inst;
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
            
            points.push({x: r/divider * width / 4, y: x_n_1 * -(height) + height - 1}); // stable value
            
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
        const cx = width/2, cy = height/2;

        for (let i = 0; i < this.points.length; i++) {
            const x = this.points[i].x;
            const y = this.points[i].y;

            // console.log(x, y)

            this.p.noStroke();
            this.p.fill(100);
            this.p.circle(x, y, size_sm);
        }
    }
 }


function sketch(p) {
    p.setup = function () {
        p.createCanvas(width, 250);
        
        var method = helper.randomNumber(0, 4);
        // method = 2;
        console.log(method)

        switch(method){
            case 0:
                new SierpinskiTriangle(p, 240, 3500).generate_points().draw();
                break;
            case 1:
                new WebVoronoi(p, 100).generate_points().draw();
                break;
            case 2:
                new HoneycombVoronoi(p).generate_points().draw();
                break;
            case 3:
                new Weierstrass(p).generate_points().draw();
                break;
            case 4:
                new BiFurcation(p).generate_points().draw();
                break;
            default:
                new RandomVoronoi(p, 200).generate_points().draw();
        }
        
        p.noLoop(); // no need to loop empty draw
    }
    p.draw = function () {
        // empty
    }
}

new p5(sketch, 'canvas-container');