import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/test";
import { GeneratorInput, GeneratorInputProps } from "./components/input";

import * as Physic from "./physic"

export function initializeComponents() {

    const initial_values: GeneratorInputProps = {
        star_mass: Physic.sun_mass,
        planet_mass: Physic.earth_mass,
        planet_aphelion: Physic.earth_aphelion,
        planet_perihelion: Physic.earth_perihelion,
        moon_mass: Physic.moon_mass,
        moon_apogee: Physic.moon_apogee,
        moon_perigee: Physic.moon_perigee,
        day_duration: 86400
    }

    ReactDOM.render(
        <GeneratorInput {...initial_values} />,
        document.getElementById("generator")
    );
}