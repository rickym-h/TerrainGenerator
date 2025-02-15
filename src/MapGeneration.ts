import {createNoise2D, NoiseFunction2D} from 'simplex-noise';

export class TerrainGenerator {

    XRange: number;
    YRange: number;

    noise2D: NoiseFunction2D;

    constructor() {
        this.XRange = 100;
        this.YRange = 100;

        this.noise2D = createNoise2D();
    }

    getHeightAtLocation(X: number,Y: number) {
        return this.noise2D(X, Y);
    }
}