import * as Physic from "physic"

type Moon = {mass: number, axis_major: number}

function generateCalendarFromOrbit(planet_axis_major: number, planet_mass: number, sun_mass: number, moons: Array<Moon>) {
    // Compute planet orbital period.
    let planet_year = Physic.orbital_period(sun_mass, planet_axis_major, planet_mass);

    let moon_periods = [];
    // Compute moon periods.
    for (let moon of moons) {
        moon_periods.push(Physic.orbital_period(planet_mass, moon.axis_major, moon.mass));
    }

    return generateCalendarFromPeriod(planet_year, moon_periods);
}

function generateCalendarFromPeriod(planet_period: number, moon_periods: Array<number>) {
    let year_days = Math.floor(Physic.secondsToDays(planet_period));
    console.log(`Generating a calendar for a planet with a year of ${year_days} days`);
    if (moon_periods.length > 0) {
        console.log(`There are ${moon_periods.length} moons. Using principal moon.`);
        console.log(`Principal Moon Period is ${Physic.secondsToDays(moon_periods[0])}`);
    }
    let planet_cf = continuedFractions(planet_period, 3);
    let third_convergent = thirdOrderConvergent(planet_cf);
    console.log(`Calendar has approximately ${third_convergent[0]} leap days every ${third_convergent[1]} years.`);
    if (moon_periods.length > 0) {
        let month_days = Math.floor(Physic.secondsToDays(moon_periods[0]));
        let lunar_months = Math.floor(year_days/month_days);
        let days_remainder =  year_days - lunar_months*month_days;
        console.log(`Based on the principal satellite, we can subdivide the year into ${lunar_months} lunar months.`);
        console.log(`This left ${days_remainder} days to be distributed.`);
    }
    
}

function continuedFractions(num: number, order: number): Array<number> {
    let result = [];
    let remainer = num;
    let f = 0;
    for (let i=0; i<=order; i++) {
        result.push(Math.floor(remainer));
        f = remainer - Math.floor(remainer);
        if (Math.abs(f) < 0.001) break;
        remainer = 1/f;
    }
    return result;
}

function thirdOrderConvergent(cf: Array<number>): [number, number] {
    return [cf[3]*cf[2]*cf[1] + 1, cf[3]*(cf[2]*cf[1] + 1) + cf[1]];
}

// --------------- //

generateCalendarFromOrbit(Physic.earth_axmj, Physic.earth_mass, Physic.sun_mass, [{mass: Physic.moon_mass, axis_major: Physic.moon_axmj}]);