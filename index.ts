import colorConvert from 'color-convert'
import ColorObject from 'colorjs.io'
import { Harmonizer } from 'color-harmony'
import invertColor from 'invert-color'
import colorBlind from 'color-blind'

const colorHarmonizer = new Harmonizer()

export default function splat(color: string) {
  const colorObject = new ColorObject(color)
  const colorRGBArray = colorConvert.hex.rgb(color) as [
    number,
    number,
    number,
  ]
  const colorRGB = {
    r: colorRGBArray[0],
    g: colorRGBArray[1],
    b: colorRGBArray[2],
  }
  const colorCMYK = colorConvert.hex.cmyk(color)
  const baseColor = classifyColor(colorRGB.r, colorRGB.g, colorRGB.b)
  const analogous = colorHarmonizer.harmonize(color, 'analogous')
  const rainbow = []
  let i = 0
  while (i < 360) {
    const hex =
      '#' +
      colorConvert.hsl
        .hex([i++, colorObject.hsl.s, colorObject.hsl.l])
        .toUpperCase()
    rainbow.push(hex)
  }
  const saturateds = []
  const fraction = 100 / 8
  i = 0
  while (i < 8) {
    const hex =
      '#' +
      colorConvert.hsl
        .hex([colorObject.hsl.h, i * fraction, colorObject.hsl.l])
        .toUpperCase()
    saturateds.push(hex)
    i++
  }
  saturateds.reverse()
  const lights = []
  i = 0
  while (i < 8) {
    const hex =
      '#' +
      colorConvert.hsl
        .hex([colorObject.hsl.h, colorObject.hsl.s, i * fraction])
        .toUpperCase()
    lights.push(hex)
    i++
  }
  lights.reverse()

  return {
    rainbow,
    saturateds,
    lights,
    baseColor,
    analogous,
    colorCMYK,
    inverted: invertColor(color),
    protanomaly: colorBlind.protanomaly(color),
    deuteranomaly: colorBlind.deuteranomaly(color),
    tritanomaly: colorBlind.tritanomaly(color),
    protanopia: colorBlind.protanopia(color),
    deuteranopia: colorBlind.deuteranopia(color),
    tritanopia: colorBlind.tritanopia(color),
    achromatomaly: colorBlind.achromatomaly(color),
    achromatopsia: colorBlind.achromatopsia(color),
    complementary: colorHarmonizer.harmonize(color, 'complementary'),
    splitComplementary: colorHarmonizer.harmonize(
      color,
      'splitComplementary',
    ),
    triadic: colorHarmonizer.harmonize(color, 'triadic'),
    clash: colorHarmonizer.harmonize(color, 'clash'),
    tetradic: colorHarmonizer.harmonize(color, 'tetradic'),
    neutral: colorHarmonizer.harmonize(color, 'neutral'),
    tints: colorHarmonizer.tints(color, 8),
    shades: colorHarmonizer.shades(color, 8),
    colorSpaces: {
      hex: color,
      rgb: colorRGB,
      rgbPercent: colorRGBArray.map((x: number) =>
        round((x / 255) * 100),
      ),
      hsl: colorObject.hsl,
      hsv: colorObject.hsv,
      cieLab: colorObject.lab,
      xyz: colorObject.xyz,
      cieLch: colorObject.lch,
      binary: colorRGBArray.map((x: number) =>
        x.toString(2).padStart(8, '0'),
      ),
    },
  }
}

export function generateRainbowColors(): Array<string> {
  const rainbow = []
  let i = 0
  while (i < 360) {
    const hex = '#' + colorConvert.hsl.hex([i++, 100, 69]).toUpperCase()
    rainbow.push(hex)
  }
  return rainbow
}

// https://stackoverflow.com/a/75842387/169992
export function classifyColor(
  red: number,
  green: number,
  blue: number,
) {
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const luma = 0.3 * red + 0.59 * green + 0.11 * blue
  const chroma = max - min
  const unsaturated = chroma < 0.15
  if (unsaturated) {
    if (luma < 0.1) {
      return 'black'
    }
    if (luma < 0.9) {
      return 'gray'
    }
    return 'white'
  }
  let hue_prime
  if (red == max) {
    hue_prime = (green - blue) / chroma
    if (hue_prime < 0) {
      hue_prime += 6
    }
  } else if (green == max) {
    hue_prime = (blue - red) / chroma + 2
  } else {
    hue_prime = (red - green) / chroma + 4
  }
  const hue = 60 * hue_prime
  if (hue < 17.5) {
    return 'red'
  }
  if (hue < 50) {
    return luma < 0.45 ? 'brown' : 'orange'
  }
  if (hue < 70) {
    return 'yellow'
  }
  if (hue < 165) {
    return 'green'
  }
  if (hue < 255) {
    return 'blue'
  }
  if (hue < 330) {
    return 'purple'
  }
  return 'red'
}

export type RGBType = {
  r: number
  g: number
  b: number
}

export function getSimilarityScore(rgb1: RGBType, rgb2: RGBType) {
  return (
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  )
}

export function pickClosestColor(
  rgb: RGBType,
  namedColorList: Array<{ name: string; rgb: RGBType }>,
) {
  let bestColor = namedColorList[0]
  let bestScore = Infinity

  for (const color of namedColorList) {
    const score = getSimilarityScore(rgb, color.rgb)
    if (score < bestScore) {
      bestColor = color
      bestScore = score
    }
  }

  return bestColor
}

function round(n: number, x = 3): string {
  return n
    .toFixed(x)
    .replace(/\.0+/, '')
    .replace(/\.(\d)0+/, (_, $1) => `.${$1}`)
}
