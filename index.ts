import colorConvert from 'color-convert'
import ColorObject from 'colorjs.io'
import { Harmonizer } from 'color-harmony'
import invertColor from 'invert-color'
import colorBlind from 'color-blind'
import uniq from 'lodash/uniq'

const colorHarmonizer = new Harmonizer()

export type Splat = {
  rainbow: Array<string>
  saturateds: Array<string>
  lights: Array<string>
  base: string // Assuming baseColor is a string, adjust as necessary
  analogous: Array<string> // Assuming analogous is an array of strings
  inverted: string // Assuming inverted is a string
  protanomaly: string
  deuteranomaly: string
  tritanomaly: string
  protanopia: string
  deuteranopia: string
  tritanopia: string
  achromatomaly: string
  achromatopsia: string
  complementary: Array<string>
  split_complementary: Array<string>
  triadic: Array<string>
  clash: Array<string>
  tetradic: Array<string>
  neutral: Array<string>
  tints: Array<string> // Assuming tints returns an array of strings
  shades: Array<string> // Assuming shades returns an array of strings
  hex: string
  rgb: {
    r: number
    g: number
    b: number
    percent: { r: number; g: number; b: number }
  }
  cmyk: {
    c: number
    m: number
    y: number
    k: number
  }
  hsl: {
    h: number | undefined
    s: number | undefined
    l: number | undefined
  }
  hsv: {
    h: number | undefined
    s: number | undefined
    v: number | undefined
  }
  lab: {
    l: number | undefined
    a: number | undefined
    b: number | undefined
  }
  xyz: {
    x: number | undefined
    y: number | undefined
    z: number | undefined
  }
  lch: {
    l: number | undefined
    c: number | undefined
    h: number | undefined
  }
  binary: Array<string>
}

export default function splat(c: string): Splat {
  const color = `#${c}`
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
  const analogous = colorHarmonizer
    .harmonize(color, 'analogous')
    .map(dehex)
    .map((x: string) => x.toUpperCase())
  const rainbow: Array<string> = []
  let i = 0
  while (i < 360) {
    if (colorObject.hsl.s != null && colorObject.hsl.l != null) {
      const hex = colorConvert.hsl
        .hex([i, colorObject.hsl.s, colorObject.hsl.l])
        .toUpperCase()
      rainbow.push(hex)
    }
    i++
  }
  const saturateds: Array<string> = []
  const fraction = 100 / 8
  i = 0
  while (i < 8) {
    if (colorObject.hsl.h != null && colorObject.hsl.l != null) {
      const hex = colorConvert.hsl
        .hex([colorObject.hsl.h, i * fraction, colorObject.hsl.l])
        .toUpperCase()
      saturateds.push(hex)
    }
    i++
  }
  saturateds.reverse()
  const lights: Array<string> = []
  i = 0
  while (i < 8) {
    if (
      colorObject.hsl.h != null &&
      colorObject.hsl.s != null &&
      colorObject.hsl.l != null
    ) {
      const hex = colorConvert.hsl
        .hex([colorObject.hsl.h, colorObject.hsl.s, i * fraction])
        .toUpperCase()
      lights.push(hex)
    }
    i++
  }
  lights.reverse()

  const rgbPercent = colorRGBArray.map((x: number) =>
    round((x / 255) * 100),
  )

  return {
    hex: dehex(color).toUpperCase(),
    rgb: {
      ...colorRGB,
      percent: {
        r: rgbPercent[0]!,
        g: rgbPercent[1]!,
        b: rgbPercent[2]!,
      },
    },
    cmyk: {
      c: colorCMYK[0],
      m: colorCMYK[1],
      y: colorCMYK[2],
      k: colorCMYK[3],
    },
    hsl: {
      h: colorObject.hsl.h,
      s: colorObject.hsl.s,
      l: colorObject.hsl.l,
    },
    hsv: {
      h: colorObject.hsv.h,
      s: colorObject.hsv.s,
      v: colorObject.hsv.v,
    },
    lab: {
      l: colorObject.lab.l,
      a: colorObject.lab.a,
      b: colorObject.lab.b,
    },
    xyz: {
      x: colorObject.xyz.x,
      y: colorObject.xyz.y,
      z: colorObject.xyz.z,
    },
    lch: {
      l: colorObject.lch.l,
      c: colorObject.lch.c,
      h: colorObject.lch.h,
    },
    binary: colorRGBArray.map((x: number) =>
      x.toString(2).padStart(8, '0'),
    ),
    base: baseColor,
    analogous,
    inverted: dehex(invertColor(color)).toUpperCase(),
    protanomaly: dehex(
      colorBlind.protanomaly(color) as string,
    ).toUpperCase(),
    deuteranomaly: dehex(
      colorBlind.deuteranomaly(color) as string,
    ).toUpperCase(),
    tritanomaly: dehex(
      colorBlind.tritanomaly(color) as string,
    ).toUpperCase(),
    protanopia: dehex(
      colorBlind.protanopia(color) as string,
    ).toUpperCase(),
    deuteranopia: dehex(
      colorBlind.deuteranopia(color) as string,
    ).toUpperCase(),
    tritanopia: dehex(
      colorBlind.tritanopia(color) as string,
    ).toUpperCase(),
    achromatomaly: dehex(
      colorBlind.achromatomaly(color) as string,
    ).toUpperCase(),
    achromatopsia: dehex(
      colorBlind.achromatopsia(color) as string,
    ).toUpperCase(),
    complementary: colorHarmonizer
      .harmonize(color, 'complementary')
      .map(dehex)
      .map(x => x.toUpperCase()),
    split_complementary: colorHarmonizer
      .harmonize(color, 'splitComplementary')
      .map(dehex)
      .map(x => x.toUpperCase()),
    triadic: colorHarmonizer
      .harmonize(color, 'triadic')
      .map(dehex)
      .map(x => x.toUpperCase()),
    clash: colorHarmonizer
      .harmonize(color, 'clash')
      .map(dehex)
      .map(x => x.toUpperCase()),
    tetradic: colorHarmonizer
      .harmonize(color, 'tetradic')
      .map(dehex)
      .map(x => x.toUpperCase()),
    neutral: colorHarmonizer
      .harmonize(color, 'neutral')
      .map(dehex)
      .map(x => x.toUpperCase()),
    tints: colorHarmonizer
      .tints(color, 8)
      .map(dehex)
      .map(x => x.toUpperCase()),
    shades: colorHarmonizer
      .shades(color, 8)
      .map(dehex)
      .map(x => x.toUpperCase()),
    saturateds,
    lights,
    rainbow,
  }
}

export function generateRainbowColors(): Array<string> {
  const rainbow: Array<string> = []
  let i = 0
  while (i < 360) {
    const hex = colorConvert.hsl.hex([i++, 100, 69]).toUpperCase()
    rainbow.push(hex)
  }
  return uniq(rainbow)
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

function round(n: number, x = 3) {
  return parseFloat(
    n
      .toFixed(x)
      .replace(/\.0+/, '')
      .replace(/\.(\d)0+/, (_, $1) => `.${$1}`),
  )
}

function dehex(s: string) {
  return s.slice(1) as string
}
