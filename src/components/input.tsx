import * as React from "react";

import { NumericTextInputProps, NumericTextInput } from "./numeric_text_input";

export interface GeneratorInputProps {
    star_mass: number,
    planet_mass: number,
    planet_perihelion: number,
    planet_aphelion: number,
    day_duration: number,
    moon_mass: number,
    moon_perigee: number,
    moon_apogee: number,
    onClick: () => void
}

export class GeneratorInput extends React.Component<GeneratorInputProps, {}> {

    initial_values: GeneratorInputProps;

    constructor(props: GeneratorInputProps) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div id="input">
                <form id="formInputs">
                    <NumericTextInput id="starmass" label="Star Mass (Kg)" defaultValue={this.props.star_mass} />
                    <NumericTextInput id="planetmass" label="Planet Mass (Kg)" defaultValue={this.props.planet_mass} />
                    <NumericTextInput id="planetperihelion" label="Planet Perihelion (Km)" defaultValue={this.props.planet_perihelion} />
                    <NumericTextInput id="planetaphelion" label="Planet Aphelion (Km)" defaultValue={this.props.planet_aphelion} />
                    <NumericTextInput id="dayduration" label="Planet's Day Duration in Seconds" defaultValue={this.props.day_duration} />
                    <NumericTextInput id="moonmass" label="Moon Mass (Kg)" defaultValue={this.props.moon_mass} />
                    <NumericTextInput id="moonperigee" label="Moon Perigee (Km)" defaultValue={this.props.moon_perigee} />
                    <NumericTextInput id="moonapogee" label="Moon Apogee (Kg)" defaultValue={this.props.moon_apogee} />
                    <p><button id="generateButton" type="button" onClick={() => this.props.onClick() }>Generate</button></p>
                </form>
            </div>
        );
    }
}