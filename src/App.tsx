import { useCallback, useMemo, useRef, useState } from 'react'
import logo from './assets/orrery-logo.svg'
import { OrreryScene, type PhysicalViewMode } from './components/OrreryScene'
import { getPlanets, listAllBodyNames, type ModelPreset } from './data/planets'

function App() {
  const [paused, setPaused] = useState(false)
  const [timeScale, setTimeScale] = useState(0.6)
  const [modelPreset, setModelPreset] = useState<ModelPreset>('display')
  const [physicalView, setPhysicalView] = useState<PhysicalViewMode>('inner')
  const resetCameraRef = useRef<(() => void) | null>(null)

  const onControlsReady = useCallback((reset: () => void) => {
    resetCameraRef.current = reset
  }, [])

  const planets = useMemo(() => getPlanets(modelPreset), [modelPreset])
  const bodySummary = listAllBodyNames(planets).join(' · ')

  const modeNote =
    modelPreset === 'display'
      ? 'Display: stylized proportions; the sun sits at the center of all orbits and lights the model.'
      : modelPreset === 'limited'
        ? 'Limited: real orbital periods and planet sizes with a capped sun; heliocentric tracks stay centered on the sun.'
        : 'Physical: true Sun, planet, and heliocentric distance ratios. Use Inner view for readable nearby planets, or Whole view to see the full system without changing those ratios.'

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <img className="app-logo" src={logo} alt="Brass Orrery logo" />
          <div>
            <p className="app-kicker">Brass mechanical model</p>
            <h1>Brass Orrery</h1>
          </div>
        </div>
        <p>
          An interactive 3D solar system orrery with all eight planets. Drag to
          orbit the camera, scroll to move closer, and switch between stylized
          display and science-oriented layouts.
        </p>
      </header>

      <main className="app-main">
        <OrreryScene
          className="canvas-wrap"
          paused={paused}
          planets={planets}
          modelPreset={modelPreset}
          physicalView={physicalView}
          timeScale={timeScale}
          onControlsReady={onControlsReady}
        />

        <div
          className="controls"
          role="toolbar"
          aria-label="Model controls"
          onContextMenu={(event) => {
            if ((event.target as HTMLElement).closest('button')) {
              event.preventDefault()
            }
          }}
        >
          <div className="segmented" aria-label="Model preset">
            <button
              type="button"
              className={modelPreset === 'display' ? 'is-active' : undefined}
              onClick={() => setModelPreset('display')}
              aria-pressed={modelPreset === 'display'}
            >
              Display
            </button>
            <button
              type="button"
              className={modelPreset === 'limited' ? 'is-active' : undefined}
              onClick={() => setModelPreset('limited')}
              aria-pressed={modelPreset === 'limited'}
            >
              Limited
            </button>
            <button
              type="button"
              className={modelPreset === 'physical' ? 'is-active' : undefined}
              onClick={() => setModelPreset('physical')}
              aria-pressed={modelPreset === 'physical'}
            >
              Physical
            </button>
          </div>

          {modelPreset === 'physical' ? (
            <div className="segmented" aria-label="Physical view">
              <button
                type="button"
                className={physicalView === 'inner' ? 'is-active' : undefined}
                onClick={() => setPhysicalView('inner')}
                aria-pressed={physicalView === 'inner'}
              >
                Inner View
              </button>
              <button
                type="button"
                className={physicalView === 'whole' ? 'is-active' : undefined}
                onClick={() => setPhysicalView('whole')}
                aria-pressed={physicalView === 'whole'}
              >
                Whole View
              </button>
            </div>
          ) : null}

          <label>
            <input
              type="checkbox"
              checked={paused}
              onChange={(e) => setPaused(e.target.checked)}
            />
            Pause mechanism
          </label>

          <label>
            Drive speed
            <input
              type="range"
              min={0.05}
              max={1.5}
              step={0.05}
              value={timeScale}
              onChange={(e) => setTimeScale(Number(e.target.value))}
            />
            <span className="value">{timeScale.toFixed(2)}×</span>
          </label>

          <button
            type="button"
            onClick={() => resetCameraRef.current?.()}
          >
            Reset view
          </button>
        </div>

        <p className="mode-note">{modeNote}</p>

      </main>

      <footer className="app-footer">
        <span className="app-footer-label">Shown:</span> {bodySummary}
        <span className="app-footer-meta">
          {' '}
          · {planets.length} planets
        </span>
      </footer>
    </div>
  )
}

export default App
