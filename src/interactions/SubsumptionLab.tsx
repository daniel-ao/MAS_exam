import React, { useEffect, useRef, useState } from 'react';
import { LabFrame } from './LabFrame';
import { Play, RotateCcw } from 'lucide-react';

const COLS = 12, ROWS = 8;
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const OBST = new Set(['4,1', '4,2', '4,3', '7,4', '7,5', '7,6', '2,5', '9,1', '10,3']);
const GOAL = { x: 10, y: 6 };
const VISION = 3;

type Layer = 'avoid' | 'goal' | 'wander';
interface Robot { x: number; y: number; d: number }

const blocked = (x: number, y: number) => x < 0 || y < 0 || x >= COLS || y >= ROWS || OBST.has(`${x},${y}`);

export const SubsumptionLab: React.FC = () => {
  const [robot, setRobot] = useState<Robot>({ x: 0, y: 0, d: 0 });
  const [enabled, setEnabled] = useState<Record<Layer, boolean>>({ avoid: true, goal: true, wander: true });
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState<Layer | 'none'>('none');
  const [trail, setTrail] = useState<string[]>(['0,0']);
  const [crashes, setCrashes] = useState(0);
  const reached = robot.x === GOAL.x && robot.y === GOAL.y;

  const robotRef = useRef(robot);
  robotRef.current = robot;

  const tick = () => {
    const r = robotRef.current;
    if (r.x === GOAL.x && r.y === GOAL.y) return;
    const [dx, dy] = DIRS[r.d];
    const collision = blocked(r.x + dx, r.y + dy);
    const visible = Math.abs(GOAL.x - r.x) + Math.abs(GOAL.y - r.y) <= VISION;
    let layer: Layer | 'none' = 'none';
    let next = r;
    let crash = false;
    if (enabled.avoid && collision) {
      layer = 'avoid';
      const options = [1, 3, 2].map(k => (r.d + k) % 4).filter(d => !blocked(r.x + DIRS[d][0], r.y + DIRS[d][1]));
      next = { ...r, d: options[0] ?? (r.d + 2) % 4 };
    } else if (enabled.goal && visible) {
      layer = 'goal';
      const want = Math.abs(GOAL.x - r.x) >= Math.abs(GOAL.y - r.y) ? (GOAL.x > r.x ? 0 : 2) : GOAL.y > r.y ? 1 : 3;
      const [wx, wy] = DIRS[want];
      if (blocked(r.x + wx, r.y + wy)) { next = { ...r, d: want }; crash = true; } else next = { x: r.x + wx, y: r.y + wy, d: want };
    } else if (enabled.wander) {
      layer = 'wander';
      const d = Math.random() < 0.25 ? (r.d + (Math.random() < 0.5 ? 1 : 3)) % 4 : r.d;
      const [wx, wy] = DIRS[d];
      if (blocked(r.x + wx, r.y + wy)) { crash = true; next = { ...r, d: (d + 1) % 4 }; } else next = { x: r.x + wx, y: r.y + wy, d };
    }
    robotRef.current = next;
    setRobot(next);
    setLast(layer);
    setTrail(t => [...t.slice(-60), `${next.x},${next.y}`]);
    if (crash) setCrashes(c => c + 1);
  };

  useEffect(() => {
    if (!running || reached) return;
    const id = window.setInterval(tick, 260);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, reached, enabled]);

  const reset = () => { setRobot({ x: 0, y: 0, d: 0 }); setTrail(['0,0']); setLast('none'); setCrashes(0); setRunning(false); };
  const cell = 34;
  const LAYERS: { id: Layer; label: string; code: string; active: string }[] = [
    { id: 'avoid', label: 'Avoid obstacles', code: 'if detect_collision(): avoid_obstacle()', active: 'border-rose-500 bg-rose-50' },
    { id: 'goal', label: 'Head toward the goal', code: 'elif goal_visible(): move_to_goal()', active: 'border-emerald-500 bg-emerald-50' },
    { id: 'wander', label: 'Wander randomly', code: 'else: wander()', active: 'border-sky-500 bg-sky-50' }
  ];

  return (
    <LabFrame title="Subsumption Robot" subtitle="Three behavior layers, highest priority on top. Each tick, the first layer whose condition fires suppresses the ones below it." source="Part 1.1, Slides 12–14">
      <div className="grid lg:grid-cols-[auto,1fr] gap-5 items-start">
        <svg viewBox={`0 0 ${COLS * cell} ${ROWS * cell}`} className="w-full max-w-md bg-stone-50 rounded-xl border border-stone-200">
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const x = i % COLS, y = Math.floor(i / COLS);
            const ob = OBST.has(`${x},${y}`);
            const seen = trail.includes(`${x},${y}`);
            return <rect key={i} x={x * cell} y={y * cell} width={cell - 1} height={cell - 1} fill={ob ? '#475569' : seen ? '#ccfbf1' : '#fff'} />;
          })}
          <text x={GOAL.x * cell + cell / 2} y={GOAL.y * cell + cell / 2 + 6} textAnchor="middle" fontSize="18">🎯</text>
          <g transform={`translate(${robot.x * cell + cell / 2},${robot.y * cell + cell / 2}) rotate(${robot.d * 90})`}>
            <circle r={12} fill={last === 'avoid' ? '#e11d48' : last === 'goal' ? '#059669' : '#0284c7'} />
            <path d="M4,-5 L12,0 L4,5 z" fill="#fff" />
          </g>
        </svg>

        <div className="space-y-2 text-xs">
          {LAYERS.map((l, i) => (
            <div key={l.id} className={`rounded-xl border p-2.5 flex items-center gap-3 ${last === l.id ? l.active : 'border-stone-200'}`}>
              <span className="font-mono text-slate-400">L{i + 1}</span>
              <div className="flex-1">
                <div className="font-bold text-slate-800">{l.label} {last === l.id && <span className="text-[10px] uppercase ml-1 text-slate-500">← active, suppresses below</span>}</div>
                <div className="font-mono text-[11px] text-slate-500">{l.code}</div>
              </div>
              <label className="flex items-center gap-1"><input type="checkbox" checked={enabled[l.id]} onChange={e => setEnabled({ ...enabled, [l.id]: e.target.checked })} /> on</label>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setRunning(r => !r)} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-bold inline-flex items-center gap-1"><Play className="w-3.5 h-3.5" /> {running ? 'Pause' : 'Run'}</button>
            <button onClick={tick} className="px-3 py-1.5 rounded-lg border border-stone-300 font-semibold">Step</button>
            <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-stone-300 font-semibold inline-flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>
          <p className="text-slate-600">{reached ? '🎯 Goal reached by purely reactive behavior, with no map and no plan.' : `Goal visible within ${VISION} cells. Bumps into obstacles: ${crashes}.`}</p>
          <p className="text-slate-500">Turn off “Avoid obstacles” to see why it must sit on top; turn off “Head toward the goal” and the robot only wanders.</p>
        </div>
      </div>
    </LabFrame>
  );
};
