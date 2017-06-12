import $ = require('jquery');
import d3 = require('d3');

import * as Physic from "physic"
import * as CalendGen from "calendgen"
import * as Visualization from "visualization"

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

// --------------- //

init();

let viz = new Visualization.OrbitCanvas(500, 500, '#visualization');
viz.draw_orbit();