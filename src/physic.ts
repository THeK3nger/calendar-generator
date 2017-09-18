export const G: number = 6.674e-11;

export const sun_mass = 1.989e30;
export const earth_mass = 5.972e24;
export const moon_mass = 7.348e22;

/** AXIS MAJOR CONSTANTS */
export const earth_perihelion = 147095e6;
export const earth_aphelion = 152100e6;
export const moon_perigee = 362600e3;
export const moon_apogee = 405400e3;

export interface MassiveBody {
    readonly mass: number /// The orbital body mass in Kg.
}

/**
 * `OrbitalBody` defines data representing information about an orbiting body of the solar system.
 * 
 * This can be referred to a planet orbiting around a star, or a satellite orbiting a planet.
 */
export interface OrbitalBody extends MassiveBody {
    readonly rotation: number            /// The rotation period in seconds.
    readonly orbit: OrbitalParameters    /// The orbital parameters.
    readonly axial_tilt?: number         /// Axial tilt for the body rotation wrt the orbital plane.
}

/**
 * Define the orbital parameters for an orbital body.
 */
export interface OrbitalParameters {
    readonly periapsis: number          /// The celestial body orbit periapsis in meters.
    readonly apoapsis: number           /// The celestial body orbit apopasis in meters.
    readonly central_body: MassiveBody  /// The massive object to which orbit is referred to.
    readonly inclination?: number       /// The inclination of the orbital plane respect to the system reference plane.
}

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
export function orbital_period(body: OrbitalBody): number {
    const orbiting_mass = body.orbit.central_body;
    const a = (body.orbit.periapsis + body.orbit.periapsis) / 2; // Semi-Major Axis
    return 2 * Math.PI * (Math.sqrt(Math.pow(a, 3) / ((body.mass + orbiting_mass.mass) * G)));
}

export function eccentricity(orbit: OrbitalParameters) {
    return (orbit.apoapsis - orbit.periapsis) / (orbit.apoapsis + orbit.periapsis);
}