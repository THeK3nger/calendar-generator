import $ = require('jquery');
import d3 = require('d3');

import * as Physic from "physic"
import * as CalendGen from "calendgen"

function handleForm() {
    console.log("Click Received. Starting Calendar Generation.");
    let star_mass = parseFloat($("#starmass").val());
    let planet_mass = parseFloat($("#planetmass").val());
    let planet_perihelion = parseFloat($("#planetperihelion").val()) * 1000;
    let planet_aphelion = parseFloat($("#planetaphelion").val()) * 1000;
    let moon_mass = parseFloat($("#moonmass").val());
    let moon_perigee = parseFloat($("#moonperigee").val()) * 1000;
    let moon_apogee = parseFloat($("#moonapogee").val()) * 1000;
    let day_duration = parseFloat($("#dayduration").val());
    clear();
    let planet_data = {
        periapsis: planet_perihelion,
        apoapsis: planet_aphelion,
        mass: planet_mass,
        day_duration: day_duration
    };
    let result = CalendGen.generateCalendarFromOrbit(planet_data, star_mass, [{ mass: moon_mass, periapsis: moon_perigee, apoapsis: moon_perigee }]);
    for (let s of result.description) {
        writeLine(s);
    }
}

/** 
 * Write a line in the output Div.
 */
function writeLine(message: string) {
    $("#calendar-description").append(`<p>${message}<\p>`);
}

/**
 * Clear output div.
 */
function clear() {
    $("#calendar-description p").remove();
}

function init() {
    console.log("I ADD CLICK");
    $("#generateButton").click(handleForm);
    $("#starmass").val(Physic.sun_mass);
    $("#planetmass").val(Physic.earth_mass);
    $("#planetperihelion").val(Physic.earth_perihelion / 1000);
    $("#planetaphelion").val(Physic.earth_aphelion / 1000);
    $("#moonmass").val(Physic.moon_mass);
    $("#moonperigee").val(Physic.moon_perigee / 1000);
    $("#moonapogee").val(Physic.moon_apogee / 1000);
    $("#dayduration").val(86400);
}

function drawOrbit() {
    const scale = 22;
    const width = 500;
    const height = 500;
    let root = d3.select("#visualization svg")
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let e = 0.1167086;
    let a = 200;
    let b = a * Math.sqrt(1 - e*e);

    let focus = a*e;

    let orbit = root.append("ellipse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", a)
        .attr("ry", b)
        .style("fill", "none")
        .style("stroke", "rgba(255, 204, 0, 0.25)")
        .style("stroke-width", 2);

    let star = root.append("circle")
        .attr("cx", focus)
        .attr("cy", 0)
        .attr("r",20)
        .style("fill","yellow");

    let earth = root.append("circle")
        .attr("cx", a)
        .attr("cy", 0)
        .attr("r",10)
        .style("fill","rgba(113, 170, 255, 1.0)");
}
// --------------- //

init();
drawOrbit();