import * as $ from "jquery"

import * as Physic from "physic"

type Moon = { mass: number, axis_major: number }

function generateCalendarFromOrbit(planet_axis_major: number, planet_mass: number, sun_mass: number, moons: Array<Moon>, planetDayDuration: number = 86400) {
    // Compute planet orbital period.
    let planet_year = Physic.orbital_period(sun_mass, planet_axis_major, planet_mass, );

    let moon_periods = [];
    // Compute moon periods.
    for (let moon of moons) {
        moon_periods.push(Physic.orbital_period(planet_mass, moon.axis_major, moon.mass));
    }

    return generateCalendarFromPeriod(planet_year, moon_periods, planetDayDuration);
}

function generateCalendarFromPeriod(planet_period: number, moon_periods: Array<number>, planetDayDuration: number = 86400) {
    let planetToEarthDays = planetDayDuration / 86400;
    let year_days_full = Physic.secondsToDays(planet_period, planetDayDuration);
    let year_days = Math.floor(year_days_full);
    if (planetToEarthDays != 1) {
        let earth_days = Math.floor(year_days_full * planetToEarthDays);
        writeLine(`Generating a calendar for a planet with a year of ${year_days} days (${earth_days} Earth Days).`);
    } else {
        writeLine(`Generating a calendar for a planet with a year of ${year_days} days`);
    }
    let planet_cf = continuedFractions(year_days_full, 3);
    let third_convergent = thirdOrderConvergent(planet_cf);
    writeLine(`Calendar has approximately ${third_convergent[0]} leap days every ${third_convergent[1]} years.`);
    if (moon_periods.length > 0) {
        writeLine(`There are ${moon_periods.length} moons. Using principal moon.`);
        let moon_day_period = Physic.secondsToDays(moon_periods[0], planetDayDuration);
        if (planetToEarthDays != 1) {
            let moon_earth_days = Math.floor(moon_day_period * planetToEarthDays);
            writeLine(`Principal Moon Period is ${moon_day_period} (almost ${moon_earth_days} Earth Days)`);
        } else {
            writeLine(`Principal Moon Period is ${moon_day_period}`);
        }
        let month_days = Math.floor(Physic.secondsToDays(moon_periods[0], planetDayDuration));
        let lunar_months = Math.floor(year_days / month_days);
        let days_remainder = year_days - lunar_months * month_days;
        writeLine(`Based on the principal satellite, we can subdivide the year into ${lunar_months} lunar months.`);
        writeLine(`This left ${days_remainder} days to be distributed.`);
        instantiateCalendar(year_days, third_convergent[0], third_convergent[1], month_days, lunar_months, 7 );
    }
}

function instantiateCalendar(year_days: number, leap: number, leap_period: number, month_base_days: number, months: number, week_days: number) {
    // For now names of days, months and other are just described with D1, M2, and so on...
    let days_remainder = year_days - months * month_base_days;
    let days_per_month = [];
    for (let i = 0; i < months; i++) {
        days_per_month.push(month_base_days);
    }
    for (let i = 0; i < days_remainder; i++) {
        days_per_month[Math.floor(Math.random()*months)] += 1;
    }
    console.log("[DEBUG] Days per Month: ")
    console.log(days_per_month);

    let week_d = 0
    for (let m = 0; m < months; m++) {
        let month_string = "";
        for (let d = 0; d< days_per_month[m]; d++) {
            month_string += `D${(week_d % week_days)+1} ${d+1} `;
            week_d++;
        }
        let month_p = $("#calendar-example").append(`<p>M${m}: ${month_string}</p>`);
    }

}

function continuedFractions(num: number, order: number): Array<number> {
    let result = [];
    let remainer = num;
    let f = 0;
    for (let i = 0; i <= order; i++) {
        result.push(Math.floor(remainer));
        f = remainer - Math.floor(remainer);
        if (Math.abs(f) < 0.001) break;
        remainer = 1 / f;
    }
    return result;
}

function thirdOrderConvergent(cf: Array<number>): [number, number] {
    return [cf[3] * cf[2] * cf[1] + 1, cf[3] * (cf[2] * cf[1] + 1) + cf[1]];
}

function notEarthDay(dayDuration: number): boolean {
    return dayDuration != 86400;
}

function handleForm() {
    console.log("Click Received. Starting Calendar Generation.");
    let star_mass = parseFloat($("#starmass").val());
    let planet_mass = parseFloat($("#planetmass").val());
    let planet_axismajor = parseFloat($("#planetaxismajor").val()) * 1000;
    let moon_mass = parseFloat($("#moonmass").val());
    let moon_axismajor = parseFloat($("#moonaxismajor").val()) * 1000;
    let day_duration = parseFloat($("#dayduration").val());
    clear();
    generateCalendarFromOrbit(planet_axismajor, planet_mass, star_mass, [{ mass: moon_mass, axis_major: moon_axismajor }], day_duration);
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

// --------------- //

init();