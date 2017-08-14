import * as Physic from "./physic"
import * as Newton from "./newton"

interface MoonData {
    periapsis: number,
    apoapsis: number,
    mass: number
}

interface PlanetData {
    periapsis: number,
    apoapsis: number,
    mass: number,
    day_duration: number
}

interface LeapYearData { leap_total_days: number, leap_period: number }

/**
 * Define the orbital parameters in a two-body problem.
 */
interface OrbitalParameters {
    eccentricity: number, // Shape of the ellipse, describing how much it is elongated compared to a circle.
    semimajor_axis: number, // The sum of the periapsis and apoapsis distances divided by two.
    inclination: number, // Vertical tilt of the ellipse with respect to the reference plane.
    ascending_node: number, // horizontally orients the ascending node of the ellipse with respect to the reference frame's vernal point.
    argument_of_periapsis: number, // defines the orientation of the ellipse in the orbital plane
}

interface CalendarParameters {
    days_per_year: number,
    months_per_year: number,
    base_days_per_month: number,
    leap: LeapYearData
};

interface CalendarGeneratorOutput {
    description: string[],
    calendar_parameters: CalendarParameters
};

export function generateCalendarFromOrbit(planet_data: PlanetData, sun_mass: number, moons: Array<MoonData>): CalendarGeneratorOutput {
    const planet_axis_major = (planet_data.periapsis + planet_data.apoapsis) / 2;
    const planet_mass = planet_data.mass;
    const planet_day_duration = planet_data.day_duration;
    const eccentricity = (planet_data.apoapsis - planet_data.periapsis) / (planet_data.apoapsis + planet_data.periapsis);

    // Compute planet orbital period.
    let planet_year = Physic.orbital_period(sun_mass, planet_axis_major, planet_mass);

    let moon_periods: Array<number> = [];
    // Compute moon periods.
    for (let moon of moons) {
        let moon_axis_major = (moon.periapsis + moon.apoapsis) / 2
        moon_periods.push(Physic.orbital_period(planet_mass, moon_axis_major, moon.mass));
    }

    const seasons = computeSeasons(0, 6, 4, eccentricity, planet_year);
    const calendar = generateCalendarFromPeriod(planet_year, moon_periods, planet_day_duration);
    //instantiateCalendar(calendar, 7, seasons);
    return calendar;
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
    }

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

function generateMonthTableHeader(month_table: JQuery, days_per_week: number, day_names: String[]) {
    let month_table_header = "";
    for (let d = 0; d < days_per_week; d++) {
        month_table_header += `<td>${day_names[d]}</td>`;
    }
    month_table.append(`<tr>${month_table_header}</tr>`);
}

function generateMonthTableContents(month_table: JQuery, starting_week_day: number, days_per_week, days_per_month: Array<number>, current_month: number, season_days: undefined | number = undefined): number {
    let week_d = starting_week_day;
    let m = current_month;
    let table_day_index = -(week_d % days_per_week); // This is used for aligning the first day to the current week day.
    let row_day_split = 0;
    let month_week_line = ""
    // Fill the empty cells at the begining of the month.
    // This depends on the starting week day for the current month.
    while (table_day_index < 0) {
        month_week_line += "<td></td>";
        row_day_split++;
        table_day_index++;
    }
    // Now fill the actual table.
    for (let dm = 0; dm < days_per_month[m]; dm++) {
        if (season_days === dm) {
            month_week_line += `<td style="color: red">${dm + 1}</td>`;
        } else {
            month_week_line += `<td>${dm + 1}</td>`;
        }
        table_day_index++;
        week_d++;
        row_day_split++;
        if (row_day_split >= days_per_week) {
            row_day_split = row_day_split - days_per_week;
            month_table.append(`<tr>${month_week_line}</tr>`);
            month_week_line = "";
        }
    }
    // Fill the remaining cells in the last row (if any).
    while (row_day_split != 0 && row_day_split < days_per_week) {
        month_week_line += "<td></td>";
        row_day_split++;
        table_day_index++;
    }
    if (month_week_line != "") {
        month_table.append(`<tr>${month_week_line}</tr>`);
    }
    return week_d % days_per_week;
}

function instantiateCalendar(calendar: CalendarGeneratorOutput, days_per_week: number, seasons: SeasonsParameters) {
    $("#calendar-example div").remove();
    const calendar_parameter = calendar.calendar_parameters;

    const year_days = calendar_parameter.days_per_year;
    const months = calendar_parameter.months_per_year;
    const month_base_days = calendar_parameter.base_days_per_month;

    let day_names = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

    // Allocate all the spare days into random months.
    let days_remainder = year_days - months * month_base_days;
    let days_per_month: Array<number> = [];
    for (let i = 0; i < months; i++) {
        days_per_month.push(month_base_days);
    }
    for (let i = 0; i < days_remainder; i++) {
        days_per_month[Math.floor(Math.random() * months)] += 1;
    }
    console.log("[DEBUG] Days per Month: ")
    console.log(days_per_month);
    console.log(seasons);

    let spring_equinox = Math.floor(seasons.spring_equinox / 86400); // TODO: Get this from the parameter.
    let spring_month = 0;
    for (let i = 0; i < months; i++) {
        if (spring_equinox < days_per_month[i]) {
            break;
        }
        spring_equinox -= days_per_month[i];
        spring_month = i;
    }

    let summer_solstice = Math.floor(seasons.summer_solstice / 86400); // TODO: Get this from the parameter.
    let summer_month = 0;
    for (let i = 0; i < months; i++) {
        if (summer_solstice < days_per_month[i]) {
            break;
        }
        summer_solstice -= days_per_month[i];
        summer_month = i;
    }

    let autumn_equinox = Math.floor(seasons.autumn_equinox / 86400); // TODO: Get this from the parameter.
    let autumn_month = 0;
    for (let i = 0; i < months; i++) {
        if (autumn_equinox < days_per_month[i]) {
            break;
        }
        autumn_equinox -= days_per_month[i];
        autumn_month = i;
    }

    let winter_solstice = Math.floor(seasons.winter_solstice / 86400); // TODO: Get this from the parameter.
    let winter_month = 0;
    for (let i = 0; i < months; i++) {
        if (winter_solstice < days_per_month[i]) {
            break;
        }
        winter_solstice -= days_per_month[i];
        winter_month = i;
    }

    calendar.description.push(`Spring Equinox occurs in the ${spring_month + 1}th month on the ${spring_equinox + 1}th day.`);
    calendar.description.push(`Summer Solstice occurs in the ${summer_month + 1}th month on the ${summer_solstice + 1}th day.`);
    calendar.description.push(`Spring Equinox occurs in the ${autumn_month + 1}th month on the ${autumn_equinox + 1}th day.`);
    calendar.description.push(`Spring Equinox occurs in the ${winter_month + 1}th month on the ${winter_solstice + 1}th day.`);

    console.log(`SpringEquinox = ${spring_month} ${spring_equinox + 1}th`);

    let week_d = 0
    for (let m = 0; m < months; m++) {
        let month_div = $(`<div class="month"></div>`);
        month_div.append(`<h4>Month ${m + 1}</h4>`)
        let month_table = $(`<table border="1"></table>`);
        generateMonthTableHeader(month_table, days_per_week, day_names);

        if (m === spring_month)
            week_d = generateMonthTableContents(month_table, week_d, days_per_week, days_per_month, m, spring_equinox);
        else
            week_d = generateMonthTableContents(month_table, week_d, days_per_week, days_per_month, m);

        month_table.appendTo(month_div);
        month_div.appendTo("#calendar-example");
    }
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

interface SeasonsParameters {
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