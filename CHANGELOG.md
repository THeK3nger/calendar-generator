# Change Log
All notable changes to this project will be documented in this file.

## [0.2.5] - 2017-08-12

### Changed

 - I am refactoring the code for more complex functionality. The first step in this direction is to move to a more robust build system. This internal release is just for this: from plain `tsc` to Webpack. 

## [0.2.0] - 2017-06-19
### Added
- **New! Orbit Scheme!** Now there is a simple schematic view of the orbit. This include the orbit shape, the moon and a diagram of the seasons on the planet. More features for the visualizer in the future!
- **New! Seasons!** I added procedural seasons. 
    - Season for earth-like planets are marked on the orbit visualization. This will give some quick insight on the duration of the seasons.
    - Season-related events, such as equinoxes and solstices dates,  are now shown in the calendar description.
### Changed
- I removed the semi-axis major as input for orbital parameters. While it is the easier way to compute the calendar, using periapsis and apoapsis allow us to easily compute eccentricity.

## [0.1.0] - 2017-03-27
### Added
- Initial basic version