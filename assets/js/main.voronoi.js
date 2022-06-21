const box = document.getElementById('canvas-container');

let width = box.clientWidth;
let height = box.clientHeight;

function sketch(p) {
    p.init_voronoi = function(){
        var voronoi = new Voronoi();
        var bbox = {xl: 0, xr: width, yt: 0, yb: height}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom


        function randomNumber(a, b){
            return  parseInt(a + Math.floor(Math.random() * (b+1)));   
        }

        var method = randomNumber(0, 1); // which method will be executed (sampling)
        const n = randomNumber(20, 50); // how many points
        const offsetX = width / 2; //randomNumber(-width*0.25, width * 0.25);
        const offsetY = height / 2; // randomNumber(-height * 0.25, height * 0.25);
        const zoomFactor = randomNumber(3, 6);

        var points = [];
        for (let j = 0; j < n; j++) {
            const w = randomNumber(0, width);
            const h = randomNumber(0, height);
            
            if(method == 0){
                points.push({x: (w * Math.cos(w)) / zoomFactor  + offsetX, y: (h * Math.sin(h)) / zoomFactor + offsetY});
            }else if(method == 1){
                points.push({x: w, y: h});
            }
            
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
        }

        if(method == 1){
            p.fill(col_points);
            p.noStroke();
            for (let index = 0; index < points.length; index++) {
                const element = points[index];
                
                p.circle(element.x, element.y, 3);
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
        vector = p.init_voronoi();
        p.createCanvas(width, 400);

        p.draw_voronoi(vector);
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