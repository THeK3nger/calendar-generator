import * as Physic from "physic"

interface MoonData {
    axis_major: number,
    mass: number
}

interface PlanetData { axis_major: number, mass: number, day_duration: number }

interface LeapYearData { leap_total_days: number, leap_period: number }

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
    const planet_axis_major = planet_data.axis_major;
    const planet_mass = planet_data.mass;
    const planet_day_duration = planet_data.day_duration;

    // Compute planet orbital period.
    let planet_year = Physic.orbital_period(sun_mass, planet_axis_major, planet_mass, );

    let moon_periods = [];
    // Compute moon periods.
    for (let moon of moons) {
        moon_periods.push(Physic.orbital_period(planet_mass, moon.axis_major, moon.mass));
    }

    return generateCalendarFromPeriod(planet_year, moon_periods, planet_day_duration);
}

function generateCalendarFromPeriod(planet_period: number, moon_periods: Array<number>, planet_day_duration: number = 86400): CalendarGeneratorOutput {
    let calendar_description = [];

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

    let output_parameters: CalendarParameters;

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
        calendar_description.push(`This left ${days_remainder} days to be distributed.`);

        output_parameters = {
            days_per_year: year_days,
            leap: { leap_total_days: third_convergent[0], leap_period: third_convergent[1] },
            months_per_year: lunar_months,
            base_days_per_month: month_days
        }
        instantiateCalendar(output_parameters, 7);
    }
    return { description: calendar_description, calendar_parameters: output_parameters };
}

function instantiateCalendar(calendar_parameter: CalendarParameters, days_per_week: number) {
    const year_days = calendar_parameter.days_per_year;
    const months = calendar_parameter.months_per_year;
    const month_base_days = calendar_parameter.base_days_per_month;

    let day_names = ["A", "B", "C", "D", "E", "F", "G"]

    // For now names of days, months and other are just described with D1, M2, and so on...
    let days_remainder = year_days - months * month_base_days;
    let days_per_month = [];
    for (let i = 0; i < months; i++) {
        days_per_month.push(month_base_days);
    }
    for (let i = 0; i < days_remainder; i++) {
        days_per_month[Math.floor(Math.random() * months)] += 1;
    }
    console.log("[DEBUG] Days per Month: ")
    console.log(days_per_month);

    let week_d = 0
    for (let m = 0; m < months; m++) {
        let month_string = "";
        for (let d = 0; d < days_per_month[m]; d++) {
            month_string += `${day_names[(week_d % days_per_week)]} ${d + 1} `;
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