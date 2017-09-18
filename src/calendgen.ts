import * as Newton from "./newton"
import { OrbitalBody, orbital_period, secondsToDays, eccentricity } from "./physic";

/**
 * `SystemParameters` describes the parameters for a planet in star system.
 * 
 * It includes the star mass, and the planet and satellites orbital information.
 */
interface SystemParameters {
    readonly planet: OrbitalBody                        /// The planet.
    readonly satellites: ReadonlyArray<OrbitalBody>     /// A list of satellites.
}

/**
 * The output data for the actual calendar.
 */
interface CalendarParameters {
    readonly days_per_year: number           /// Number of days in a year.
    readonly moon_day_period: number         /// Number of days in a principal moon revolution.
    readonly months_per_year: number         /// How many moon revolutions there are in a year.
    readonly base_days_per_month: number     /// Number of days in a principal moon revolution (floored). // TODO: This is probably superfluous.
    readonly leap: LeapYearData              /// Information about leap days.
}

/**
 * Store information on the lunar phases of a single moon.
 * 
 * All time correspond to the FIRST occurrence from time zero.
 * Values are expressed in seconds.
 */
export interface LunarPhases {
    readonly full_moon: number
    readonly new_moon: number
    readonly third_quart: number
    readonly first_quart: number
}

/**
 * Represent LeapYear information. 
 */
interface LeapYearData { leap_total_days: number, leap_period: number }

/**
 * Output of the calendar generator. // TODO: Probably superfluous.
 */
export interface CalendarGeneratorOutput {
    readonly calendar_parameters: CalendarParameters
}

/**
 * Computed astronomical season-related events.
 */
export interface SeasonsParameters {
    readonly spring_equinox: number, /// Time in seconds for the first equinox.
    readonly summer_solstice: number,
    readonly autumn_equinox: number,
    readonly winter_solstice: number
}

/**
 * Encapsulate the global generator output.
 */
export interface GeneratorOutput {
    readonly calendar: CalendarGeneratorOutput,
    readonly seasons: SeasonsParameters,
    readonly lunar_phases: LunarPhases
}

/**
 * The main calendar generator function
 * @param system_data The input star system data for the planet.
 * @returns An instance of a generated calendar for the planet.
 */
export function generateCalendarFromOrbit(system_data: SystemParameters): GeneratorOutput {
    const planet_day_duration = system_data.planet.rotation;

    // Compute planet orbital period.
    let planet_year = orbital_period(system_data.planet);

    let moon_periods: Array<number> = [];
    // Compute moon periods.
    for (let moon of system_data.satellites) {
        moon_periods.push(orbital_period(moon));
    }

    const seasons = compute_seasons(system_data.planet, 6, 4);
    const calendar = generateCalendarFromPeriod(planet_year, moon_periods, planet_day_duration);
    const lunar_phases = computeLunarPhases(system_data.planet, system_data.satellites[0], calendar);
    return { calendar, seasons, lunar_phases };
}

function generateCalendarFromPeriod(planet_period: number, moon_periods: Array<number>, planet_day_duration: number = 86400): CalendarGeneratorOutput {
    let year_days_full = secondsToDays(planet_period, planet_day_duration);
    let year_days = Math.floor(year_days_full);

    // Compute Leap Years.
    let planet_cf = continuedFractions(year_days_full, 3);
    let third_convergent = thirdOrderConvergent(planet_cf);

    let output_parameters: CalendarParameters = {
        days_per_year: 365,
        moon_day_period: 0,
        leap: { leap_total_days: 2, leap_period: 3 },
        months_per_year: 12,
        base_days_per_month: 30
    };

    if (moon_periods.length > 0) {
        // TODO: For now, there is only one moon. In the future we may support multiple moons.
        let moon_day_period = secondsToDays(moon_periods[0], planet_day_duration);
        let month_days = Math.floor(secondsToDays(moon_periods[0], planet_day_duration));
        let lunar_months = Math.floor(year_days / month_days);
        // let days_remainder = year_days - lunar_months * month_days;

        output_parameters = {
            days_per_year: year_days,
            leap: { leap_total_days: third_convergent[0], leap_period: third_convergent[1] },
            months_per_year: lunar_months,
            moon_day_period: moon_day_period,
            base_days_per_month: month_days
        }
    }
    return { calendar_parameters: output_parameters };
}

/**
 * Given the input and the output, produces a textual description of the planet calendar.
 * @param input_parameters The star system input parameters.
 * @param output_calendar The output of the calendar generation.
 * @returns A textual description of the planed calendar.
 */
export function describeCalendar(input_parameters: SystemParameters, output_calendar: GeneratorOutput): Array<string> {
    let calendar_description: Array<string> = [];

    const planet_day_duration = input_parameters.planet.rotation;
    const planetToEarthDays = planet_day_duration / 86400;
    const year_days = output_calendar.calendar.calendar_parameters.days_per_year;
    if (planetToEarthDays != 1) {
        const earth_days = year_days * planetToEarthDays;
        calendar_description.push(`Generating a calendar for a planet with a year of ${year_days} days (about ${earth_days} Earth Days).`);
    } else {
        calendar_description.push(`Generating a calendar for a planet with a year of ${year_days} days`);
    }

    const leap_days = output_calendar.calendar.calendar_parameters.leap.leap_total_days;
    const leap_period = output_calendar.calendar.calendar_parameters.leap.leap_period;
    calendar_description.push(`Calendar has approximately ${leap_days} leap days every ${leap_period} years.`);

    const moon_day_period = output_calendar.calendar.calendar_parameters.moon_day_period;
    if (planetToEarthDays != 1) {
        let moon_earth_days = moon_day_period * planetToEarthDays;
        calendar_description.push(`Principal Moon Period is ${moon_day_period} (about ${moon_earth_days} Earth Days)`);
    } else {
        calendar_description.push(`Principal Moon Period is ${moon_day_period}`);
    }

    const lunar_months = output_calendar.calendar.calendar_parameters.months_per_year;
    calendar_description.push(`Based on the principal satellite, we can subdivide the year into ${lunar_months} lunar months.`);
    let days_remainder = year_days - lunar_months * output_calendar.calendar.calendar_parameters.base_days_per_month;
    calendar_description.push(`This leaves us with ${days_remainder} days to be distributed.`);

    return calendar_description;
}

/**
 * Computes the continued fraction representation of a given number.
 * @param num The input fractional number 
 * @param order The desired order of the continued fraction
 */
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

/**
 * Compute the third-order convergent for a number expressed as a continued fraction.
 * @param cf The continued fractions representation of a number.
 * @returns The numerator and denominator of the third-order convergent.
 */
function thirdOrderConvergent(cf: Array<number>): [number, number] {
    return [cf[3] * cf[2] * cf[1] + 1, cf[3] * (cf[2] * cf[1] + 1) + cf[1]];
}

// SEASONS
export function compute_seasons(body: OrbitalBody, A: number, B: number) : SeasonsParameters {
    const e = eccentricity(body.orbit);
    const period = orbital_period(body);
    let E = Newton.NewtonRoot(
        (x) => (B * (Math.cos(x) - e) - A * (Math.sqrt(1 - e * e) * Math.sin(x))),
        (x) => -(B * Math.sin(x) + A * (Math.sqrt(1 - e * e)) * Math.cos(x)),
        1, 0.01);
    let E2 = E + Math.PI / 2;
    let E3 = E + Math.PI;
    let E4 = E + (3 / 2) * Math.PI;
    return {
        spring_equinox: (period / (2 * Math.PI)) * (E - e * Math.sin(E)),
        summer_solstice: (period / (2 * Math.PI)) * (E2 - e * Math.sin(E2)),
        autumn_equinox: (period / (2 * Math.PI)) * (E3 - e * Math.sin(E3)),
        winter_solstice: (period / (2 * Math.PI)) * (E4 - e * Math.sin(E4))
    };

}

// LUNAR PHASES
export function computeLunarPhases(planet: OrbitalBody, moon: OrbitalBody, calendar: CalendarGeneratorOutput): LunarPhases {
    const moon_period = calendar.calendar_parameters.moon_day_period;
    // Compute first full moon.
    // Full moons occurs when the moon is aligned with the SUN-PLANET axis.
    // This is equivalent of saying that the full moon occurs when the  true anomaly of the moon orbit is 0.
    // FM = kP (where P is the orbital period and k is an integer)
    const full_moon_time = 0;
    // Compute first new moon.
    // This occurs when the moon is in opposition to the SUN-PLANET axis.
    // This is equivalent of saying that the new moon occurs when the true anomaly of the moon orbit is PI.
    // NM = P/2 + kP
    // (Note that Mean Anomaly, Eccentric Anomaly and True Anomaly are equivalent on 0 and PI)
    const new_moon_time = Math.floor(moon_period / 2);
    // Compute the third quart.
    // this occur when MOON-PLANET axis is perpendicular to the SUN-PLANET orbit.
    // This is equivalent of saying that the third quarter occurs when the true anomaly of the moon orbit is PI/2.
    // In this case MA, EA, and TA **do not match**. The formula is more complex.
    const moon_apoapsis = moon.orbit.apoapsis;
    const moon_periapsis = moon.orbit.periapsis;
    const e = (moon_apoapsis - moon_periapsis) / (moon_apoapsis + moon_periapsis);
    const gamma = Math.sqrt((1 + e) / (1 - e));
    const third_quart_time = Math.floor(moon_period * (1 / Math.PI) * Math.atan(1 / gamma) - e * ((2 * gamma) / (gamma * gamma) + 1));
    // Compute the first quart.
    // this occur when MOON-PLANET axis is anti-perpendicular to the SUN-PLANET orbit.
    // This is equivalent of saying that the third quarter occurs when the true anomaly of the moon orbit is -PI/2.
    // In this case MA, EA, and TA **do not match**. The formula is more complex.
    const first_quart_time = Math.floor(-third_quart_time + moon_period); // TODO: Check this.

    return { full_moon: full_moon_time, new_moon: new_moon_time, first_quart: first_quart_time, third_quart: third_quart_time };

}