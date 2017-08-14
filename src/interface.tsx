import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/test";
import { GeneratorInput, GeneratorInputProps } from "./components/input";
import { CalendarDescription } from "./components/calendar_description";

import * as Physic from "./physic"
import * as Visualization from "./visualization"
import * as CalendGen from "./calendgen"

interface CalendarGeneratorState {
    viz: Visualization.OrbitCanvas,
    description: Array<string>
}

export class CalendarGenerator extends React.Component<{}, CalendarGeneratorState> {

    initial_values: GeneratorInputProps = {
        star_mass: Physic.sun_mass,
        planet_mass: Physic.earth_mass,
        planet_aphelion: Physic.earth_aphelion,
        planet_perihelion: Physic.earth_perihelion,
        moon_mass: Physic.moon_mass,
        moon_apogee: Physic.moon_apogee,
        moon_perigee: Physic.moon_perigee,
        day_duration: 86400,
        onClick: () => this.runGeneration()
    }

    constructor() {
        super();

        this.state = {
            viz: new Visualization.OrbitCanvas(500, 500, '#visualization'),
            description: []
        }
    }

    generateAction() {
        console.log("Click Received. Starting Calendar Generation.");
        let star_mass = parseFloat($("#starmass").val());
        let planet_mass = parseFloat($("#planetmass").val());
        let planet_perihelion = parseFloat($("#planetperihelion").val()) * 1000;
        let planet_aphelion = parseFloat($("#planetaphelion").val()) * 1000;
        let moon_mass = parseFloat($("#moonmass").val());
        let moon_perigee = parseFloat($("#moonperigee").val()) * 1000;
        let moon_apogee = parseFloat($("#moonapogee").val()) * 1000;
        let day_duration = parseFloat($("#dayduration").val());
        let planet_data = {
            periapsis: planet_perihelion,
            apoapsis: planet_aphelion,
            mass: planet_mass,
            day_duration: day_duration
        };
        let e = (planet_aphelion - planet_perihelion) / (planet_aphelion + planet_perihelion);
        this.state.viz.draw_orbit(e);
        this.state.viz.draw_seasons(e, Math.atan2(6, 4));
        let result = CalendGen.generateCalendarFromOrbit(planet_data, star_mass, [{ mass: moon_mass, periapsis: moon_perigee, apoapsis: moon_perigee }]);
        this.setDescriptions(result.description);
    }

    componentDidMount() {
        let planet_perihelion = parseFloat($("#planetperihelion").val());
        let planet_aphelion = parseFloat($("#planetaphelion").val());
        let e = (planet_aphelion - planet_perihelion) / (planet_aphelion + planet_perihelion);
        let equinox_angle = Math.atan2(6, 4);
    
        this.state.viz.draw_orbit(e);
        this.state.viz.draw_seasons(e, equinox_angle);
    }

    setDescriptions(description) {
        this.setState({
            description: description
        });
    }

    runGeneration() {
        console.log("CLICK");
        this.generateAction();
    }

    render() {
        return (
            <div>
                <GeneratorInput {...this.initial_values} />
                <CalendarDescription description={this.state.description} />
            </div>
        );
    }
}

export function initializeComponents() {

    ReactDOM.render(
        <CalendarGenerator />,
        document.getElementById("generator")
    );
}