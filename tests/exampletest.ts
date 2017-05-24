
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = "Hello World!";
    expect(result).to.equal('Hello World!');
  });
});