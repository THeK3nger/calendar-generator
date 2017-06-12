import d3 = require('d3');

export class OrbitCanvas {

    canvas;
    scale = 22;
    width: number;
    height: number;

    constructor(width: number, height: number, container_id = 'body') {
        let container = d3.select(container_id);
        this.canvas = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background","#222")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        this.width = width;
        this.height = height;
    }

    draw_orbit() {
        let e = 0.1167086;
        let a = 200;
        let b = a * Math.sqrt(1 - e * e);

        let focus = a * e;

        let orbit = this.canvas.append("ellipse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("rx", a)
            .attr("ry", b)
            .style("fill", "none")
            .style("stroke", "rgba(255, 204, 0, 0.25)")
            .style("stroke-width", 2);

        let star = this.canvas.append("circle")
            .attr("cx", focus)
            .attr("cy", 0)
            .attr("r", 20)
            .style("fill", "yellow");

        let earth = this.canvas.append("circle")
            .attr("cx", a)
            .attr("cy", 0)
            .attr("r", 10)
            .style("fill", "rgba(113, 170, 255, 1.0)");
    }

}