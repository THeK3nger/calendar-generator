import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/test";
import { GeneratorInput } from "./components/input";

export function initializeComponents() {

    ReactDOM.render(
        <GeneratorInput />,
        document.getElementById("generator")
    );
}