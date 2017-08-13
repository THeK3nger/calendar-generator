import * as $ from 'jquery';
import * as d3 from 'd3';

import * as Physic from "./physic"
import * as CalendGen from "./calendgen"
import * as Visualization from "./visualization"

import * as GeneratorUI from "./interface"

function handleForm(viz) {
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
    let e = (planet_aphelion - planet_perihelion) / (planet_aphelion + planet_perihelion);
    viz.draw_orbit(e);
    viz.draw_seasons(e, Math.atan2(6, 4));
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

export function init() {
    console.log("I ADD CLICK");
    GeneratorUI.initializeComponents();

    let viz = new Visualization.OrbitCanvas(500, 500, '#visualization');
    
    $("#generateButton").click(() => handleForm(viz));
    $("#starmass").val(Physic.sun_mass);
    $("#planetmass").val(Physic.earth_mass);
    $("#planetperihelion").val(Physic.earth_perihelion / 1000);
    $("#planetaphelion").val(Physic.earth_aphelion / 1000);
    $("#moonmass").val(Physic.moon_mass);
    $("#moonperigee").val(Physic.moon_perigee / 1000);
    $("#moonapogee").val(Physic.moon_apogee / 1000);
    $("#dayduration").val(86400);

    let planet_perihelion = parseFloat($("#planetperihelion").val());
    let planet_aphelion = parseFloat($("#planetaphelion").val());
    let e = (planet_aphelion - planet_perihelion) / (planet_aphelion + planet_perihelion);
    let equinox_angle = Math.atan2(6, 4);

    viz.draw_orbit(e);
    viz.draw_seasons(e, equinox_angle);


}