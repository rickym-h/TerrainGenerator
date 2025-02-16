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

    getHeightMap(width: number, height: number) {

        let map: number[][] = [];

        for (let x = 0; x < width; x++) {
            map[x] = []
            for (let y = 0; y < height; y++) {
                map[x][y] = this.getHeightAtLocation(x, y);
            }
        }

        return map;
    }

    getHeightAtLocation(X: number, Y: number) {

        let cumulativeHeight = 0;

        for (let Octave = 1; Octave <= this.OctaveCount; Octave++) {
            let OctaveFrequency = this.getOctaveFrequency(Octave);
            let OctaveAmplitude = this.getOctaveAmplitude(Octave);
            cumulativeHeight += this.noise2D(X*OctaveFrequency, Y*OctaveFrequency) * OctaveAmplitude;
        }

        return cumulativeHeight;
    }

    getOctaveFrequency(Octave: number) {
        let BaseFrequency = 0.01;
        return BaseFrequency * (Octave**2);
    }

    getOctaveAmplitude(Octave: number) {
        let BaseAmplitude = 2;
        return BaseAmplitude / (Octave**2);
    }
}