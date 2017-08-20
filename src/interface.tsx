import * as React from "react"
import * as ReactDOM from "react-dom"

import * as update from 'immutability-helper'

import { GeneratorInput, InputState } from "./components/input"
import { CalendarDescription } from "./components/calendar_description"
import { CalendarExample } from "./components/calendar_example"

import { extend } from "./util"

import * as Physic from "./physic"
import * as Visualization from "./visualization"
import * as CalendGen from "./calendgen"

interface CalendarGeneratorState {
    viz: Visualization.OrbitCanvas,
    description: Array<string>,
    input_values: InputState,
    calendar_data: CalendGen.GeneratorOutput | null
}

export class CalendarGenerator extends React.Component<{}, CalendarGeneratorState> {

    initial_state: InputState = {
        star_mass: Physic.sun_mass,
        planet_mass: Physic.earth_mass,
        planet_aphelion: Physic.earth_aphelion / 1000,
        planet_perihelion: Physic.earth_perihelion / 1000,
        moon_mass: Physic.moon_mass,
        moon_apogee: Physic.moon_apogee / 1000,
        moon_perigee: Physic.moon_perigee / 1000,
        day_duration: 86400,
    };

    constructor() {
        super();

        this.state = {
            viz: new Visualization.OrbitCanvas(500, 500, '#visualization'),
            description: [],
            input_values: this.initial_state,
            calendar_data: null 
        }
    }

    generateAction() {
        console.log("Click Received. Starting Calendar Generation.");
        let star_mass = this.state.input_values.star_mass;
        let planet_mass = this.state.input_values.planet_mass;
        let planet_perihelion = this.state.input_values.planet_aphelion * 1000;
        let planet_aphelion = this.state.input_values.planet_aphelion * 1000;
        let moon_mass = this.state.input_values.moon_mass;
        let moon_perigee = this.state.input_values.moon_perigee * 1000;
        let moon_apogee = this.state.input_values.moon_apogee * 1000;
        let day_duration = this.state.input_values.day_duration;
        let system_parameters = {
            planet: {
                mass: planet_mass,
                rotation: day_duration,
                orbit: {
                    periapsis: planet_perihelion,
                    apoapsis: planet_aphelion,
                }
            },
            star_mass: star_mass,
            satellites: [
                {
                    mass: moon_mass,
                    rotation: day_duration,
                    orbit: {
                        periapsis: moon_perigee,
                        apoapsis: moon_apogee,
                    }
                }
            ]
        };
        let e = (planet_aphelion - planet_perihelion) / (planet_aphelion + planet_perihelion);
        this.state.viz.draw_orbit(e);
        this.state.viz.draw_seasons(e, Math.atan2(6, 4));
        let result = CalendGen.generateCalendarFromOrbit(system_parameters);
        this.setDescriptions(result.calendar.description);
        this.setState({calendar_data: result});
    }

    componentDidMount() {
        let planet_perihelion = this.state.input_values.planet_perihelion * 1000;
        let planet_aphelion = this.state.input_values.planet_aphelion * 1000;
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

    handleInputUpdate(id: string, new_value: number) {
        this.setState({ input_values: update(this.state.input_values, { [id]: { $set: new_value } }) });
    }

    render() {
        return (
            <div>
                <GeneratorInput {...extend(this.initial_state, { onClick: () => this.runGeneration(), onChange: (id, v) => this.handleInputUpdate(id, v) }) } />
                <CalendarDescription description={this.state.description} />
                { (this.state.calendar_data !== null) ? <CalendarExample calendar={this.state.calendar_data.calendar} days_per_week={7} seasons={this.state.calendar_data.seasons}/> : false }
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