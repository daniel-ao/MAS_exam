import React, { useEffect, useRef, useState } from 'react';
import { LabFrame } from './LabFrame';
import { Play, RotateCcw } from 'lucide-react';

interface Boid { x: number; y: number; vx: number; vy: number }
interface Params { ws: number; wa: number; wc: number; radius: number; sepRadius: number; maxSpeed: number; n: number }

const W = 640, H = 360;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const spawn = (n: number): Boid[] => Array.from({ length: n }, () => ({ x: rand(0, W), y: rand(0, H), vx: rand(-1.5, 1.5), vy: rand(-1.5, 1.5) }));
const norm = (x: number, y: number) => { const l = Math.hypot(x, y); return l > 0 ? [x / l, y / l] : [0, 0]; };

/** One step of the slide 25 algorithm (pseudo-code of slides 22–24). */
const forces = (i: number, bs: Boid[], p: Params) => {
  const me = bs[i];
  let sx = 0, sy = 0, sc = 0, ax = 0, ay = 0, cx = 0, cy = 0, n = 0;
  for (let j = 0; j < bs.length; j++) {
    if (j === i) continue;
    const o = bs[j];
    const d = Math.hypot(me.x - o.x, me.y - o.y);
    if (d > p.radius) continue;
    n++;
    ax += o.vx; ay += o.vy; cx += o.x; cy += o.y;
    if (d > 0 && d < p.sepRadius) { const [ux, uy] = norm(me.x - o.x, me.y - o.y); sx += ux / d; sy += uy / d; sc++; }
  }
  const sep: [number, number] = sc > 0 ? [sx / sc, sy / sc] : [0, 0];
  let ali: [number, number] = [0, 0], coh: [number, number] = [0, 0];
  if (n > 0) {
    const [dx, dy] = norm(ax / n, ay / n);
    ali = [dx * p.maxSpeed - me.vx, dy * p.maxSpeed - me.vy];
    const [ux, uy] = norm(cx / n - me.x, cy / n - me.y);
    coh = [ux * p.maxSpeed - me.vx, uy * p.maxSpeed - me.vy];
  }
  return { sep, ali, coh, n };
};

export const FlockingLab: React.FC = () => {
  const [p, setP] = useState<Params>({ ws: 1.5, wa: 0.05, wc: 0.01, radius: 60, sepRadius: 22, maxSpeed: 2.2, n: 60 });
  const [running, setRunning] = useState(true);
  const boids = useRef<Boid[]>(spawn(60));
  const canvas = useRef<HTMLCanvasElement>(null);
  const pRef = useRef(p);
  pRef.current = p;

  useEffect(() => {
    if (boids.current.length !== p.n) boids.current = spawn(p.n);
  }, [p.n]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      const ctx = canvas.current?.getContext('2d');
      const prm = pRef.current;
      const bs = boids.current;
      if (running) {
        const f = bs.map((_, i) => forces(i, bs, prm));
        bs.forEach((b, i) => {
          b.vx += prm.ws * f[i].sep[0] * 2 + prm.wa * f[i].ali[0] + prm.wc * f[i].coh[0];
          b.vy += prm.ws * f[i].sep[1] * 2 + prm.wa * f[i].ali[1] + prm.wc * f[i].coh[1];
          const sp = Math.hypot(b.vx, b.vy);
          if (sp > prm.maxSpeed) { b.vx = (b.vx / sp) * prm.maxSpeed; b.vy = (b.vy / sp) * prm.maxSpeed; }
          b.x = (b.x + b.vx + W) % W;
          b.y = (b.y + b.vy + H) % H;
        });
      }
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, W, H);
        const focal = bs[0];
        if (focal) {
          ctx.strokeStyle = 'rgba(15,118,110,0.35)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.arc(focal.x, focal.y, prm.radius, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          const f = forces(0, bs, prm);
          const arrow = (v: [number, number], color: string, k: number) => {
            ctx.strokeStyle = color; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(focal.x, focal.y); ctx.lineTo(focal.x + v[0] * k, focal.y + v[1] * k); ctx.stroke();
          };
          arrow(f.sep, '#e11d48', 400 * prm.ws);
          arrow(f.ali, '#2563eb', 25);
          arrow(f.coh, '#059669', 25);
          ctx.lineWidth = 1;
        }
        bs.forEach((b, i) => {
          const a = Math.atan2(b.vy, b.vx);
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(a);
          ctx.fillStyle = i === 0 ? '#b91c1c' : '#f59e0b';
          ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-5, 4); ctx.lineTo(-5, -4); ctx.closePath(); ctx.fill();
          ctx.restore();
        });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const slider = (k: keyof Params, label: string, min: number, max: number, step: number, tone: string) => (
    <label className="block text-xs">
      <span className="flex justify-between"><span className={`font-semibold ${tone}`}>{label}</span><span className="font-mono">{p[k]}</span></span>
      <input type="range" min={min} max={max} step={step} value={p[k]} onChange={e => setP({ ...p, [k]: Number(e.target.value) })} className="w-full accent-teal-700" />
    </label>
  );

  return (
    <LabFrame title="Flocking Simulator" subtitle="Weighted separation, alignment and cohesion, computed only from each boid’s neighbors. The red boid shows its neighborhood and its three forces." source="Part 1.1, Slides 15–26">
      <div className="grid lg:grid-cols-[1fr,15rem] gap-5">
        <canvas ref={canvas} width={W} height={H} className="w-full rounded-xl border border-stone-200" />
        <div className="space-y-2.5">
          {slider('ws', 'Separation weight (red)', 0, 4, 0.1, 'text-rose-700')}
          {slider('wa', 'Alignment weight (blue)', 0, 0.2, 0.005, 'text-blue-700')}
          {slider('wc', 'Cohesion weight (green)', 0, 0.06, 0.002, 'text-emerald-700')}
          {slider('radius', 'Neighborhood radius', 10, 150, 5, 'text-slate-700')}
          {slider('sepRadius', 'separation_radius', 5, 60, 1, 'text-slate-700')}
          {slider('maxSpeed', 'max_speed', 0.5, 5, 0.1, 'text-slate-700')}
          {slider('n', 'Number of agents', 5, 120, 5, 'text-slate-700')}
          <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1"><Play className="w-3.5 h-3.5" /> {running ? 'Pause' : 'Play'}</button>
            <button onClick={() => { boids.current = spawn(p.n); }} className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold inline-flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Scatter</button>
          </div>
          <p className="text-[11px] text-slate-500">Set alignment and cohesion to 0: agents only avoid each other. Set separation to 0: they collapse into clumps. Emergence needs all three.</p>
        </div>
      </div>
    </LabFrame>
  );
};
