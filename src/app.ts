import * as Physic from "physic"

let period_in_second = Physic.orbital_period(Physic.earth_mass, 384399000);

console.log(period_in_second / 60 / 60 / 24);
