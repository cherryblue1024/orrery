import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import type { MoonConfig, PlanetConfig } from '../data/planets'

const markerPosition = new Float32Array([0, 0, 0])

function MoonMesh({
  moon,
  paused,
  timeScale,
  shadowless,
  glow,
  bodyScale,
}: {
  moon: MoonConfig
  paused: boolean
  timeScale: number
  shadowless?: boolean
  glow?: boolean
  bodyScale?: number
}) {
  const groupRef = useRef<Group>(null)
  const angleRef = useRef(moon.phase)
  const visibleMoonRadius = glow ? moon.radius * (bodyScale ?? 1) : moon.radius

  useFrame((_, delta) => {
    if (!groupRef.current || paused) return
    angleRef.current += moon.angularSpeed * delta * timeScale
    groupRef.current.position.x = Math.cos(angleRef.current) * moon.orbitRadius
    groupRef.current.position.z = Math.sin(angleRef.current) * moon.orbitRadius
  })

  const metalness = moon.metalness ?? 0.35
  const roughness = moon.roughness ?? 0.55

  return (
    <group ref={groupRef}>
      <mesh castShadow={!shadowless} receiveShadow={!shadowless}>
        <sphereGeometry args={[visibleMoonRadius, 20, 20]} />
        <meshPhysicalMaterial
          color={moon.color}
          emissive={shadowless || glow ? moon.color : '#000000'}
          emissiveIntensity={glow ? 2.25 : shadowless ? 0.42 : 0}
          metalness={Math.max(metalness, 0.72)}
          roughness={Math.min(roughness, 0.28)}
          envMapIntensity={1.6}
          clearcoat={0.85}
          clearcoatRoughness={0.2}
          reflectivity={0.7}
        />
      </mesh>
      <mesh scale={1.018}>
        <sphereGeometry args={[visibleMoonRadius, 20, 20]} />
        <meshPhysicalMaterial
          color={glow ? moon.color : '#fff3d4'}
          transparent
          opacity={glow ? 0.3 : 0.1}
          emissive={glow ? moon.color : '#000000'}
          emissiveIntensity={glow ? 1.35 : 0}
          metalness={0.95}
          roughness={0.14}
          envMapIntensity={1.8}
          clearcoat={1}
          clearcoatRoughness={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export type PlanetProps = {
  config: PlanetConfig
  paused: boolean
  timeScale: number
  shadowless?: boolean
  showVisibilityMarker?: boolean
  glow?: boolean
  bodyScale?: number
}

function SaturnRing({
  radius,
  shadowless,
  glow,
}: {
  radius: number
  shadowless?: boolean
  glow?: boolean
}) {
  return (
    <group rotation={[0.72, 0.15, -0.35]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow={!shadowless}
        receiveShadow={!shadowless}
      >
        <ringGeometry args={[radius * 1.38, radius * 2.05, 96]} />
        <meshPhysicalMaterial
          color="#d9bf86"
          emissive={shadowless || glow ? '#d9bf86' : '#000000'}
          emissiveIntensity={glow ? 1.9 : shadowless ? 0.35 : 0}
          metalness={0.92}
          roughness={0.24}
          envMapIntensity={1.75}
          clearcoat={0.9}
          clearcoatRoughness={0.14}
          side={2}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[radius * 1.52, radius * 1.94, 96]} />
        <meshPhysicalMaterial
          color={glow ? '#ffe1a0' : '#f4e1b0'}
          transparent
          opacity={glow ? 0.46 : 0.22}
          emissive={glow ? '#f4e1b0' : '#000000'}
          emissiveIntensity={glow ? 1.35 : 0}
          metalness={1}
          roughness={0.12}
          envMapIntensity={1.9}
          clearcoat={1}
          clearcoatRoughness={0.08}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export function Planet({
  config,
  paused,
  timeScale,
  shadowless,
  showVisibilityMarker,
  glow,
  bodyScale,
}: PlanetProps) {
  const orbitGroup = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const visibilityDiscRef = useRef<Mesh>(null)
  const visibilityGlowRef = useRef<Mesh>(null)
  const angleRef = useRef(config.phase)

  const metalness = config.metalness ?? 0.4
  const roughness = config.roughness ?? 0.45
  const visiblePlanetRadius = glow ? config.radius * (bodyScale ?? 1) : config.radius
  const glowScale = glow ? 1.03 : 1.015

  useFrame((_, delta) => {
    if (!orbitGroup.current) return
    if (!paused) {
      angleRef.current += config.angularSpeed * delta * timeScale
      orbitGroup.current.position.x = Math.cos(angleRef.current) * config.orbitRadius
      orbitGroup.current.position.z = Math.sin(angleRef.current) * config.orbitRadius
    }
    if (meshRef.current && !paused && config.spinSpeed) {
      meshRef.current.rotation.y += config.spinSpeed * 0.008 * timeScale
    }
    if (glow) {
      const camera = _.camera
      const discRadius = visiblePlanetRadius * 0.92
      const glowRadius = visiblePlanetRadius * 1.08

      if (visibilityDiscRef.current) {
        visibilityDiscRef.current.lookAt(camera.position)
        visibilityDiscRef.current.scale.setScalar(discRadius)
      }
      if (visibilityGlowRef.current) {
        visibilityGlowRef.current.lookAt(camera.position)
        visibilityGlowRef.current.scale.setScalar(glowRadius)
      }
    }
  })

  return (
    <group ref={orbitGroup}>
      {showVisibilityMarker ? (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[markerPosition, 3]}
              count={1}
            />
          </bufferGeometry>
          <pointsMaterial
            color={config.color}
            size={glow ? 9 : 7}
            sizeAttenuation={false}
            transparent
            opacity={glow ? 1 : 0.92}
            depthWrite={false}
          />
        </points>
      ) : null}
      <mesh ref={meshRef} castShadow={!shadowless} receiveShadow={!shadowless}>
        <sphereGeometry args={[visiblePlanetRadius, 40, 40]} />
        <meshPhysicalMaterial
          color={config.color}
          emissive={shadowless || glow ? config.color : '#000000'}
          emissiveIntensity={glow ? 2.7 : shadowless ? 0.45 : 0}
          metalness={Math.max(metalness, 0.78)}
          roughness={Math.min(roughness, 0.24)}
          envMapIntensity={1.7}
          clearcoat={0.95}
          clearcoatRoughness={0.12}
          reflectivity={0.8}
        />
      </mesh>
      <mesh scale={1.015}>
        <sphereGeometry args={[visiblePlanetRadius, 40, 40]} />
        <meshPhysicalMaterial
          color={glow ? config.color : '#fff1c9'}
          transparent
          opacity={glow ? 0.34 : 0.08}
          emissive={glow ? config.color : '#000000'}
          emissiveIntensity={glow ? 1.75 : 0}
          metalness={1}
          roughness={0.12}
          envMapIntensity={1.85}
          clearcoat={1}
          clearcoatRoughness={0.05}
          depthWrite={false}
        />
      </mesh>
      {glow ? (
        <mesh scale={glowScale}>
          <sphereGeometry args={[visiblePlanetRadius, 24, 24]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      {glow ? (
        <>
          <mesh ref={visibilityGlowRef} renderOrder={2}>
            <circleGeometry args={[1, 40]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.08}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
          <mesh ref={visibilityDiscRef} renderOrder={3}>
            <circleGeometry args={[1, 40]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.5}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
        </>
      ) : null}
      {config.id === 'saturn' ? (
        <SaturnRing radius={visiblePlanetRadius} shadowless={shadowless} glow={glow} />
      ) : null}
      {(config.moons ?? []).map((moon) => (
        <MoonMesh
          key={moon.id}
          moon={moon}
          paused={paused}
          timeScale={timeScale}
          shadowless={shadowless}
          glow={glow}
          bodyScale={bodyScale}
        />
      ))}
    </group>
  )
}
