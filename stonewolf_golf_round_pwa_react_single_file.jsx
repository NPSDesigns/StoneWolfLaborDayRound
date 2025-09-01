// Stonewolf Golf – Vite + React + Tailwind project scaffold (ready for GitHub Pages)
// ---------------------------------------------------------------------------------
// This canvas contains ALL files you need. Create a new repo, mirror the tree below,
// paste each file exactly, commit, and deploy with GitHub Pages. The UI has been
// redesigned with a premium look (glass, depth, motion) while staying course‑locked.
//
// Files:
//  - package.json
//  - vite.config.ts
//  - index.html
//  - postcss.config.js
//  - tailwind.config.js
//  - src/main.tsx
//  - src/App.tsx  (the app below — much prettier & feature‑complete)
//  - src/styles.css
//  - public/manifest.webmanifest
//  - public/icons/* (PWA icons – optional placeholders)
//
// Quick start
//   npm i
//   npm run dev  (test locally)
//   npm run build && npm run preview
//   npm run deploy (publishes to GitHub Pages)
// ---------------------------------------------------------------------------------

// ===== package.json =====
/*
{
  "name": "stonewolf-golf",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 5173",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "firebase": "^10.12.4",
    "framer-motion": "^11.3.21",
    "lucide-react": "^0.453.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "autoprefixer": "^10.4.19",
    "gh-pages": "^6.1.1",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.4.5",
    "vite": "^5.4.0"
  }
}
*/

// ===== vite.config.ts =====
/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to '/<REPO_NAME>/' for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/stonewolf-golf/', // <-- set this to your repo name
})
*/

// ===== index.html =====
/*
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stonewolf Golf</title>
    <meta name="theme-color" content="#022c22" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
*/

// ===== postcss.config.js =====
/*
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
*/

// ===== tailwind.config.js =====
/*
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 30px rgba(0,0,0,0.45)'
      },
    },
  },
  plugins: [],
}
*/

// ===== src/main.tsx =====
/*
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
*/

// ===== src/styles.css =====
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { @apply bg-emerald-950 text-emerald-50 font-display; }

.glass {
  @apply bg-emerald-900/40 backdrop-blur-md border border-emerald-700/60 rounded-2xl shadow-glass;
}

.card-title { @apply text-sm uppercase tracking-wider opacity-80; }

.btn {
  @apply inline-flex items-center justify-center rounded-xl px-3 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 transition;
}

.input {
  @apply px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700 focus:outline-none;
}
*/

// ===== public/manifest.webmanifest =====
/*
{
  "name": "Stonewolf Golf",
  "short_name": "Stonewolf",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#022c22",
  "theme_color": "#022c22",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
*/

// ===== src/App.tsx =====
/*
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, MapPin, SignalHigh, RotateCcw, Users, Wifi, WifiOff } from 'lucide-react'

// --- Course lock & data ---
const COURSE_CENTER = { lat: 38.616857, lon: -89.990114 }
const PARS: number[] = [4,4,5,3,4,5,4,3,4, 4,3,4,4,5,3,4,5,4]
const TEES: Record<string, number[]> = {
  Black: [433,184,323,401,511,202,368,562,447, 433,184,323,401,511,202,368,562,447],
  Blue:  [363,160,296,378,470,180,333,492,384,  363,160,296,378,470,180,333,492,384],
  White: [350,145,290,356,451,160,317,465,329,  350,145,290,356,451,160,317,465,329],
  Silver:[305,125,273,350,430,141,297,426,313,  305,125,273,350,430,141,297,426,313],
  Red:   [303,105,102,324,401,113,264,424,311,  303,105,102,324,401,113,264,424,311]
}
const HOLES = Array.from({ length: 18 }, (_, i) => i + 1)

// --- Utilities ---
const toRad = (d:number)=>d*Math.PI/180
const yardsBetween = (a:{lat:number;lon:number}, b:{lat:number;lon:number})=>{
  const R=6371000, dLat=toRad(b.lat-a.lat), dLon=toRad(b.lon-a.lon)
  const aa=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2
  return (R*2*Math.atan2(Math.sqrt(aa),Math.sqrt(1-aa)))*1.09361
}
function cx(...c:(string|false|undefined)[]){return c.filter(Boolean).join(' ')}
function useLocal<T>(k:string, init:T){
  const [v,setV]=useState<T>(()=>{const r=localStorage.getItem(k);return r?JSON.parse(r):init})
  useEffect(()=>localStorage.setItem(k,JSON.stringify(v)),[k,v]);
  return [v,setV] as const
}

// --- Optional: Firebase realtime sync (paste config & set true) ---
const ENABLE_FIREBASE=false
const FIREBASE_CONFIG={}
let fb:any=null
if(ENABLE_FIREBASE){
  const { initializeApp } = await import('firebase/app')
  const { getDatabase, onValue, ref, update } = await import('firebase/database')
  fb={initializeApp,getDatabase,onValue,ref,update}
}

export default function App(){
  const [gameId, setGameId] = useLocal('sw:game', 'SW-'+new Date().toISOString().slice(0,10))
  const [teeSet, setTeeSet] = useLocal<keyof typeof TEES>('sw:tee', 'White')
  const [players, setPlayers] = useLocal<string[]>('sw:players',["Player 1","Player 2","Player 3","Player 4"])
  const [scores, setScores] = useLocal<number[][]>('sw:scores', Array.from({length:4},()=>Array(18).fill(0)))
  const [greens, setGreens] = useLocal<{lat:number;lon:number}[]>('sw:greens', HOLES.map(()=>COURSE_CENTER))
  const [hole, setHole] = useLocal<number>('sw:hole', 1)
  const [pos, setPos] = useState<{lat:number;lon:number}|null>(null)
  const [online,setOnline]=useState<boolean>(false)
  const watchRef = useRef<number|null>(null)

  // GPS watch
  useEffect(()=>{
    if(!navigator.geolocation) return
    watchRef.current = navigator.geolocation.watchPosition(p=>{
      setPos({lat:p.coords.latitude, lon:p.coords.longitude})
    },()=>{}, {enableHighAccuracy:true, maximumAge:2000, timeout:10000})
    return ()=>{ if(watchRef.current&&navigator.geolocation) navigator.geolocation.clearWatch(watchRef.current) }
  }, [])

  // Firebase sync (optional)
  useEffect(()=>{
    if(!ENABLE_FIREBASE||!fb) return
    const app = fb.initializeApp(FIREBASE_CONFIG)
    const db = fb.getDatabase(app)
    const base=(p:string)=>fb.ref(db,`stonewolf/${gameId}/${p}`)
    const push=()=>fb.update(base('state'),{teeSet,players,scores,greens,hole}).catch(()=>{})
    const on = fb.onValue(base('state'), (snap:any)=>{ const v=snap.val(); if(!v) return; setTeeSet(v.teeSet); setPlayers(v.players); setScores(v.scores); setGreens(v.greens); setHole(v.hole) })
    const i=setInterval(push, 800)
    setOnline(true)
    return ()=>{clearInterval(i)}
  },[gameId, teeSet, players, scores, greens, hole])

  const yardage = useMemo(()=> pos? Math.round(yardsBetween(pos, greens[hole-1])): null, [pos, greens, hole])
  const teeYards = TEES[teeSet][hole-1]

  const totals = useMemo(()=> players.map((_,pi)=>{
    const total=scores[pi].reduce((a,b)=>a+(b||0),0)
    return { total, toPar: total - PARS.reduce((a,b)=>a+b,0) }
  }), [scores, players])

  const setScore=(pi:number, hi:number, val:number)=>setScores(prev=>{const c=prev.map(r=>r.slice()); c[pi][hi]=val; return c})
  const reset=()=>{ if(!confirm('Reset round?'))return; setScores(Array.from({length:4},()=>Array(18).fill(0))); setGreens(HOLES.map(()=>COURSE_CENTER)); setHole(1) }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-950">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-3 sticky top-0 z-30">
        <motion.div initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="glass px-4 py-3 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-emerald-950 font-black">SW</div>
            <div>
              <div className="text-xl font-black tracking-tight">Stonewolf Golf</div>
              <div className="text-xs opacity-70">Course‑locked • Live 4‑player scoring</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input" value={gameId} onChange={e=>setGameId(e.target.value)} placeholder="Game ID (share)"/>
            <select className="input" value={teeSet} onChange={e=>setTeeSet(e.target.value as keyof typeof TEES)}>
              {Object.keys(TEES).map(t=> <option key={t}>{t}</option>)}
            </select>
            <button className="btn" onClick={reset}><RotateCcw className="mr-2 size-4"/>Reset</button>
            <div className={cx('px-2 py-1 rounded-lg text-xs flex items-center gap-1', online? 'bg-emerald-700/60':'bg-emerald-900/60')}>
              {online? <Wifi className="size-4"/>:<WifiOff className="size-4"/>} sync
            </div>
          </div>
        </motion.div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-28 space-y-4">
        {/* Top cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass p-4">
            <div className="flex items-center justify-between">
              <div className="card-title">Hole</div>
              <div className="flex gap-2">
                <button className="btn px-2" onClick={()=>setHole(h=>Math.max(1,h-1))}>−</button>
                <div className="px-3 py-1 rounded-xl bg-emerald-900 font-bold text-lg">{hole}</div>
                <button className="btn px-2" onClick={()=>setHole(h=>Math.min(18,h+1))}>+</button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="glass p-3">
                <div className="card-title">Par</div>
                <div className="text-2xl font-black">{PARS[hole-1]}</div>
              </div>
              <div className="glass p-3">
                <div className="card-title">Card Yards ({teeSet})</div>
                <div className="text-2xl font-black">{teeYards}</div>
              </div>
              <div className="col-span-2 glass p-3">
                <div className="card-title">GPS → Pin</div>
                <div className="text-3xl font-black flex items-center gap-2">
                  <SignalHigh className="size-5"/>
                  {yardage? `${yardage} yds` : '—'}
                </div>
                <div className="text-xs opacity-70 mt-1">Drag the red pin to today’s flag for precise yardage.</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="md:col-span-2 glass p-0 overflow-hidden">
            <MiniMap
              center={COURSE_CENTER}
              pin={greens[hole-1]}
              onMovePin={(p)=>setGreens(g=>g.map((gp,i)=>i===hole-1?p:gp))}
            />
          </motion.div>
        </div>

        {/* Players */}
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass p-4">
          <div className="flex items-center gap-2 mb-3"><Users className="size-4"/><div className="card-title">Players</div></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players.map((n,i)=>(
              <input key={i} className="input font-semibold" value={n} placeholder={`Player ${i+1}`}
                     onChange={e=>setPlayers(players.map((x,ix)=>ix===i?e.target.value:x))}/>
            ))}
          </div>
        </motion.div>

        {/* Scorecard */}
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass p-4 overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-emerald-900/70">
                <th className="text-left px-2 py-2 rounded-l-xl">Hole</th>
                {HOLES.map(h=> <th key={h} className={cx('px-2 py-2', h===hole && 'bg-emerald-800 font-bold rounded-t')}>{h}</th>)}
                <th className="px-2 py-2">Out</th>
                <th className="px-2 py-2">In</th>
                <th className="px-2 py-2 rounded-r-xl">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-900/40">
                <td className="px-2 py-1 font-semibold opacity-90">Par</td>
                {PARS.map((p,i)=> <td key={i} className="px-2 py-1 text-center opacity-90">{p}</td>)}
                <td className="px-2 py-1 text-center font-semibold">{PARS.slice(0,9).reduce((a,b)=>a+b,0)}</td>
                <td className="px-2 py-1 text-center font-semibold">{PARS.slice(9).reduce((a,b)=>a+b,0)}</td>
                <td className="px-2 py-1 text-center font-semibold">{PARS.reduce((a,b)=>a+b,0)}</td>
              </tr>
              {players.map((name,pi)=>{
                const out=scores[pi].slice(0,9).reduce((a,b)=>a+(b||0),0)
                const inn=scores[pi].slice(9).reduce((a,b)=>a+(b||0),0)
                const tot=out+inn
                return (
                  <tr key={pi} className="odd:bg-emerald-900/20">
                    <td className="px-2 py-1 font-semibold">{name||`Player ${pi+1}`}</td>
                    {HOLES.map((h,hi)=> (
                      <td key={h} className={cx('px-1 py-1 text-center', h===hole && 'bg-emerald-800/40 rounded')}>
                        <input inputMode="numeric" pattern="[0-9]*" className="w-12 text-center rounded-lg bg-emerald-950/60 border border-emerald-700 px-2 py-1"
                               value={scores[pi][hi]||''} onChange={e=>setScore(pi,hi,parseInt(e.target.value||'0'))}/>
                      </td>
                    ))}
                    <td className="px-2 py-1 text-center font-semibold">{out||''}</td>
                    <td className="px-2 py-1 text-center font-semibold">{inn||''}</td>
                    <td className="px-2 py-1 text-center font-black">{tot||''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {players.map((n,i)=> (
              <div key={i} className="glass p-3 flex items-center justify-between">
                <div className="font-semibold truncate mr-2">{n||`Player ${i+1}`}</div>
                <div className={cx('text-lg font-black', totals[i].toPar<0 && 'text-lime-300', totals[i].toPar>0 && 'text-rose-300')}>
                  {totals[i].total} ({totals[i].toPar>=0?'+':''}{totals[i].toPar})
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer / sticky tips */}
      <div className="fixed bottom-4 left-0 right-0 pointer-events-none">
        <div className="max-w-6xl mx-auto px-4">
          <div className="pointer-events-auto glass px-3 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2"><Flag className="size-4"/> Stonewolf only • Drag pin to flag • Add to Home Screen for PWA</div>
            <div className="opacity-70">v1.0</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function latLonToTile(lat:number, lon:number, zoom:number){
  const latRad=lat*Math.PI/180; const n=2**zoom
  const xtile=n*((lon+180)/360); const ytile=n*(1-(Math.log(Math.tan(latRad)+1/Math.cos(latRad))/Math.PI))/2
  return {xtile, ytile}
}
function MiniMap({center, pin, onMovePin}:{center:{lat:number;lon:number}, pin:{lat:number;lon:number}, onMovePin:(p:{lat:number;lon:number})=>void}){
  const zoom=16, size=512
  const {xtile, ytile}=latLonToTile(center.lat, center.lon, zoom)
  const cx=Math.floor(xtile), cy=Math.floor(ytile)
  const toPx=(lat:number,lon:number)=>{const p=latLonToTile(lat,lon,zoom); return {x:(p.xtile-cx)*size,y:(p.ytile-cy)*size}}
  const toLL=(x:number,y:number)=>{const xt=cx+x/size, yt=cy+y/size; const n=Math.PI-2*Math.PI*yt/2**zoom; const lat=180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))); const lon=xt/2**zoom*360-180; return {lat,lon}}
  const pinPx=toPx(pin.lat, pin.lon)
  const ref=React.useRef<HTMLDivElement|null>(null)
  const drag=React.useRef(false)

  const onPointerDown=(e:React.PointerEvent)=>{drag.current=true; (e.target as HTMLElement).setPointerCapture(e.pointerId)}
  const onPointerUp=(e:React.PointerEvent)=>{drag.current=false; (e.target as HTMLElement).releasePointerCapture(e.pointerId)}
  const onPointerMove=(e:React.PointerEvent)=>{
    if(!drag.current||!ref.current) return
    const r=ref.current.getBoundingClientRect(); const x=Math.max(0,Math.min(r.width,e.clientX-r.left)); const y=Math.max(0,Math.min(r.height,e.clientY-r.top))
    onMovePin(toLL(x,y))
  }
  const onContext=(e:React.MouseEvent)=>{e.preventDefault(); if(!ref.current)return; const r=ref.current.getBoundingClientRect(); onMovePin(toLL(e.clientX-r.left,e.clientY-r.top))}

  return (
    <div className="relative" onContextMenu={onContext}>
      <div ref={ref} className="relative w-full aspect-[1.8] select-none" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMove={onPointerMove}>
        <img className="w-full h-full object-cover opacity-[0.98]" alt="Stonewolf map tile" src={`https://tile.openstreetmap.org/${zoom}/${cx}/${cy}.png`} />
        <div className="absolute -translate-x-1/2 -translate-y-full" style={{left: pinPx.x, top: pinPx.y}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-red-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            <path d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"/>
            <circle cx="12" cy="11" r="3" fill="white"/>
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 text-[11px] bg-black/40 px-2 py-1 rounded-md flex items-center gap-1"><MapPin className="size-3"/>Drag/long‑press to move</div>
      </div>
    </div>
  )
}
*/

// ===== public/icons (placeholders) =====
/*
(Add two PNGs named icon-192.png and icon-512.png – any square logo works.)
*/
