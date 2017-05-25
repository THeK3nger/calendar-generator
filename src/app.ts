import $ = require('jquery');
import d3 = require('d3');

import * as Physic from "physic"
import * as CalendGen from "calendgen"

function handleForm() {
    console.log("Click Received. Starting Calendar Generation.");
    let star_mass = parseFloat($("#starmass").val());
    let planet_mass = parseFloat($("#planetmass").val());
    let planet_axis_major = parseFloat($("#planetaxismajor").val()) * 1000;
    let moon_mass = parseFloat($("#moonmass").val());
    let moon_axis_major = parseFloat($("#moonaxismajor").val()) * 1000;
    let day_duration = parseFloat($("#dayduration").val());
    clear();
    let planet_data = {
        "axis_major": planet_axis_major,
        "mass": planet_mass,
        "day_duration": day_duration
    };
    let result = CalendGen.generateCalendarFromOrbit(planet_data, star_mass, [{ mass: moon_mass, axis_major: moon_axis_major }]);
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
    $("#planetaxismajor").val(Physic.earth_axmj / 1000);
    $("#moonmass").val(Physic.moon_mass);
    $("#moonaxismajor").val(Physic.moon_axmj / 1000);
    $("#dayduration").val(86400);
}

function drawOrbit() {
    const scale = 22;
    let root = d3.select("#visualization svg");

    let e = 0.8167086;
    let a = 200;
    let b = a * Math.sqrt(1 - e*e);

    let focus = 250 + a*e;

    let star = root.append("circle")
        .attr("cx", focus)
        .attr("cy", 250)
        .attr("r",20)
        .style("fill","yellow");

    let orbit = root.append("ellipse")
        .attr("cx", 255)
        .attr("cy", 250)
        .attr("rx", a)
        .attr("ry", b)
        .style("fill", "none")
        .style("stroke", "black");
}
// --------------- //

init();
drawOrbit();