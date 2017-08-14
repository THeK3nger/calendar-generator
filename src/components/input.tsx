import * as React from "react";

import { NumericTextInputProps, NumericTextInput } from "./numeric_text_input";

export interface InputState {
    star_mass: number,
    planet_mass: number,
    planet_perihelion: number,
    planet_aphelion: number,
    day_duration: number,
    moon_mass: number,
    moon_perigee: number,
    moon_apogee: number
}

export type GeneratorInputProps = InputState & { onClick: () => void, onChange: (id, value) => void }

export class GeneratorInput extends React.Component<GeneratorInputProps, {}> {

    constructor(props: GeneratorInputProps) {
        super(props);
        this.props = props;
    }

    handleOnChange(id: string, new_value: number) {
        console.log(`Update input value for ${id} with value ${new_value}`);
        this.props.onChange(id, new_value);
    }

    render() {
        return (
            <div id="input">
                <form id="formInputs">
                    <NumericTextInput id="star_mass" label="Star Mass (Kg)" defaultValue={this.props.star_mass} onChange={(s,n) => this.handleOnChange(s,n)}/>
                    <NumericTextInput id="planet_mass" label="Planet Mass (Kg)" defaultValue={this.props.planet_mass} onChange={(s,n) => this.handleOnChange(s,n)} />
                    <NumericTextInput id="planet_perihelion" label="Planet Perihelion (Km)" defaultValue={this.props.planet_perihelion} onChange={(s,n) => this.handleOnChange(s,n)} />
                    <NumericTextInput id="planet_aphelion" label="Planet Aphelion (Km)" defaultValue={this.props.planet_aphelion} onChange={(s,n) => this.handleOnChange(s,n)} />
                    <NumericTextInput id="day_duration" label="Planet's Day Duration in Seconds" defaultValue={this.props.day_duration} onChange={(s,n) => this.handleOnChange(s,n)}/>
                    <NumericTextInput id="moon_mass" label="Moon Mass (Kg)" defaultValue={this.props.moon_mass} onChange={(s,n) => this.handleOnChange(s,n)}/>
                    <NumericTextInput id="moon_perigee" label="Moon Perigee (Km)" defaultValue={this.props.moon_perigee} onChange={(s,n) => this.handleOnChange(s,n)}/>
                    <NumericTextInput id="moon_apogee" label="Moon Apogee (Kg)" defaultValue={this.props.moon_apogee}onChange={(s,n) => this.handleOnChange(s,n)} />
                    <p><button id="generateButton" type="button" onClick={() => this.props.onClick() }>Generate</button></p>
                </form>
            </div>
        );
    }
}