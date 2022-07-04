const box = document.getElementById('canvas-container');

let width = box.clientWidth;
let height = box.clientHeight;


class helper{
    static randomNumber(a, b){
        return parseInt(a + Math.round(Math.random() * (b+1)));   
    }

    combine(a, b){
        console.log('combine');
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
 * Triangle doodle.
 *
 * @class Triangle
 * @extends {Doodle}
 */
 class Triangle extends Doodle {
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

        var maxiter = 1000;

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
                this.p.pixels[pix + 0] = 255 - bright;
                this.p.pixels[pix + 1] = 255 - bright;
                this.p.pixels[pix + 2] = 255 - bright;
                this.p.pixels[pix + 3] = 255; // alpha
            }
            
        }

        this.p.updatePixels();
    }
 }


function sketch(p) {

    p.init_voronoi = function(init_points){
        var voronoi = new Voronoi();
        var bbox = {xl: 0, xr: width, yt: 0, yb: height}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom


        function randomNumber(a, b){
            return  parseInt(a + Math.round(Math.random() * (b+1)));   
        }

        var method = randomNumber(0, 1); // which method will be executed (sampling)
        const n = randomNumber(20, 50); // how many points

        const offsetX = width / 2; //randomNumber(-width*0.25, width * 0.25);
        const offsetY = height / 2; // randomNumber(-height * 0.25, height * 0.25);
        const zoomFactor = randomNumber(3, 6);

        var points = [];

        var A = (width * height) / n;
        var b = Math.ceil(Math.sqrt((A * height) / width));
        var a = Math.ceil((width * b) / height);

        var startX = 12, startY = 23, stepX = a, stepY = b, div = Math.ceil(width / a);

        for (let j = 0; j < n; j++) {
            const w = randomNumber(0, width);
            const h = randomNumber(0, height);
            
            if(method == 0){
                points.push({x: (w * Math.cos(w)) / zoomFactor  + offsetX, y: (h * Math.sin(h)) / zoomFactor + offsetY});
            }else if(method == 1){
                points.push({x: w, y: h});
            }else if(method == 2){
                newX = (startX + stepX * j) % width, newY = (startY + stepY * parseInt(j / div)) % height;
                
                points.push({x: newX, y: newY});
            }
            
        }


        if(init_points.length > 0){
            points = [];

            for (let i = 0; i < init_points.length; i++) {
                const element = init_points[i];
                points.push({x: element[0], y: element[1]});
            }

            method = 0;
        }


        var diagram = voronoi.compute(points, bbox);
        return [points, diagram, method];
    }


    p.draw_voronoi = function(vector){
        var points = vector[0];
        var diagram = vector[1];
        var method = vector[2];

        var col_points = null;
        var col_lines = null;

        if(method == 1){
            col_points = p.color(217, 63, 81);
            col_lines = p.color(0, 109, 161);
        }else if(method == 0){
            col_points = p.color(0, 109, 161);
            col_lines = p.color(217, 63, 81);
        }else if(method == 2){
            col_points = p.color(0, 109, 161);
            col_lines = p.color(0, 109, 161);
        }

        if(method == 1){
            p.fill(col_points);
            p.noStroke();
            for (let index = 0; index < points.length; index++) {
                const element = points[index];
                
                p.circle(element.x, element.y, 2);
            }
        }
        

        p.stroke(col_lines);
        for (let i = 0; i < diagram.edges.length; i++) {
            const e = diagram.edges[i];
        
            if (e.rSite != null && e.lSite != null){
                
                p.line(e.va.x, e.va.y, e.vb.x, e.vb.y);
            }
        }
    }

    var vector = null;


    p.setup = function () {
        p.createCanvas(width, 250);
        
        var method = helper.randomNumber(0, 2);
        // console.log(method);
        switch(method){
            case 0:
                new Triangle(p, 240, 3500).generate_points().draw();
                break;
            case 1:
                new RandomVoronoi(p, 100).generate_points().draw();
                break;
            case 2:
                new Weierstrass(p).generate_points().draw();
                break;
            default:
                new RandomVoronoi(p, 100).generate_points().draw();
        }
        
        p.noLoop(); // no need to loop empty draw
    }
  
    p.draw = function () {
        // empty
    }
}
new p5(sketch, 'canvas-container');