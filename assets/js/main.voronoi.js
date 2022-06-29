const box = document.getElementById('canvas-container');

let width = box.clientWidth;
let height = box.clientHeight;


class helper{
    randomNumber(){
        return 4;
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
        throw new Error("Method 'say()' must be implemented.");
    }
}

/**
 * Voronoi doodle.
 *
 * @class Voronoi
 * @extends {Doodle}
 */
 class VoronoiD extends Doodle {
    generate_points() {
        console.log("voronoi");
    }
}

/**
 * Triangle doodle.
 *
 * @class Triangle
 * @extends {Doodle}
 */
 class Triangle extends Doodle {
    generate_points() {
        console.log("triangle");
    }
}

function sketch(p) {
    p.triangle = function(){
        function randomNumber(a, b){
            return  parseInt(a + Math.round(Math.random() * (b+1)));   
        }

        var side = 250;
        var cx = width/2, cy = height/2;

        var h = side * (Math.sqrt(3)/2);

        var a = [-side / 2, h / 2];
        var b = [side / 2, h / 2];
        var c = [0, -h / 2];

        console.log(a, b, c);

        var m_ab = (a[1] - b[1]) / (a[0] - b[0]);
        var c_ab = b[1] - m_ab * b[0];
        
        var m_bc = (b[1] - c[1]) / (b[0] - c[0]);
        var c_bc = c[1] - m_bc * c[0];


        var m_ca = (c[1] - a[1]) / (c[0] - a[0]);
        var c_ca = a[1] - m_ca * a[0];


        var random_idx = function(points){
            var idx_a = -1;
            var idx_b = -1;

            while(true){
                idx_a = randomNumber(0, points.length - 2);
                idx_b = randomNumber(0, points.length - 2);

                if(idx_a != idx_b) break;
            }
            return [idx_a, idx_b];
        }

        var choose_random = function(points, m_s, c_s){
            var rnd_idx = random_idx(points);
            idx_a = rnd_idx[0];
            idx_b = rnd_idx[1];

            var rnd_x = randomNumber(
                        Math.min(points[idx_a][0], points[idx_b][0]),
                        Math.max(points[idx_a][0], points[idx_b][0])
            );

            var det_y = m_s[idx_b] * rnd_x + c_s[idx_b];
            
            // console.log(points, idx_a, idx_b, rnd_x, det_y);
            // console.log(Math.min(points[idx_a][0], points[idx_b][0]), Math.max(points[idx_a][0], points[idx_b][0]));
            // console.log(m_s, c_s);

            return [rnd_x, det_y];
        }

        var rnd_point = choose_random([a, b, c], [m_ab, m_bc, m_ca], [c_ab, c_bc, c_ca]);


        var size_bg = 5;
        var size_sm = 1;
        var n = 2000;

        p.noStroke();
        p.fill(100);
        p.circle(rnd_point[0] + cx, rnd_point[1] + cy, size_sm);

        var points = [a, b, c];

        var all_points = [
            [a[0] + cx, a[1] + cy],
            [b[0] + cx, b[1] + cy],
            [c[0] + cx, c[1] + cy],
        ]

        for (let i = 0; i < n; i++) {
            var which = random_idx(points)[0];

            // var m_wr = (points[which][1] - rnd_point[1]) / (points[which][0] - rnd_point[0]);
            // var c_wr = rnd_point[1] - m_wr * rnd_point[0];

            var midpoint_x = (points[which][0] + rnd_point[0]) / 2;
            var midpoint_y = (points[which][1] + rnd_point[1]) / 2;
            
            rnd_point = [midpoint_x, midpoint_y];
            p.noStroke();
            p.fill(100);
            p.circle(rnd_point[0] + cx, rnd_point[1] + cy, size_sm);

            all_points.push([rnd_point[0] + cx, rnd_point[1] + cy])
        }

        p.noStroke();
        p.fill(100);
        p.circle(a[0] + cx, a[1] + cy, size_bg);
        p.circle(b[0] + cx, b[1] + cy, size_bg);
        p.circle(c[0] + cx, c[1] + cy, size_bg);


        // p.translate(cx, cy);
        // p.stroke(100);
        // p.line( -side / 2, h / 2, side / 2, h / 2);
        // p.line(side / 2, h / 2, 0, -h / 2);
        // p.line(0, -h / 2, -side / 2, h / 2);

        return all_points;
    }


    p.sampling_method = function(input_method){
        // make the code more readable
    }



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
        
        new Triangle().generate_points();


        points = p.triangle();
        // vector = p.init_voronoi(points);
        // p.draw_voronoi(vector);

        p.noLoop(); // no need to loop empty draw
    }
  
    p.draw = function () {
        // console.log(p.deltaTime)
        // if(p.deltaTime > 15){
        //     vector = p.init_voronoi();
        //     p.draw_voronoi(vector);
        // }

        // vector[0][0].x = (vector[0][0].x + 1) % width

        // console.log(vector[0][0].x)
        // var size = 30;


        // rect = [p.mouseX - size, p.mouseY - size, size*2]

        // p.color(20);
        // p.fill(20);
        // p.rect(rect[0], rect[1], rect[2])
        // p.clear();
    }
  }

  new p5(sketch, 'canvas-container');