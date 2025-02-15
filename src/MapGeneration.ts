import {createNoise2D, NoiseFunction2D} from 'simplex-noise';

export class TerrainGenerator {

    XRange: number;
    YRange: number;

    OctaveCount: number;

    noise2D: NoiseFunction2D;

    constructor(OctaveCount: number = 1) {
        this.XRange = 100;
        this.YRange = 100;

        this.OctaveCount = OctaveCount;

        this.noise2D = createNoise2D();
    }

    getHeightAtLocation(X: number, Y: number) {

        let cumulativeHeight = 0;

        for (let Octave = 0; Octave < this.OctaveCount; Octave++) {
            let OctaveFrequency = 0.05;
            let OctaveAmplitude = 30;
            cumulativeHeight += this.noise2D(X*OctaveFrequency, Y*OctaveFrequency) * OctaveAmplitude;
        }

        return cumulativeHeight;
    }
}