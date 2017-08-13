import * as React from "react";

export interface GeneratorInputProps {
    star_mass: number,
    planet_mass: number,
    planet_perihelion: number,
    planet_aphelion: number,
    day_duration: number,
    moon_mass: number,
    moon_perigee: number,
    moon_apogee: number
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
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
                    <p>
                        Star Mass (Kg):
                <input type="text" id="starmass" defaultValue={this.props.star_mass.toString()} />
                    </p>
                    <p>
                        Planet Mass (Kg):
                <input type="text" id="planetmass" defaultValue={this.props.planet_mass.toString()}/>
                    </p>
                    <p>
                        Planet Perihelion (Km):
                <input type="text" id="planetperihelion"  defaultValue={this.props.planet_perihelion.toString()} />
                    </p>
                    <p>
                        Planet Aphelion (Km):
                <input type="text" id="planetaphelion"  defaultValue={this.props.planet_perihelion.toString()} />
                    </p>
                    <p>
                        Planet's Day Duration in Seconds:
                <input type="number" id="dayduration" defaultValue={this.props.day_duration.toString()} />
                    </p>
                    <p>
                        Moon Mass (Kg):
                <input type="text" id="moonmass" defaultValue={this.props.moon_mass.toString()} />
                    </p>
                    <p>
                        Moon Perigee (Km):
                <input type="text" id="moonperigee" defaultValue={this.props.moon_perigee.toString()} />
                    </p>
                    <p>
                        Moon Apogee (Km):
                <input type="text" id="moonapogee" defaultValue={this.props.moon_apogee.toString()} />
                    </p>
                    <p><button id="generateButton" type="button">Generate</button></p>
                </form>
            </div>
        );
    }
}