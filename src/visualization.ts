import d3 = require('d3');

export class OrbitCanvas {

    base_canvas;
    season_canvas;
    canvas;
    scale = 22;
    width: number;
    height: number;
    orbit;
    star;
    earth;
    moon;
    moon_orbit;
    seasons;

    constructor(width: number, height: number, container_id = 'body') {
        let container = d3.select(container_id);
        this.base_canvas = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "#222");
        this.season_canvas = this.base_canvas
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        this.canvas = this.base_canvas
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        this.width = width;
        this.height = height;
    }

    draw_seasons(e: number, equinox_angle: number) {
        let a = (this.width / 2) - 60;
        let b = a * Math.sqrt(1 - e * e);

        let focus = a * e;

        // Compute equinox line.
        let x = 250 * Math.cos(equinox_angle);
        let y = -250 * Math.sin(equinox_angle);

        if (!this.seasons) {
            this.seasons = new SeasonDiagram(this.season_canvas, this.star, equinox_angle);
        } else {
            this.seasons.update();
        }
    }

    draw_orbit(e: number) {
        const margin = 60; // Specify the margin between orbit and canvas boundary.
        let a = (this.width / 2) - margin;
        let b = a * Math.sqrt(1 - e * e);

        let focus = a * e;

        if (!this.orbit) {
            this.orbit = new Orbit(this.canvas, 0, 0, a, b, "rgba(255, 204, 0, 0.25)");
        } else {
            this.orbit.rx = a;
            this.orbit.ry = b;
            this.orbit.update();
        }

        if (!this.star) {
            this.star = new CelestialBody(this.canvas, focus, 0, 20, "yellow");
        } else {
            this.star.cx = focus;
            this.star.update();
        }

        if (!this.earth) {
            this.earth = new CelestialBody(this.canvas, a, 0, 10, "rgba(113, 170, 255, 1.0)");
        } else {
            this.earth.cx = a;
            this.earth.update();
        }

        if (!this.moon_orbit) {
            this.moon_orbit = new Orbit(this.canvas, a, 0, 30, 30, "rgba(255, 255, 255, 0.25)");
        } else {
            this.moon_orbit.cx = a;
            this.moon_orbit.update();
        }

        if (!this.moon) {
            this.moon = new CelestialBody(this.canvas, a + 30, 0, 5, "#DDD");
        } else {
            this.moon.cx = a + 30;
            this.moon.update();
        }
    }

}

class CelestialBody {

    color: string;
    cx: number;
    cy: number;
    radius: number;
    svg_element;

    constructor(parent, cx: number, cy: number, radius: number, color: string) {
        this.color = color;
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.svg_element = parent.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .style("fill", color);
    }

    update() {
        this.svg_element
            .transition()
            .duration(750)
            .attr("cx", this.cx)
            .attr("cy", this.cy)
            .attr("r", this.radius);
    }
}

class Orbit {
    color: string;
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    svg_element;

    constructor(parent, cx: number, cy: number, rx: number, ry: number, color: string) {
        this.color = color;
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.svg_element = parent.append("ellipse")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("rx", rx)
            .attr("ry", ry)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", 2);
    }

    update() {
        this.svg_element
            .transition()
            .duration(750)
            .attr("cx", this.cx)
            .attr("cy", this.cy)
            .attr("rx", this.rx)
            .attr("ry", this.ry);
    }
}

class SeasonDiagram {

    sun: CelestialBody;
    equinox_angle: number;
    svg_element: { equinox_line, solstice_line }
    lines_size: number;

    constructor(parent, center: CelestialBody, equinox_angle: number) {
        this.sun = center;
        this.equinox_angle = equinox_angle;
        this.svg_element = { equinox_line: undefined, solstice_line: undefined };
        this.lines_size = 500;

        let x1 = this.sun.cx + this.lines_size * Math.cos(this.equinox_angle);
        let y1 = this.sun.cy - this.lines_size * Math.sin(this.equinox_angle);
        let x2 = this.sun.cx - this.lines_size * Math.cos(this.equinox_angle);
        let y2 = this.sun.cy + this.lines_size * Math.sin(this.equinox_angle);

        this.svg_element.equinox_line = parent.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .style("stroke", "rgba(255, 0, 0, 0.85)")
            .style("stroke-width", 2);

        this.svg_element.solstice_line = parent.append("line")
            .attr("x1", -y1)
            .attr("y1", x1)
            .attr("x2", -y2)
            .attr("y2", x2)
            .style("stroke", "rgba(255, 0, 0, 0.85)")
            .style("stroke-width", 2);
    }

    update() {
        let x1 = this.sun.cx + this.lines_size * Math.cos(this.equinox_angle);
        let y1 = this.sun.cy - this.lines_size * Math.sin(this.equinox_angle);
        let x2 = this.sun.cx - this.lines_size * Math.cos(this.equinox_angle);
        let y2 = this.sun.cy + this.lines_size * Math.sin(this.equinox_angle);

        this.svg_element.equinox_line
            .transition()
            .duration(750)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2);
        this.svg_element.solstice_line
            .transition()
            .duration(750)
            .attr("x1", -y1)
            .attr("y1", x1)
            .attr("x2", -y2)
            .attr("y2", x2);
    }
}
