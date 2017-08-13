import * as React from "react";

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class GeneratorInput extends React.Component {
    render() {
        return (
            <div id="input">
                <form id="formInputs">
                    <p>
                        Star Mass (Kg):
                <input type="text" id="starmass" />
                    </p>
                    <p>
                        Planet Mass (Kg):
                <input type="text" id="planetmass" />
                    </p>
                    <p>
                        Planet Perihelion (Km):
                <input type="text" id="planetperihelion" />
                    </p>
                    <p>
                        Planet Aphelion (Km):
                <input type="text" id="planetaphelion" />
                    </p>
                    <p>
                        Planet's Day Duration in Seconds:
                <input type="number" id="dayduration" />
                    </p>
                    <p>
                        Moon Mass (Kg):
                <input type="text" id="moonmass" />
                    </p>
                    <p>
                        Moon Perigee (Km):
                <input type="text" id="moonperigee" />
                    </p>
                    <p>
                        Moon Apogee (Km):
                <input type="text" id="moonapogee" />
                    </p>
                    <p><button id="generateButton" type="button">Generate</button></p>
                </form>
            </div>
        );
    }
}