import * as Physic from "./physic"
import * as Newton from "./newton"

interface LeapYearData { leap_total_days: number, leap_period: number }

interface OrbitalBody {
    mass: number
    rotation: number
    orbit: OrbitalParameters
}

interface SystemParameters {
    planet: OrbitalBody
    star_mass: number
    satellites: Array<OrbitalBody>
}

/**
 * Define the orbital parameters in a two-body problem.
 */
interface OrbitalParameters {
    periapsis: number,
    apoapsis: number,
    inclination?: number,
}

interface CalendarParameters {
    days_per_year: number,
    months_per_year: number,
    base_days_per_month: number,
    leap: LeapYearData
}

export interface CalendarGeneratorOutput {
    description: string[],
    calendar_parameters: CalendarParameters
}

export interface GeneratorOutput {
    calendar: CalendarGeneratorOutput,
    seasons: SeasonsParameters
}

export function generateCalendarFromOrbit(system_data: SystemParameters): GeneratorOutput {
    const planet_apoapsis = system_data.planet.orbit.apoapsis;
    const planet_periapsis = system_data.planet.orbit.periapsis;
    const planet_axis_major = (planet_apoapsis + planet_periapsis) / 2;
    const planet_mass = system_data.planet.mass;
    const planet_day_duration = system_data.planet.rotation;
    const eccentricity = (planet_apoapsis - planet_periapsis) / (planet_apoapsis + planet_periapsis);

    // Compute planet orbital period.
    let planet_year = Physic.orbital_period(system_data.star_mass, planet_axis_major, planet_mass);

    let moon_periods: Array<number> = [];
    // Compute moon periods.
    for (let moon of system_data.satellites) {
        let moon_axis_major = (moon.orbit.periapsis + moon.orbit.apoapsis) / 2;
        moon_periods.push(Physic.orbital_period(planet_mass, moon_axis_major, moon.mass));
    }

    const seasons = computeSeasons(0, 6, 4, eccentricity, planet_year);
    const calendar = generateCalendarFromPeriod(planet_year, moon_periods, planet_day_duration);
    //instantiateCalendar(calendar, 7, seasons);
    return { calendar, seasons };
}

function generateCalendarFromPeriod(planet_period: number, moon_periods: Array<number>, planet_day_duration: number = 86400): CalendarGeneratorOutput {
    let calendar_description: Array<string> = [];

    let planetToEarthDays = planet_day_duration / 86400;
    let year_days_full = Physic.secondsToDays(planet_period, planet_day_duration);
    let year_days = Math.floor(year_days_full);
    if (planetToEarthDays != 1) {
        let earth_days = Math.floor(year_days_full * planetToEarthDays);
        calendar_description.push(`Generating a calendar for a planet with a year of ${year_days} days (${earth_days} Earth Days).`);
    } else {
        calendar_description.push(`Generating a calendar for a planet with a year of ${year_days} days`);
    }

    // Compute Leap Years.
    let planet_cf = continuedFractions(year_days_full, 3);
    let third_convergent = thirdOrderConvergent(planet_cf);
    calendar_description.push(`Calendar has approximately ${third_convergent[0]} leap days every ${third_convergent[1]} years.`);

    let output_parameters: CalendarParameters = {
        days_per_year: 365,
        leap: { leap_total_days: 2, leap_period: 3 },
        months_per_year: 12,
        base_days_per_month: 30
    };

    if (moon_periods.length > 0) {
        // TODO: For now, there is only one moon. In the future we may support multiple moons.
        // calendar_description.push(`There are ${moon_periods.length} moons. Using principal moon.`); 
        let moon_day_period = Physic.secondsToDays(moon_periods[0], planet_day_duration);
        if (planetToEarthDays != 1) {
            let moon_earth_days = Math.floor(moon_day_period * planetToEarthDays);
            calendar_description.push(`Principal Moon Period is ${moon_day_period} (almost ${moon_earth_days} Earth Days)`);
        } else {
            calendar_description.push(`Principal Moon Period is ${moon_day_period}`);
        }
        let month_days = Math.floor(Physic.secondsToDays(moon_periods[0], planet_day_duration));
        let lunar_months = Math.floor(year_days / month_days);
        let days_remainder = year_days - lunar_months * month_days;
        calendar_description.push(`Based on the principal satellite, we can subdivide the year into ${lunar_months} lunar months.`);
        calendar_description.push(`This leaves us with ${days_remainder} days to be distributed.`);

        output_parameters = {
            days_per_year: year_days,
            leap: { leap_total_days: third_convergent[0], leap_period: third_convergent[1] },
            months_per_year: lunar_months,
            base_days_per_month: month_days
        }
    }
    return { description: calendar_description, calendar_parameters: output_parameters };
}

function continuedFractions(num: number, order: number): Array<number> {
    let result: Array<number> = [];
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

// SEASONS

export interface SeasonsParameters {
    spring_equinox: number, /// Time in seconds for the first equinox.
    summer_solstice: number,
    autumn_equinox: number,
    winter_solstice: number
}

export function computeSeasons(axial_tilt: number, A: number, B: number, eccentricity: number, period: number): SeasonsParameters {
    let E = Newton.NewtonRoot(
        (x) => (B * (Math.cos(x) - eccentricity) - A * (Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(x))),
        (x) => -(B * Math.sin(x) + A * (Math.sqrt(1 - eccentricity * eccentricity)) * Math.cos(x)),
        1, 0.01);
    let E2 = E + Math.PI / 2;
    let E3 = E + Math.PI;
    let E4 = E + (3 / 2) * Math.PI;
    return {
        spring_equinox: (period / (2 * Math.PI)) * (E - eccentricity * Math.sin(E)),
        summer_solstice: (period / (2 * Math.PI)) * (E2 - eccentricity * Math.sin(E2)),
        autumn_equinox: (period / (2 * Math.PI)) * (E3 - eccentricity * Math.sin(E3)),
        winter_solstice: (period / (2 * Math.PI)) * (E4 - eccentricity * Math.sin(E4))
    };

}