import * as Newton from '../src/newton';

import { expect } from 'chai';
import 'mocha';

describe('Newton numeric solver', () => {
  it('Root of f(x) = x - 1. Should return approximately 1', () => {
    const result = Newton.NewtonRoot((x) => x - 1, (x) => 1, 0, 0.001);
    expect(result).approximately(1,0.1);
    expect(result - 1).approximately(0,0.001);
  });
  it('Root of f(x) = cos^2(x). Should return approximately pi/2', () => {
    const result = Newton.NewtonRoot((x) => Math.cos(x)*Math.cos(x), (x) => -2*Math.cos(x)*Math.sin(x), Math.PI/4, 0.001);
    expect(result).approximately(Math.PI/2,0.1);
    expect(Math.cos(result)*Math.cos(result)).approximately(0,0.001);
  });
});