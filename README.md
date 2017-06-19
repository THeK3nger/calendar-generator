This is a demo page in which it is possible to procedurally generate a calendar from the orbital parameter of the planet.

Invent a planet, set its mass, the distance from the star, the distance from its moon and generate a calendar that it is astronomically correct!

## Build

The calendar generator can be accessed [following this link][1]. 

If you want, you can build your local version in three simple steps. First, install TypeScript.

    npm install -g typescript

Then clone this repository

    git clone https://github.com/THeK3nger/calendar-generator.git

Then, build it!

    npm install && tsc

You will find everything in the `build` folder, ready to be deployed.

## Known Issues

Actually, the generator only works in a reasonable way for earth-like planets. You can have fast spinning planet, or planets with very long years, but you will obtain improbable calendars with hundreds of months or months lasting more than a year.

I will address the problem with such exotic planets in the future.

## Feature Backlog

- [ ] Lunar Phases
- [x] Seasons
- [ ] Astrological Features (zodiac-like)
- [ ] Multi-Year Cycles (e.g., like in the Chinese Calendar)
- [ ] Possibility to have months different from the "lunar month".
- [ ] Multi Start Systems
- [ ] Multi Satellite Systems


## Contribute

I am open for external contributions, of course! Fork this repo an open a pull request.


[1]: http://www.davideaversa.it/experiment/calendgen/