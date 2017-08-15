import * as log from 'loglevel'

import * as GeneratorUI from "./interface"

const VERSION = "v0.2.5";

export function init() {
    log.setLevel("debug");
    console.log(`Calendar Generator ${VERSION}`);
    console.log(`-------------------------`);
    log.info("Initializing Calendar Generator UI");
    GeneratorUI.initializeComponents();
    // $("#generateButton").click(() => handleForm(viz));
}