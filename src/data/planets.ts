/** Small body orbiting a planet (display-scale, not real proportions). */
export type MoonConfig = {
  id: string
  name: string
  /** Local orbit radius around the parent planet */
  orbitRadius: number
  radius: number
  color: string
  /** Radians per second at timeScale 1 */
  angularSpeed: number
  phase: number
  metalness?: number
  roughness?: number
}

export type PlanetConfig = {
  id: string
  name: string
  /** Heliocentric orbit radius */
  orbitRadius: number
  radius: number
  color: string
  /** Radians per second at timeScale 1 */
  angularSpeed: number
  phase: number
  spinSpeed?: number
  /** PBR tuning for metallic “inlaid globe” look */
  metalness?: number
  roughness?: number
  /** Satellites shown as tiny spheres on local orbits */
  moons?: MoonConfig[]
}

/** Visual / scaling preset for the whole model */
export type ModelPreset = 'display' | 'limited' | 'physical'
/** Render-only body scale used to make `physical` mode readable. */
export const PHYSICAL_BODY_SCALE = 120

/** Sun radius in Earth radii (mean) — used for `limited` / `physical` center scale */
export const SUN_RADIUS_EARTH = 109.08
/** One astronomical unit in mean Earth radii. */
const AU_IN_EARTH_RADII = 23481.07

/** Eight planets with representative moons — tabletop display scale */
const DISPLAY_PLANETS: PlanetConfig[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    orbitRadius: 2.35,
    radius: 0.2,
    color: '#c4c0b8',
    angularSpeed: 1.35,
    phase: 0.6,
    spinSpeed: 2.0,
    metalness: 0.55,
    roughness: 0.42,
    moons: [],
  },
  {
    id: 'venus',
    name: 'Venus',
    orbitRadius: 3.25,
    radius: 0.26,
    color: '#d4b896',
    angularSpeed: 1.05,
    phase: 2.4,
    spinSpeed: 0.5,
    metalness: 0.45,
    roughness: 0.38,
    moons: [],
  },
  {
    id: 'earth',
    name: 'Earth',
    orbitRadius: 4.35,
    radius: 0.3,
    color: '#5a8fc4',
    angularSpeed: 0.88,
    phase: 0.2,
    spinSpeed: 2.8,
    metalness: 0.35,
    roughness: 0.45,
    moons: [
      {
        id: 'moon',
        name: 'Moon',
        orbitRadius: 0.55,
        radius: 0.1,
        color: '#b8b8b8',
        angularSpeed: 2.4,
        phase: 1.1,
        metalness: 0.25,
        roughness: 0.55,
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    orbitRadius: 5.55,
    radius: 0.24,
    color: '#c45c3e',
    angularSpeed: 0.72,
    phase: 3.8,
    spinSpeed: 2.6,
    metalness: 0.4,
    roughness: 0.48,
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        orbitRadius: 0.42,
        radius: 0.055,
        color: '#9a8f82',
        angularSpeed: 3.6,
        phase: 0.0,
        metalness: 0.3,
        roughness: 0.65,
      },
      {
        id: 'deimos',
        name: 'Deimos',
        orbitRadius: 0.58,
        radius: 0.045,
        color: '#a89e92',
        angularSpeed: 2.1,
        phase: 2.7,
        metalness: 0.28,
        roughness: 0.68,
      },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    orbitRadius: 7.1,
    radius: 0.74,
    color: '#cfa57b',
    angularSpeed: 0.45,
    phase: 4.6,
    spinSpeed: 4.2,
    metalness: 0.48,
    roughness: 0.4,
    moons: [
      {
        id: 'io',
        name: 'Io',
        orbitRadius: 0.95,
        radius: 0.09,
        color: '#d9c36c',
        angularSpeed: 2.5,
        phase: 0.9,
        metalness: 0.25,
        roughness: 0.58,
      },
      {
        id: 'europa',
        name: 'Europa',
        orbitRadius: 1.18,
        radius: 0.08,
        color: '#d8d3c8',
        angularSpeed: 2.1,
        phase: 2.1,
        metalness: 0.2,
        roughness: 0.6,
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        orbitRadius: 1.42,
        radius: 0.11,
        color: '#9b8674',
        angularSpeed: 1.7,
        phase: 3.4,
        metalness: 0.22,
        roughness: 0.62,
      },
      {
        id: 'callisto',
        name: 'Callisto',
        orbitRadius: 1.72,
        radius: 0.1,
        color: '#6f6258',
        angularSpeed: 1.35,
        phase: 4.8,
        metalness: 0.24,
        roughness: 0.66,
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    orbitRadius: 8.75,
    radius: 0.66,
    color: '#d6c18f',
    angularSpeed: 0.31,
    phase: 1.4,
    spinSpeed: 3.6,
    metalness: 0.42,
    roughness: 0.36,
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        orbitRadius: 1.05,
        radius: 0.11,
        color: '#c99f57',
        angularSpeed: 1.45,
        phase: 2.9,
        metalness: 0.22,
        roughness: 0.58,
      },
      {
        id: 'enceladus',
        name: 'Enceladus',
        orbitRadius: 1.38,
        radius: 0.06,
        color: '#e2e7ef',
        angularSpeed: 1.95,
        phase: 0.5,
        metalness: 0.18,
        roughness: 0.5,
      },
      {
        id: 'iapetus',
        name: 'Iapetus',
        orbitRadius: 1.7,
        radius: 0.07,
        color: '#8b8271',
        angularSpeed: 1.1,
        phase: 4.1,
        metalness: 0.2,
        roughness: 0.64,
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    orbitRadius: 10.25,
    radius: 0.5,
    color: '#9ec6cc',
    angularSpeed: 0.22,
    phase: 5.5,
    spinSpeed: 2.4,
    metalness: 0.35,
    roughness: 0.34,
    moons: [
      {
        id: 'titania',
        name: 'Titania',
        orbitRadius: 0.9,
        radius: 0.08,
        color: '#b9c0c7',
        angularSpeed: 1.25,
        phase: 1.8,
        metalness: 0.22,
        roughness: 0.6,
      },
      {
        id: 'oberon',
        name: 'Oberon',
        orbitRadius: 1.18,
        radius: 0.075,
        color: '#8e939a',
        angularSpeed: 0.98,
        phase: 3.3,
        metalness: 0.24,
        roughness: 0.63,
      },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    orbitRadius: 11.75,
    radius: 0.49,
    color: '#4d72c9',
    angularSpeed: 0.17,
    phase: 2.2,
    spinSpeed: 2.5,
    metalness: 0.38,
    roughness: 0.33,
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        orbitRadius: 0.96,
        radius: 0.09,
        color: '#c8c2bd',
        angularSpeed: 1.18,
        phase: 5.1,
        metalness: 0.2,
        roughness: 0.57,
      },
      {
        id: 'proteus',
        name: 'Proteus',
        orbitRadius: 1.27,
        radius: 0.055,
        color: '#8c857f',
        angularSpeed: 0.88,
        phase: 1.0,
        metalness: 0.22,
        roughness: 0.65,
      },
    ],
  },
]

const REAL_PLANET_STATS: Record<
  PlanetConfig['id'],
  { orbitAu: number; radiusEarths: number; orbitalYears: number }
> = {
  mercury: { orbitAu: 0.387, radiusEarths: 0.383, orbitalYears: 0.241 },
  venus: { orbitAu: 0.723, radiusEarths: 0.949, orbitalYears: 0.615 },
  earth: { orbitAu: 1, radiusEarths: 1, orbitalYears: 1 },
  mars: { orbitAu: 1.524, radiusEarths: 0.532, orbitalYears: 1.881 },
  jupiter: { orbitAu: 5.203, radiusEarths: 11.209, orbitalYears: 11.862 },
  saturn: { orbitAu: 9.537, radiusEarths: 9.449, orbitalYears: 29.457 },
  uranus: { orbitAu: 19.191, radiusEarths: 4.007, orbitalYears: 84.017 },
  neptune: { orbitAu: 30.069, radiusEarths: 3.883, orbitalYears: 164.79 },
}

function buildPlanetsFromRealStats(
  orbitRadiusForStats: (orbitAu: number) => number
): PlanetConfig[] {
  const earthReference = DISPLAY_PLANETS.find((planet) => planet.id === 'earth')
  if (!earthReference) return DISPLAY_PLANETS

  return DISPLAY_PLANETS.map((planet) => {
    const stats = REAL_PLANET_STATS[planet.id]
    const radius = earthReference.radius * stats.radiusEarths
    const angularSpeed = earthReference.angularSpeed / stats.orbitalYears
    const orbitRadius = orbitRadiusForStats(stats.orbitAu)
    const parentScale = radius / planet.radius
    const moons = (planet.moons ?? []).map((moon, index) => {
      const moonRadius = Math.max(moon.radius * parentScale * 0.55, 0.035)
      const minimumOrbit = radius + moonRadius + 0.42 + index * 0.32

      return {
        ...moon,
        radius: moonRadius,
        orbitRadius: Math.max(moon.orbitRadius * parentScale * 0.72, minimumOrbit),
        angularSpeed: moon.angularSpeed / Math.max(Math.sqrt(stats.orbitalYears), 1),
      }
    })

    return {
      ...planet,
      radius,
      angularSpeed,
      orbitRadius,
      moons,
    }
  })
}

function buildScaledPlanetsFromDisplay(): PlanetConfig[] {
  const orbitBase = 1.9
  const orbitScale = 6.6

  const scaled = buildPlanetsFromRealStats(
    (orbitAu) => orbitBase + Math.log2(1 + orbitAu) * orbitScale
  )

  scaled.sort(
    (left, right) =>
      REAL_PLANET_STATS[left.id].orbitAu - REAL_PLANET_STATS[right.id].orbitAu
  )

  let previousOrbit = 0
  let previousExtent = 0

  return scaled.map((planet) => {
    const localExtent = Math.max(
      planet.radius,
      ...((planet.moons ?? []).map((moon) => moon.orbitRadius + moon.radius) || [0])
    )
    const minOrbit =
      previousOrbit === 0
        ? planet.orbitRadius
        : previousOrbit + previousExtent + planet.radius + 0.9
    const adjustedOrbit = Math.max(planet.orbitRadius, minOrbit)

    previousOrbit = adjustedOrbit
    previousExtent = localExtent

    return {
      ...planet,
      orbitRadius: adjustedOrbit,
    }
  })
}

/** Compressed orbits + physical relative planet sizes (same as former “realistic”) */
const LIMITED_PLANETS = buildScaledPlanetsFromDisplay()

function getEarthRadiusFromList(planets: PlanetConfig[]): number {
  const earth = planets.find((p) => p.id === 'earth')
  return earth?.radius ?? 0.3
}

function getMaxHeliocentricOrbitFromList(planets: PlanetConfig[]): number {
  return planets.reduce((m, p) => Math.max(m, p.orbitRadius), 0)
}

/** Full Sun/planet sizes plus heliocentric distances on the same physical scale. */
function buildPhysicalPlanets(): PlanetConfig[] {
  const earthReference = DISPLAY_PLANETS.find((planet) => planet.id === 'earth')
  if (!earthReference) return LIMITED_PLANETS

  return buildPlanetsFromRealStats(
    (orbitAu) => earthReference.radius * AU_IN_EARTH_RADII * orbitAu
  )
}

const PHYSICAL_PLANETS = buildPhysicalPlanets()

export const PLANETS = DISPLAY_PLANETS

export function getPlanets(preset: ModelPreset): PlanetConfig[] {
  switch (preset) {
    case 'limited':
      return LIMITED_PLANETS
    case 'physical':
      return PHYSICAL_PLANETS
    case 'display':
    default:
      return DISPLAY_PLANETS
  }
}

/** Earth sphere radius in scene units from a planet list */
export function getEarthRadius(planets: PlanetConfig[]): number {
  return getEarthRadiusFromList(planets)
}

/** Max heliocentric orbit radius (planet centers), ignoring moon reach */
export function getMaxHeliocentricOrbit(planets: PlanetConfig[]): number {
  return getMaxHeliocentricOrbitFromList(planets)
}

/**
 * Scene-space sun sphere radius for `limited` / `physical`.
 * `display` uses the decorative hub only — returns `null`.
 */
export function getSunSphereRadius(
  preset: ModelPreset,
  earthRadius: number,
  maxHeliocentricOrbit: number
): number | null {
  if (preset === 'display') return null
  const physical = earthRadius * SUN_RADIUS_EARTH
  if (preset === 'physical') return physical
  // limited: cap so composition stays readable
  const byOrbit = maxHeliocentricOrbit * 0.2
  const byEarth = earthRadius * 16
  const absolute = 2.35
  return Math.min(physical, byOrbit, byEarth, absolute)
}

export function listAllBodyNames(planets: PlanetConfig[] = DISPLAY_PLANETS): string[] {
  const names: string[] = []
  for (const p of planets) {
    names.push(p.name)
    for (const m of p.moons ?? []) {
      names.push(`${p.name}: ${m.name}`)
    }
  }
  return names
}
