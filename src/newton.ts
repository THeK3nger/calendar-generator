/**
 * Implementation of the newton method for finding a function root.
 */

export function NewtonRoot(f: (x: number)=>number, df: (x: number)=>number, guess: number,  threshold: number ) : number {
    let x = guess;
    let ftest = f(x);
    let count = 0;
    // Perform at most 10000 iterations.
    while (ftest > threshold && count < 10000) {
        x = x - ftest/df(x);
        ftest = f(x);
    }
    return x;
}