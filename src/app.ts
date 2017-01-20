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
        console.log(`Generating a calendar for a planet with a year of ${year_days} days (${earth_days} Earth Days).`);
    } else {
        console.log(`Generating a calendar for a planet with a year of ${year_days} days`);
    }
    let planet_cf = continuedFractions(year_days_full, 3);
    let third_convergent = thirdOrderConvergent(planet_cf);
    console.log(`Calendar has approximately ${third_convergent[0]} leap days every ${third_convergent[1]} years.`);
    if (moon_periods.length > 0) {
        console.log(`There are ${moon_periods.length} moons. Using principal moon.`);
        let moon_day_period = Physic.secondsToDays(moon_periods[0], planetDayDuration);
        if (planetToEarthDays != 1) {
            let moon_earth_days = Math.floor(moon_day_period * planetToEarthDays);
            console.log(`Principal Moon Period is ${moon_day_period} (almost ${moon_earth_days} Earth Days)`);
        }else {
            console.log(`Principal Moon Period is ${moon_day_period}`);
        }
        let month_days = Math.floor(Physic.secondsToDays(moon_periods[0], planetDayDuration));
        let lunar_months = Math.floor(year_days / month_days);
        let days_remainder = year_days - lunar_months * month_days;
        console.log(`Based on the principal satellite, we can subdivide the year into ${lunar_months} lunar months.`);
        console.log(`This left ${days_remainder} days to be distributed.`);
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

// --------------- //

generateCalendarFromOrbit(Physic.earth_axmj, Physic.earth_mass, Physic.sun_mass, [{ mass: Physic.moon_mass, axis_major: Physic.moon_axmj }], 80000);