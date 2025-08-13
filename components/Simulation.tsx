"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Histogram, { type HistBin } from "./Histogram";

// ====== Core constants ======
const W = 100,
  H = 50,
  N = W * H;
const HIST_MIN = -30,
  HIST_MAX = 10,
  HIST_BINS = 40;
const MAX_MIGRATIONS_PER_TICK = 50;
const useWrap = true;

// Classes: 0=Powerful, 1=Common, 2=Poor
const CLASS_P: [number, number, number] = [0.1, 0.3, 0.6];
const CLASS = { Powerful: 0, Common: 1, Poor: 2 } as const;

// Impact matrices (actor->target). Positive and Negative (normalized)
const POS = [
  [+0.5, +0.5, +0.5], // Powerful -> anyone
  [+0.1, +0.1, +0.2], // Common -> P,C,Po
  [+0.1, +0.1, +0.1], // Poor   -> P,C,Po
] as const;
const NEG = [
  [-1.0, -1.0, -1.0], // Powerful -> anyone
  [-0.1, -0.5, -0.5], // Common   -> P,C,Po
  [-0.1, -0.2, -0.3], // Poor     -> P,C,Po
] as const;

// ====== Utility ======
const randClass = () => {
  const r = Math.random();
  if (r < CLASS_P[0]) return 0;
  if (r < CLASS_P[0] + CLASS_P[1]) return 1;
  return 2;
};

const toColor = (v: number): [number, number, number] => {
  // v in (-1,1]; green->yellow->red
  const clamp = (x: number) => (x < -1 ? -1 : x > 1 ? 1 : x);
  v = clamp(v);
  if (v >= 0) {
    // yellow -> green
    const t = v;
    const r = 255 * (1 - t);
    const g = 255;
    const b = 0;
    return [r | 0, g | 0, b | 0];
  } else {
    // red -> yellow
    const t = -v;
    const r = 255;
    const g = 255 * (1 - t);
    const b = 0;
    return [r | 0, g | 0, b | 0];
  }
};

// Precompute Moore neighbors with torus wrap
const buildNeighbors = (): Uint32Array[] => {
  const NB: Uint32Array[] = new Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idxs: number[] = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          let nx = x + dx,
            ny = y + dy;
          if (useWrap) {
            nx = (nx + W) % W;
            ny = (ny + H) % H;
          } else if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          idxs.push(ny * W + nx);
        }
      }
      NB[y * W + x] = Uint32Array.from(idxs);
    }
  }
  return NB;
};

// ====== Engine ======
class World {
  kind: "Good" | "Mixed";
  T = new Float32Array(N); // trust (-inf, 10]
  Cls = new Uint8Array(N); // class
  Occ = new Uint8Array(N); // occupied (1) or empty (0)
  Move = new Int8Array(N); // last move (+1/-1)
  StreakBad = new Uint8Array(N); // consecutive bad moves
  constructor(kind: "Good" | "Mixed") {
    this.kind = kind;
  }
}

class Engine {
  good = new World("Good");
  mixed = new World("Mixed");
  NB = buildNeighbors();
  tick = 0;
  migrated = 0;
  migQueue: number[] = [];
  shufflePositions = true;

  constructor() {
    this.init();
  }

  init() {
    // Good: everyone 10
    for (let i = 0; i < N; i++) {
      this.good.Occ[i] = 1;
      this.good.Cls[i] = randClass();
      this.good.T[i] = 10;
      this.good.Move[i] = +1;
      this.good.StreakBad[i] = 0;
    }
    // Mixed: [-10,10]
    for (let i = 0; i < N; i++) {
      this.mixed.Occ[i] = 1;
      this.mixed.Cls[i] = randClass();
      this.mixed.T[i] = Math.random() * 20 - 10;
      this.mixed.Move[i] = +1;
      this.mixed.StreakBad[i] = 0;
    }
    this.tick = 0;
    this.migrated = 0;
    this.migQueue.length = 0;
  }

  decideMoves(w: World) {
    const { T, Move, Occ } = w;
    for (let i = 0; i < N; i++)
      if (Occ[i]) {
        const t = T[i];
        Move[i] = t < 0 ? -1 : Math.random() < t / 10 ? +1 : -1;
      }
  }

  neighborImpacts(w: World) {
    const { T, Cls, Move, Occ } = w;
    const delta = new Float32Array(N);
    for (let i = 0; i < N; i++)
      if (Occ[i]) {
        const ci = Cls[i];
        const nb = this.NB[i];
        let sum = 0,
          cnt = 0;
        for (let k = 0; k < nb.length; k++) {
          const j = nb[k];
          if (!Occ[j]) continue;
          const cj = Cls[j];
          const mv = Move[j];
          sum += mv > 0 ? POS[cj][ci] : NEG[cj][ci];
          cnt++;
        }
        if (cnt > 0) delta[i] = sum / cnt;
      }
    for (let i = 0; i < N; i++)
      if (Occ[i]) {
        T[i] = Math.min(10, T[i] + delta[i]);
      }
  }

  powerfulSelfDrift(w: World) {
    const { T, Cls, Move, Occ } = w;
    for (let i = 0; i < N; i++)
      if (Occ[i] && Cls[i] === 0) {
        // Powerful
        T[i] = Math.min(10, T[i] + (Move[i] > 0 ? +0.1 : -0.1));
      }
  }

  updateHistoryAndQueue(w: World) {
    const { Move, StreakBad, Occ } = w;
    for (let i = 0; i < N; i++)
      if (Occ[i]) {
        if (Move[i] < 0) StreakBad[i] = Math.min(255, StreakBad[i] + 1);
        else StreakBad[i] = 0;
        if (w === this.mixed && StreakBad[i] >= 4) this.migQueue.push(i);
      }
  }

  processMigrations() {
    let processed = 0;
    while (processed < MAX_MIGRATIONS_PER_TICK && this.migQueue.length) {
      const idxMixed = this.migQueue.shift()!;
      if (this.mixed.Occ[idxMixed] === 0) continue;
      // overwrite random occupied Good cell
      let idxGood: number;
      do {
        idxGood = (Math.random() * N) | 0;
      } while (this.good.Occ[idxGood] === 0);
      this.good.Cls[idxGood] = this.mixed.Cls[idxMixed];
      this.good.T[idxGood] = this.mixed.T[idxMixed];
      this.good.Move[idxGood] = this.mixed.Move[idxMixed];
      this.good.StreakBad[idxGood] = this.mixed.StreakBad[idxMixed];
      // leave void in Mixed
      this.mixed.Occ[idxMixed] = 0;
      this.mixed.T[idxMixed] = 0;
      this.mixed.Move[idxMixed] = +1;
      this.mixed.StreakBad[idxMixed] = 0;
      this.migrated++;
      processed++;
    }
  }

  fisherYatesShuffleIndices(n: number) {
    const idx = new Uint32Array(n);
    for (let i = 0; i < n; i++) idx[i] = i;
    for (let i = n - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = idx[i];
      idx[i] = idx[j];
      idx[j] = t;
    }
    return idx;
  }
  swapAt(w: World, a: number, b: number) {
    let tmp: any;
    tmp = w.Occ[a];
    w.Occ[a] = w.Occ[b];
    w.Occ[b] = tmp;
    tmp = w.Cls[a];
    w.Cls[a] = w.Cls[b];
    w.Cls[b] = tmp;
    const t2 = w.T[a];
    w.T[a] = w.T[b];
    w.T[b] = t2;
    tmp = w.Move[a];
    w.Move[a] = w.Move[b];
    w.Move[b] = tmp;
    tmp = w.StreakBad[a];
    w.StreakBad[a] = w.StreakBad[b];
    w.StreakBad[b] = tmp;
  }
  shuffleWorld(w: World) {
    const idx = this.fisherYatesShuffleIndices(N);
    const visited = new Uint8Array(N);
    for (let start = 0; start < N; start++) {
      if (visited[start]) continue;
      let i = start;
      while (!visited[i]) {
        visited[i] = 1;
        const j = idx[i];
        if (i !== j) this.swapAt(w, i, j);
        i = j;
      }
    }
  }

  step() {
    this.decideMoves(this.good);
    this.decideMoves(this.mixed);
    this.neighborImpacts(this.good);
    this.neighborImpacts(this.mixed);
    this.powerfulSelfDrift(this.good);
    this.powerfulSelfDrift(this.mixed);
    this.updateHistoryAndQueue(this.good);
    this.updateHistoryAndQueue(this.mixed);
    this.processMigrations();
    if (this.shufflePositions) {
      this.shuffleWorld(this.good);
      this.shuffleWorld(this.mixed);
    }
    this.tick++;
  }
}

// ====== React component ======
export default function Simulation() {
  const canvasGoodRef = useRef<HTMLCanvasElement>(null);
  const canvasMixedRef = useRef<HTMLCanvasElement>(null);
  const [engine] = useState(() => new Engine());

  const [running, setRunning] = useState(false);
  const [tps, setTps] = useState(12);
  const [mixGoodPct, setMixGoodPct] = useState(50);
  const [shuffle, setShuffle] = useState(true);

  const [stats, setStats] = useState({
    tick: 0,
    queued: 0,
    migrated: 0,
    meanG: 0,
    meanM: 0,
    gG: 0,
    eG: 0,
    gM: 0,
    eM: 0,
  });

  // Draw worlds to canvases
  const drawWorld = useCallback((w: World, ctx: CanvasRenderingContext2D) => {
    const img = ctx.createImageData(W, H);
    const data = img.data;
    for (let i = 0; i < N; i++) {
      if (!w.Occ[i]) {
        // void cell
        data[i * 4 + 0] = 240;
        data[i * 4 + 1] = 244;
        data[i * 4 + 2] = 248;
        data[i * 4 + 3] = 255;
        continue;
      }
      const v = Math.tanh(w.T[i] / 5);
      const [r, g, b] = toColor(v);
      data[i * 4 + 0] = r;
      data[i * 4 + 1] = g;
      data[i * 4 + 2] = b;
      data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  const computeStats = useCallback(() => {
    const mean = (w: World) => {
      let s = 0,
        c = 0;
      for (let i = 0; i < N; i++)
        if (w.Occ[i]) {
          s += w.T[i];
          c++;
        }
      return s / (c || 1);
    };
    const countGE = (w: World) => {
      let g = 0,
        e = 0;
      for (let i = 0; i < N; i++) if (w.Occ[i]) w.T[i] >= 0 ? g++ : e++;
      return [g, e] as const;
    };
    const [gG, eG] = countGE(engine.good);
    const [gM, eM] = countGE(engine.mixed);
    setStats({
      tick: engine.tick,
      queued: engine.migQueue.length,
      migrated: engine.migrated,
      meanG: mean(engine.good),
      meanM: mean(engine.mixed),
      gG,
      eG,
      gM,
      eM,
    });
  }, [engine]);

  // Animation loop
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let acc = 0;
    const itv = () => 1 / tps;

    const loop = (ts: number) => {
      if (!running) {
        raf = requestAnimationFrame(loop);
        last = ts;
        return;
      }
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      acc += dt;
      while (acc >= itv()) {
        engine.step();
        acc -= itv();
      }
      // draw
      const g = canvasGoodRef.current?.getContext("2d");
      const m = canvasMixedRef.current?.getContext("2d");
      if (g && m) {
        drawWorld(engine.good, g);
        drawWorld(engine.mixed, m);
      }
      computeStats();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, tps, drawWorld, computeStats, engine]);

  // Ensure canvas size attributes
  useEffect(() => {
    const g = canvasGoodRef.current,
      m = canvasMixedRef.current;
    if (g) {
      g.width = W;
      g.height = H;
    }
    if (m) {
      m.width = W;
      m.height = H;
    }
    // initial render
    const gctx = g?.getContext("2d");
    const mctx = m?.getContext("2d");
    if (gctx && mctx) {
      drawWorld(engine.good, gctx);
      drawWorld(engine.mixed, mctx);
    }
    computeStats();
  }, [engine, drawWorld, computeStats]);

  // Sync shuffle toggle
  useEffect(() => {
    engine.shufflePositions = shuffle;
  }, [shuffle, engine]);

  // Randomize Mixed with given good %
  const randomizeMixed = () => {
    const pGood = mixGoodPct / 100;
    const M = engine.mixed;
    for (let i = 0; i < N; i++)
      if (M.Occ[i]) {
        if (Math.random() < pGood) M.T[i] = Math.random() * 10;
        else M.T[i] = -Math.random() * 10;
        M.Move[i] = +1;
        M.StreakBad[i] = 0;
      }
    const gctx = canvasGoodRef.current?.getContext("2d");
    const mctx = canvasMixedRef.current?.getContext("2d");
    if (gctx && mctx) {
      drawWorld(engine.good, gctx);
      drawWorld(engine.mixed, mctx);
    }
    computeStats();
  };

  // Build histogram data
  const buildBins = useCallback((w: World): HistBin[] => {
    const bins = new Uint32Array(HIST_BINS);
    const width = (HIST_MAX - HIST_MIN) / HIST_BINS;
    for (let i = 0; i < N; i++)
      if (w.Occ[i]) {
        const t = w.T[i];
        let idx = Math.floor((t - HIST_MIN) / width);
        if (t < HIST_MIN) idx = 0;
        else if (t >= HIST_MAX) idx = HIST_BINS - 1;
        idx = Math.max(0, Math.min(HIST_BINS - 1, idx));
        bins[idx]++;
      }
    const out: HistBin[] = [];
    for (let i = 0; i < HIST_BINS; i++) {
      const center = HIST_MIN + (i + 0.5) * width;
      const color =
        center >= 0 ? "#16a34a" : center > -5 ? "#f59e0b" : "#ef4444";
      out.push({
        x: center,
        label: i % 4 === 0 ? center.toFixed(0) : "",
        count: bins[i],
        color,
      });
    }
    return out;
  }, []);

  const goodBins = useMemo(
    () => buildBins(engine.good),
    [engine, stats.tick, buildBins]
  );
  const mixedBins = useMemo(
    () => buildBins(engine.mixed),
    [engine, stats.tick, buildBins]
  );

  return (
    <div className="grid gap-6">
      {/* Controls */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-3 items-center w-full">
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => setRunning(true)}
            >
              Start
            </button>
            <button className="btn" onClick={() => setRunning(false)}>
              Pause
            </button>
            <button
              className="btn"
              onClick={() => {
                if (!running) {
                  engine.step();
                  const g = canvasGoodRef.current?.getContext("2d");
                  const m = canvasMixedRef.current?.getContext("2d");
                  if (g && m) {
                    drawWorld(engine.good, g);
                    drawWorld(engine.mixed, m);
                  }
                  computeStats();
                }
              }}
            >
              +1 Step
            </button>
            <button
              className="btn"
              onClick={() => {
                setRunning(false);
                engine.init();
                const g = canvasGoodRef.current?.getContext("2d");
                const m = canvasMixedRef.current?.getContext("2d");
                if (g && m) {
                  drawWorld(engine.good, g);
                  drawWorld(engine.mixed, m);
                }
                computeStats();
              }}
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn" onClick={randomizeMixed}>
              Set Mixed
            </button>
            <label className="label">Good % (Mixed)</label>
            <input
              className="slider"
              type="range"
              min={0}
              max={100}
              value={mixGoodPct}
              onChange={(e) => setMixGoodPct(+e.target.value)}
            />
            <span className="label w-10 text-right">{mixGoodPct}%</span>
            <div className="h-6 w-px bg-border" />
            <label className="label">Speed</label>
            <input
              className="slider"
              type="range"
              min={1}
              max={60}
              value={tps}
              onChange={(e) => setTps(+e.target.value)}
            />
            <span className="label w-12 text-right">{tps} tps</span>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
              />{" "}
              Shuffle positions each tick (This makes all interractions random)
            </label>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted text-center">
          tick {stats.tick} · queued {stats.queued} · migrations{" "}
          {stats.migrated} · meanT(G) {stats.meanG.toFixed(2)} · meanT(M){" "}
          {stats.meanM.toFixed(2)} · G(g/e) {stats.gG}/{stats.eG} · M(g/e){" "}
          {stats.gM}/{stats.eM}
        </div>
      </div>

      {/* Grids */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Good World</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <canvas ref={canvasGoodRef} className="w-full h-auto" />
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Mixed World</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <canvas ref={canvasMixedRef} className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Histograms */}
      <div className="grid md:grid-cols-2 gap-6">
        <Histogram bins={goodBins} title="Good World – Distribution" />
        <Histogram bins={mixedBins} title="Mixed World – Distribution" />
      </div>
    </div>
  );
}
