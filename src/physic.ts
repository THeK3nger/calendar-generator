export const G: number = 6.674e-11;

export const sun_mass = 1.989e30;
export const earth_mass = 5.972e24;
export const moon_mass = 7.348e22;

/** AXIS MAJOR CONSTANTS */
export const earth_axmj = 149598023e3;
export const moon_axmj = 384399e03;

/** CONVERTER FUNCTION */

export function toAstronomicalUnit(meters: number): number {
    return meters / 149597870700;
}

export function toMeters(astronomicalunits: number): number {
    return astronomicalunits * 149597870700;
}

export function secondsToDays(seconds: number, daySecondDuration: number = 86400): number {
    return seconds / daySecondDuration;
}

/**
 * Compute the orbital period of a planetary object around another mass. 
 */
export function orbital_period(mass: number, major_axis: number, second_mass: number = 0.0): number {
    return 2 * Math.PI * (Math.sqrt(Math.pow(major_axis, 3) / ((mass + second_mass) * G)));
}
