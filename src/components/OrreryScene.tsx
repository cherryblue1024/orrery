import { Suspense, useCallback, useEffect, useRef, useState, type ElementRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, TrackballControls, useEnvironment } from '@react-three/drei'
import * as THREE from 'three'
import type { ModelPreset, PlanetConfig } from '../data/planets'
import {
  getEarthRadius,
  getMaxHeliocentricOrbit,
  getSunSphereRadius,
  PHYSICAL_BODY_SCALE,
} from '../data/planets'
import { Planet } from './Planet'

type CameraControlsHandle = ElementRef<typeof TrackballControls>
export type PhysicalViewMode = 'inner' | 'whole'

useEnvironment.preload({ preset: 'studio' })

const brass = {
  color: '#c4a052',
  metalness: 0.92,
  roughness: 0.26,
  envMapIntensity: 1.05,
}

const brassBright = {
  color: '#e2bf72',
  metalness: 0.98,
  roughness: 0.14,
  envMapIntensity: 1.35,
}

const brassDark = {
  color: '#8a6a38',
  metalness: 0.88,
  roughness: 0.32,
  envMapIntensity: 0.95,
}

function OrbitTrack({
  radius,
  glow,
}: {
  radius: number
  glow?: boolean
}) {
  const tube = glow ? Math.max(0.18, radius * 0.00008) : 0.024
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <torusGeometry args={[radius, tube, 14, 128]} />
      {glow ? (
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.95} depthWrite={false} />
      ) : (
        <meshStandardMaterial {...brass} />
      )}
    </mesh>
  )
}

/** Display preset: sun at heliocentric origin; mechanics below the sphere only */
function CentralHub({ paused, timeScale }: { paused: boolean; timeScale: number }) {
  const hubRef = useRef<THREE.Group>(null)
  const rotationRef = useRef(0)
  const sunR = 0.58

  useFrame((_, delta) => {
    if (!hubRef.current || paused) return
    rotationRef.current += 0.12 * delta * timeScale
    hubRef.current.rotation.y = rotationRef.current
  })
  return (
    <group ref={hubRef}>
      <pointLight
        position={[0, 0, 0]}
        intensity={26}
        distance={64}
        decay={2}
        color="#ffe8c4"
      />
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[sunR, 64, 64]} />
        <meshPhysicalMaterial
          color="#fff7ec"
          emissive="#ffd28b"
          emissiveIntensity={0.72}
          metalness={0.03}
          roughness={0.5}
          envMapIntensity={0.35}
          clearcoat={0.2}
          clearcoatRoughness={0.42}
        />
      </mesh>
      <mesh position={[0, 0, 0]} scale={1.02}>
        <sphereGeometry args={[sunR, 64, 64]} />
        <meshBasicMaterial
          color="#fffaf2"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function ScaledSun({
  sunRadius,
  preset,
  paused,
  timeScale,
  lightDistance,
  bodyScale,
}: {
  sunRadius: number
  preset: ModelPreset
  paused: boolean
  timeScale: number
  lightDistance?: number
  bodyScale?: number
}) {
  const hubRef = useRef<THREE.Group>(null)
  const rotationRef = useRef(0)
  const visibleSunRadius = preset === 'physical' ? sunRadius * (bodyScale ?? 1) : sunRadius

  useFrame((_, delta) => {
    if (!hubRef.current || paused) return
    rotationRef.current += 0.06 * delta * timeScale
    hubRef.current.rotation.y = rotationRef.current
  })

  const stalkH = Math.min(0.55, visibleSunRadius * 0.12 + 0.12)
  const stalkR = Math.min(0.12, visibleSunRadius * 0.025 + 0.04)
  const stalkCenterY = -visibleSunRadius - stalkH * 0.5
  const resolvedLightDistance =
    lightDistance ??
    (preset === 'physical' ? Math.max(420, visibleSunRadius * 10) : Math.max(48, sunRadius * 5.5))
  const lightIntensity =
    preset === 'physical' ? 95 + visibleSunRadius * 0.12 : 18 + sunRadius * 3.4
  const isLimited = preset === 'limited'
  const emissiveIntensity = preset === 'physical' ? 3.2 : isLimited ? 0.72 : 2.65
  const glowOpacity = preset === 'physical' ? 0.12 : isLimited ? 0.18 : 0.14
  const glowScale = preset === 'physical' ? 1.015 : isLimited ? 1.02 : 1.008
  const sunColor = isLimited ? '#fff7ec' : '#ffd9a8'
  const emissiveColor = isLimited ? '#ffd28b' : '#ff9a3c'
  const metalness = isLimited ? 0.03 : 0.18
  const roughness = isLimited ? 0.5 : 0.38
  const envMapIntensity = isLimited ? 0.35 : 0.75
  const clearcoat = isLimited ? 0.2 : 0.55
  const clearcoatRoughness = isLimited ? 0.42 : 0.22

  return (
    <group ref={hubRef}>
      <pointLight
        position={[0, 0, 0]}
        intensity={lightIntensity}
        distance={resolvedLightDistance}
        decay={2}
        color="#ffe8c4"
      />
      <mesh position={[0, 0, 0]} castShadow={!isLimited} receiveShadow={!isLimited}>
        <sphereGeometry args={[visibleSunRadius, 72, 72]} />
        <meshPhysicalMaterial
          color={sunColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          metalness={metalness}
          roughness={roughness}
          envMapIntensity={envMapIntensity}
          clearcoat={clearcoat}
          clearcoatRoughness={clearcoatRoughness}
          transmission={0}
          thickness={0}
          ior={1.45}
          attenuationColor="#ffffff"
          attenuationDistance={0}
        />
      </mesh>
      {glowOpacity > 0 ? (
        <mesh position={[0, 0, 0]} scale={glowScale}>
          <sphereGeometry args={[visibleSunRadius, 48, 48]} />
          <meshBasicMaterial
            color={isLimited ? '#fffaf2' : '#fff5e6'}
            transparent
            opacity={glowOpacity}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      {isLimited || preset === 'physical' ? null : (
        <mesh position={[0, stalkCenterY, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[stalkR * 0.85, stalkR, stalkH, 20]} />
          <meshStandardMaterial {...brassDark} />
        </mesh>
      )}
    </group>
  )
}

function ArmillaryFrame({ radius }: { radius: number }) {
  const outerRadius = radius + 2.2

  return (
    <group>
      <mesh rotation={[0.9, 0.18, 0.56]} position={[0, 0.18, 0]} castShadow receiveShadow>
        <torusGeometry args={[outerRadius, 0.062, 18, 220]} />
        <meshPhysicalMaterial
          {...brassBright}
          clearcoat={1}
          clearcoatRoughness={0.12}
          reflectivity={0.92}
        />
      </mesh>
      <mesh rotation={[-0.96, 0.12, -0.82]} position={[0, 0.1, 0]} castShadow receiveShadow>
        <torusGeometry args={[outerRadius - 0.28, 0.052, 18, 220]} />
        <meshPhysicalMaterial
          {...brass}
          clearcoat={1}
          clearcoatRoughness={0.13}
          reflectivity={0.88}
        />
      </mesh>
      <mesh rotation={[0.14, 0.9, -0.34]} position={[0, 0.02, 0]} castShadow receiveShadow>
        <torusGeometry args={[outerRadius - 0.52, 0.04, 16, 200]} />
        <meshPhysicalMaterial
          {...brassDark}
          clearcoat={0.9}
          clearcoatRoughness={0.18}
          reflectivity={0.8}
        />
      </mesh>
    </group>
  )
}

function WorkshopTable() {
  return (
    <mesh
      position={[0, -0.95, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <circleGeometry args={[16, 64]} />
      <meshStandardMaterial
        color="#1c1612"
        roughness={0.95}
        metalness={0.02}
      />
    </mesh>
  )
}

function computePlanetExtent(planets: PlanetConfig[], bodyScale = 1): number {
  return planets.reduce((furthest, planet) => {
    const visiblePlanetRadius = planet.radius * bodyScale
    const moonReach = Math.max(
      0,
      ...(planet.moons ?? []).map((moon) => moon.orbitRadius + moon.radius * bodyScale)
    )
    return Math.max(furthest, planet.orbitRadius + Math.max(visiblePlanetRadius, moonReach))
  }, 0)
}

function computeInnerPhysicalExtentWithScale(planets: PlanetConfig[], bodyScale: number): number {
  const innerPlanets = [...planets]
    .sort((left, right) => left.orbitRadius - right.orbitRadius)
    .slice(0, 4)

  return computePlanetExtent(innerPlanets, bodyScale)
}

function computePhysicalBodyScale(planets: PlanetConfig[], sunRadius: number): number {
  if (sunRadius <= 0 || planets.length === 0) return 1

  const maxSafeScale = planets.reduce((minimumScale, planet) => {
    const denominator = Math.max(sunRadius + planet.radius, 0.001)
    return Math.min(minimumScale, planet.orbitRadius / denominator)
  }, Number.POSITIVE_INFINITY)

  return Math.max(1, Math.min(PHYSICAL_BODY_SCALE, maxSafeScale * 0.95))
}

function SceneContent({
  paused,
  planets,
  modelPreset,
  physicalView,
  physicalBodyScale,
  timeScale,
  onControlsReady,
}: {
  paused: boolean
  planets: PlanetConfig[]
  modelPreset: ModelPreset
  physicalView: PhysicalViewMode
  physicalBodyScale: number
  timeScale: number
  onControlsReady?: (reset: () => void) => void
}) {
  const controlsRef = useRef<CameraControlsHandle>(null)
  const rawCamera = useThree((state) => state.camera)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const desiredCameraPositionRef = useRef(new THREE.Vector3())
  const desiredControlsTargetRef = useRef(new THREE.Vector3())
  const desiredCameraUpRef = useRef(new THREE.Vector3(0, 1, 0))
  const desiredFovRef = useRef(36)
  const desiredFarRef = useRef(500)
  const hasInitializedCameraRef = useRef(false)
  const isCameraAnimatingRef = useRef(false)
  const pressedKeysRef = useRef({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyQ: false,
    KeyE: false,
  })
  const keyboardOffsetRef = useRef(new THREE.Vector3())
  const keyboardSphericalRef = useRef(new THREE.Spherical())
  const defaultCameraUpRef = useRef(new THREE.Vector3(0, 1, 0))
  const isDisplay = modelPreset === 'display'
  const isPhysical = modelPreset === 'physical'
  const isShadowlessMode = modelPreset === 'limited' || isDisplay

  const earthR = getEarthRadius(planets)
  const maxHelio = getMaxHeliocentricOrbit(planets)
  const sunSphereRadius = getSunSphereRadius(modelPreset, earthR, maxHelio)

  const bodyScale = isPhysical ? physicalBodyScale : 1
  const planetExtent = computePlanetExtent(planets, bodyScale)
  const innerExtent = computeInnerPhysicalExtentWithScale(planets, physicalBodyScale)
  const sunExtent = isPhysical ? (sunSphereRadius ?? 0.92) * physicalBodyScale : sunSphereRadius ?? 0.92
  const modelExtent = Math.max(planetExtent, sunExtent)
  const physicalViewExtent = physicalView === 'inner' ? Math.max(innerExtent, sunExtent) : modelExtent
  const armillaryRadius = Math.max(planetExtent, (sunSphereRadius ?? 0) * 1.06 + 0.35)

  const shadowScale = Math.max(22, modelExtent * 1.45)
  const minDistance =
    modelPreset === 'physical'
      ? Math.max(4, sunExtent * 0.08)
      : modelPreset === 'limited'
      ? Math.max(0.75, (sunSphereRadius ?? 0) * 0.55)
      : 0.25
  const targetZ = 0
  const cameraZ = isPhysical
    ? physicalView === 'inner'
      ? Math.max(14000, physicalViewExtent * 1.45)
      : Math.max(180000, physicalViewExtent * 1.12)
    : Math.max(16, modelExtent * 1.08)
  const cameraY = isPhysical
    ? physicalView === 'inner'
      ? Math.max(4200, physicalViewExtent * 0.42)
      : Math.max(64000, physicalViewExtent * 0.34)
    : Math.max(8.5, modelExtent * 0.58)
  const maxDistance = isPhysical ? Math.max(cameraZ * 10, physicalViewExtent * 12) : Math.max(240, modelExtent * 18)
  const cameraFar = Math.max(500, maxDistance * 1.5, modelExtent * 6)
  const cameraFov = isPhysical ? (physicalView === 'inner' ? 38 : 44) : 36

  useEffect(() => {
    cameraRef.current = rawCamera as THREE.PerspectiveCamera
  }, [rawCamera])

  const moveCameraToView = useCallback((instant: boolean) => {
    const ctrl = controlsRef.current
    const currentCamera = cameraRef.current
    if (!ctrl || !currentCamera) return

    desiredCameraPositionRef.current.set(0, cameraY, cameraZ)
    desiredControlsTargetRef.current.set(0, 0.28, targetZ)
    desiredCameraUpRef.current.copy(defaultCameraUpRef.current)
    desiredFovRef.current = cameraFov
    desiredFarRef.current = cameraFar

    if (instant) {
      currentCamera.position.copy(desiredCameraPositionRef.current)
      ctrl.target.copy(desiredControlsTargetRef.current)
      currentCamera.up.copy(desiredCameraUpRef.current)
      currentCamera.lookAt(ctrl.target)
      currentCamera.fov = desiredFovRef.current
      currentCamera.far = desiredFarRef.current
      currentCamera.updateProjectionMatrix()
      ctrl.update()
      isCameraAnimatingRef.current = false
      return
    }

    isCameraAnimatingRef.current = true
  }, [cameraFar, cameraFov, cameraY, cameraZ, targetZ])

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl || !onControlsReady) return
    onControlsReady(() => {
      moveCameraToView(false)
    })
  }, [moveCameraToView, onControlsReady])

  useEffect(() => {
    const shouldJump = !hasInitializedCameraRef.current
    moveCameraToView(shouldJump)
    hasInitializedCameraRef.current = true
  }, [moveCameraToView])

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl) return

    const cancelCameraAnimation = () => {
      if (!isCameraAnimatingRef.current) return
      const currentCamera = cameraRef.current
      isCameraAnimatingRef.current = false
      if (currentCamera) {
        desiredCameraPositionRef.current.copy(currentCamera.position)
        desiredControlsTargetRef.current.copy(ctrl.target)
        desiredCameraUpRef.current.copy(currentCamera.up)
        desiredFovRef.current = currentCamera.fov
        desiredFarRef.current = currentCamera.far
      }
    }

    ctrl.addEventListener('start', cancelCameraAnimation)
    const domElement = (ctrl as unknown as { domElement?: HTMLElement }).domElement
    domElement?.addEventListener('wheel', cancelCameraAnimation, { passive: true })
    domElement?.addEventListener('pointerdown', cancelCameraAnimation)
    domElement?.addEventListener('touchstart', cancelCameraAnimation, { passive: true })

    return () => {
      ctrl.removeEventListener('start', cancelCameraAnimation)
      domElement?.removeEventListener('wheel', cancelCameraAnimation)
      domElement?.removeEventListener('pointerdown', cancelCameraAnimation)
      domElement?.removeEventListener('touchstart', cancelCameraAnimation)
    }
  }, [moveCameraToView])

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT')

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      if (!(event.code in pressedKeysRef.current)) return
      pressedKeysRef.current[event.code as keyof typeof pressedKeysRef.current] = true
      event.preventDefault()
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!(event.code in pressedKeysRef.current)) return
      pressedKeysRef.current[event.code as keyof typeof pressedKeysRef.current] = false
      event.preventDefault()
    }

    const handleWindowBlur = () => {
      pressedKeysRef.current.KeyW = false
      pressedKeysRef.current.KeyA = false
      pressedKeysRef.current.KeyS = false
      pressedKeysRef.current.KeyD = false
      pressedKeysRef.current.KeyQ = false
      pressedKeysRef.current.KeyE = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [])

  useFrame((_, delta) => {
    const ctrl = controlsRef.current
    const currentCamera = cameraRef.current
    if (!ctrl || !currentCamera) return

    const pressedKeys = pressedKeysRef.current
    if (
      pressedKeys.KeyW ||
      pressedKeys.KeyA ||
      pressedKeys.KeyS ||
      pressedKeys.KeyD ||
      pressedKeys.KeyQ ||
      pressedKeys.KeyE
    ) {
      keyboardOffsetRef.current.copy(currentCamera.position).sub(ctrl.target)
      keyboardSphericalRef.current.setFromVector3(keyboardOffsetRef.current)

      const keyboardRotateSpeed = delta * 1.5
      const keyboardZoomSpeed = Math.max(minDistance * 0.9, keyboardSphericalRef.current.radius * 1.4) * delta
      if (pressedKeys.KeyA) keyboardSphericalRef.current.theta += keyboardRotateSpeed
      if (pressedKeys.KeyD) keyboardSphericalRef.current.theta -= keyboardRotateSpeed
      if (pressedKeys.KeyW) keyboardSphericalRef.current.phi -= keyboardRotateSpeed
      if (pressedKeys.KeyS) keyboardSphericalRef.current.phi += keyboardRotateSpeed
      if (pressedKeys.KeyQ) keyboardSphericalRef.current.radius -= keyboardZoomSpeed
      if (pressedKeys.KeyE) keyboardSphericalRef.current.radius += keyboardZoomSpeed

      keyboardSphericalRef.current.phi = THREE.MathUtils.clamp(
        keyboardSphericalRef.current.phi,
        0.05,
        Math.PI - 0.05
      )
      keyboardSphericalRef.current.radius = THREE.MathUtils.clamp(
        keyboardSphericalRef.current.radius,
        minDistance,
        maxDistance
      )
      keyboardSphericalRef.current.makeSafe()

      keyboardOffsetRef.current.setFromSpherical(keyboardSphericalRef.current)
      currentCamera.position.copy(ctrl.target).add(keyboardOffsetRef.current)
      currentCamera.up.copy(defaultCameraUpRef.current)
      currentCamera.lookAt(ctrl.target)
      desiredCameraPositionRef.current.copy(currentCamera.position)
      desiredControlsTargetRef.current.copy(ctrl.target)
      desiredCameraUpRef.current.copy(defaultCameraUpRef.current)
      isCameraAnimatingRef.current = false
      ctrl.update()
    }

    if (!isCameraAnimatingRef.current) return

    const positionLerp = 1 - Math.exp(-delta * 4.8)
    const targetLerp = 1 - Math.exp(-delta * 5.2)
    const upLerp = 1 - Math.exp(-delta * 5.6)

    currentCamera.position.lerp(desiredCameraPositionRef.current, positionLerp)
    ctrl.target.lerp(desiredControlsTargetRef.current, targetLerp)
    currentCamera.up.lerp(desiredCameraUpRef.current, upLerp).normalize()
    currentCamera.lookAt(ctrl.target)
    currentCamera.fov = THREE.MathUtils.damp(
      currentCamera.fov,
      desiredFovRef.current,
      4.8,
      delta
    )
    currentCamera.far = THREE.MathUtils.damp(
      currentCamera.far,
      desiredFarRef.current,
      4.8,
      delta
    )
    currentCamera.updateProjectionMatrix()
    ctrl.update()

    const positionSettled = currentCamera.position.distanceTo(desiredCameraPositionRef.current) < 1
    const targetSettled = ctrl.target.distanceTo(desiredControlsTargetRef.current) < 0.02
    const upSettled = currentCamera.up.distanceToSquared(desiredCameraUpRef.current) < 0.0001
    const fovSettled = Math.abs(currentCamera.fov - desiredFovRef.current) < 0.05
    const farSettled = Math.abs(currentCamera.far - desiredFarRef.current) < 1

    if (positionSettled && targetSettled && upSettled && fovSettled && farSettled) {
      currentCamera.position.copy(desiredCameraPositionRef.current)
      ctrl.target.copy(desiredControlsTargetRef.current)
      currentCamera.up.copy(desiredCameraUpRef.current)
      currentCamera.lookAt(ctrl.target)
      currentCamera.fov = desiredFovRef.current
      currentCamera.far = desiredFarRef.current
      currentCamera.updateProjectionMatrix()
      ctrl.update()
      isCameraAnimatingRef.current = false
    }
  })

  return (
    <>
      <color attach="background" args={['#12100e']} />

      <ambientLight intensity={isPhysical ? 0.1 : isShadowlessMode ? 0.22 : 0.055} color="#ffeadd" />
      <hemisphereLight
        color="#f0e8dc"
        groundColor={isShadowlessMode || isPhysical ? '#f0e8dc' : '#2a241c'}
        intensity={isPhysical ? 0.1 : isShadowlessMode ? 0.22 : 0.07}
      />
      <directionalLight
        position={[14, 22, 12]}
        intensity={0.12}
        color="#fff2dc"
        castShadow={!isShadowlessMode}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={220}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />
      <directionalLight
        position={[-8, 6, -10]}
        intensity={isShadowlessMode ? 0.12 : 0.06}
        color="#b8c8ff"
      />

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={1.02} />
      </Suspense>

      {modelPreset === 'limited' || isDisplay || isPhysical ? null : <WorkshopTable />}

      {isShadowlessMode || isPhysical ? null : (
        <ContactShadows
          position={[0, -0.14, 0]}
          opacity={0.38}
          scale={shadowScale}
          blur={2.4}
          far={5}
          color="#000000"
        />
      )}

      <group position={[0, 0.28, 0]} rotation={[0, 0, 0]}>
        {isPhysical ? null : <ArmillaryFrame radius={armillaryRadius} />}

        {isDisplay ? (
          <CentralHub paused={paused} timeScale={timeScale} />
        ) : sunSphereRadius != null ? (
          <ScaledSun
            sunRadius={sunSphereRadius}
            preset={modelPreset}
            paused={paused}
            timeScale={timeScale}
            lightDistance={isPhysical ? modelExtent * 2.2 : undefined}
            bodyScale={bodyScale}
          />
        ) : (
          <CentralHub paused={paused} timeScale={timeScale} />
        )}

        {planets.map((p) => (
          <OrbitTrack key={`track-${p.id}`} radius={p.orbitRadius} glow={isPhysical} />
        ))}
        {planets.map((p) => (
          <Planet
            key={p.id}
            config={p}
            paused={paused}
            timeScale={timeScale}
            shadowless={isShadowlessMode}
            showVisibilityMarker={false}
            glow={isPhysical}
            bodyScale={bodyScale}
          />
        ))}
      </group>

      <TrackballControls
        ref={controlsRef}
        staticMoving
        minDistance={minDistance}
        maxDistance={maxDistance}
      />
    </>
  )
}

export type OrrerySceneProps = {
  paused: boolean
  planets: PlanetConfig[]
  modelPreset: ModelPreset
  physicalView?: PhysicalViewMode
  timeScale: number
  onControlsReady?: (reset: () => void) => void
  className?: string
}

export function OrreryScene({
  paused,
  planets,
  modelPreset,
  physicalView = 'inner',
  timeScale,
  onControlsReady,
  className,
}: OrrerySceneProps) {
  const isPhysical = modelPreset === 'physical'
  const earthR = getEarthRadius(planets)
  const maxHelio = getMaxHeliocentricOrbit(planets)
  const sunSphereRadius = getSunSphereRadius(modelPreset, earthR, maxHelio)
  const physicalBodyScale =
    isPhysical && sunSphereRadius != null ? computePhysicalBodyScale(planets, sunSphereRadius) : 1

  const planetExtent = computePlanetExtent(planets, isPhysical ? physicalBodyScale : 1)
  const innerExtent = computeInnerPhysicalExtentWithScale(planets, physicalBodyScale)
  const sunExtent = isPhysical ? (sunSphereRadius ?? 0.92) * physicalBodyScale : sunSphereRadius ?? 0.92
  const modelExtent = Math.max(planetExtent, sunExtent)
  const physicalViewExtent = physicalView === 'inner' ? Math.max(innerExtent, sunExtent) : modelExtent

  const cameraZ = isPhysical
    ? physicalView === 'inner'
      ? Math.max(14000, physicalViewExtent * 1.45)
      : Math.max(180000, physicalViewExtent * 1.12)
    : Math.max(16, modelExtent * 1.08)
  const cameraY = isPhysical
    ? physicalView === 'inner'
      ? Math.max(4200, physicalViewExtent * 0.42)
      : Math.max(64000, physicalViewExtent * 0.34)
    : Math.max(8.5, modelExtent * 0.58)
  const cameraFar = Math.max(500, modelExtent * 4)
  const cameraFov = isPhysical ? (physicalView === 'inner' ? 38 : 44) : 36
  const [initialCamera] = useState(() => ({
    position: [0, cameraY, cameraZ] as [number, number, number],
    fov: cameraFov,
    near: 0.1,
    far: cameraFar,
  }))

  return (
    <div className={className}>
      <Canvas
        shadows
        camera={initialCamera}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, 2]}
      >
        <SceneContent
          paused={paused}
          planets={planets}
          modelPreset={modelPreset}
          physicalView={physicalView}
          physicalBodyScale={physicalBodyScale}
          timeScale={timeScale}
          onControlsReady={onControlsReady}
        />
      </Canvas>
    </div>
  )
}
