export declare type Splat = {
    rainbow: Array<string>;
    saturateds: Array<string>;
    lights: Array<string>;
    baseColor: string;
    analogous: Array<string>;
    colorCMYK: Array<number>;
    inverted: string;
    protanomaly: string;
    deuteranomaly: string;
    tritanomaly: string;
    protanopia: string;
    deuteranopia: string;
    tritanopia: string;
    achromatomaly: string;
    achromatopsia: string;
    complementary: Array<string>;
    splitComplementary: Array<string>;
    triadic: Array<string>;
    clash: Array<string>;
    tetradic: Array<string>;
    neutral: Array<string>;
    tints: Array<string>;
    shades: Array<string>;
    colorSpaces: {
        hex: string;
        rgb: {
            r: number;
            g: number;
            b: number;
        };
        rgbPercent: Array<number>;
        hsl: {
            h: number | null;
            s: number | null;
            l: number | null;
        };
        hsv: {
            h: number | null;
            s: number | null;
            v: number | null;
        };
        cieLab: {
            l: number | null;
            a: number | null;
            b: number | null;
        };
        xyz: {
            x: number | null;
            y: number | null;
            z: number | null;
        };
        cieLch: {
            l: number | null;
            c: number | null;
            h: number | null;
        };
        binary: Array<string>;
    };
};
export default function splat(color: string): Splat;
export declare function generateRainbowColors(): Array<string>;
export declare function classifyColor(red: number, green: number, blue: number): "gray" | "black" | "white" | "red" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple";
export declare type RGBType = {
    r: number;
    g: number;
    b: number;
};
export declare function getSimilarityScore(rgb1: RGBType, rgb2: RGBType): number;
export declare function pickClosestColor(rgb: RGBType, namedColorList: Array<{
    name: string;
    rgb: RGBType;
}>): {
    name: string;
    rgb: RGBType;
} | undefined;
