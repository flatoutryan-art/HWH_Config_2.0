import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Info, Trash2, RotateCcw, MousePointer, Move } from "lucide-react";

// --- BRAND --------------------------------------------------------------------
const B = {
  dark:"#251917", orange:"#D96339", gold:"#EBBD46",
  cream:"#F5F0E8", parchment:"#EDE8DC", white:"#FFFFFF",
};

const GRID_COLS  = 60;
const GRID_ROWS  = 30;
const FLOOR_ROW  = 20;
const HINGE_PRICE  = 85;
const RUNNER_PRICE = 280;
const LABOUR_MULT  = { melamine: 3.5, solid_wood: 6.0 };

function doorCount(cab) {
  if (cab.cat === "Tall") return 4;
  if (cab.cat === "Wall" && cab.wC < 9) return 1;
  return 2;
}
function runnerPairs(cab) { return cab.isDrawer ? 3 : 0; } // 3 drawer boxes per unit = 3 runner pairs

const PM = {
  cabinets: {
    // -- FLOOR --------------------------------------------------------
    floor_450:   {label:"Floor 450",   cat:"Floor",  price:2600, wMm:450,  wC:4,  hC:9,  color:"#C8BA9E", isDrawer:false},
    floor_600:   {label:"Floor 600",   cat:"Floor",  price:3200, wMm:600,  wC:6,  hC:9,  color:"#C8BA9E", isDrawer:false},
    floor_750:   {label:"Floor 750",   cat:"Floor",  price:3700, wMm:750,  wC:7,  hC:9,  color:"#C8BA9E", isDrawer:false},
    floor_900:   {label:"Floor 900",   cat:"Floor",  price:4100, wMm:900,  wC:9,  hC:9,  color:"#C8BA9E", isDrawer:false},
    floor_1200:  {label:"Floor 1200",  cat:"Floor",  price:5200, wMm:1200, wC:12, hC:9,  color:"#C8BA9E", isDrawer:false},
    // -- DRAWER -------------------------------------------------------
    drawer_450:  {label:"Drawer 450",  cat:"Floor",  price:3400, wMm:450,  wC:4,  hC:9,  color:"#BEB09A", isDrawer:true },
    drawer_600:  {label:"Drawer 600",  cat:"Floor",  price:4600, wMm:600,  wC:6,  hC:9,  color:"#BEB09A", isDrawer:true },
    drawer_750:  {label:"Drawer 750",  cat:"Floor",  price:5100, wMm:750,  wC:7,  hC:9,  color:"#BEB09A", isDrawer:true },
    drawer_900:  {label:"Drawer 900",  cat:"Floor",  price:5400, wMm:900,  wC:9,  hC:9,  color:"#BEB09A", isDrawer:true },
    drawer_1200: {label:"Drawer 1200", cat:"Floor",  price:6500, wMm:1200, wC:12, hC:9,  color:"#BEB09A", isDrawer:true },
    // -- WALL ---------------------------------------------------------
    wall_450:    {label:"Wall 450",    cat:"Wall",   price:1800, wMm:450,  wC:4,  hC:7,  color:"#D8D0C0", isDrawer:false},
    wall_600:    {label:"Wall 600",    cat:"Wall",   price:2100, wMm:600,  wC:6,  hC:7,  color:"#D8D0C0", isDrawer:false},
    wall_750:    {label:"Wall 750",    cat:"Wall",   price:2450, wMm:750,  wC:7,  hC:7,  color:"#D8D0C0", isDrawer:false},
    wall_900:    {label:"Wall 900",    cat:"Wall",   price:2800, wMm:900,  wC:9,  hC:7,  color:"#D8D0C0", isDrawer:false},
    wall_1200:   {label:"Wall 1200",   cat:"Wall",   price:3600, wMm:1200, wC:12, hC:7,  color:"#D8D0C0", isDrawer:false},
    // -- TALL ---------------------------------------------------------
    tall_450:    {label:"Tall 450",    cat:"Tall",   price:8200, wMm:450,  wC:4,  hC:27, color:"#BCA882", isDrawer:false},
    tall_600:    {label:"Tall 600",    cat:"Tall",   price:9000, wMm:600,  wC:6,  hC:27, color:"#BCA882", isDrawer:false},
    tall_750:    {label:"Tall 750",    cat:"Tall",   price:10200,wMm:750,  wC:7,  hC:27, color:"#BCA882", isDrawer:false},
    tall_pantry: {label:"Tall Pantry", cat:"Tall",   price:9800, wMm:600,  wC:6,  hC:27, color:"#BCA882", isDrawer:false},
    tall_broom:  {label:"Tall Broom",  cat:"Tall",   price:8900, wMm:600,  wC:6,  hC:27, color:"#BCA882", isDrawer:false},
    tall_1200:   {label:"Tall 1200",   cat:"Tall",   price:12500,wMm:1200, wC:12, hC:27, color:"#BCA882", isDrawer:false},
    // -- CORNER -------------------------------------------------------
    corner_450:  {label:"Corner 450",  cat:"Corner", price:4200, wMm:450,  wC:4,  hC:9,  color:"#B0A08A", isDrawer:false},
    corner_600:  {label:"Corner 600",  cat:"Corner", price:5000, wMm:600,  wC:6,  hC:9,  color:"#B0A08A", isDrawer:false},
    corner_750:  {label:"Corner 750",  cat:"Corner", price:5600, wMm:750,  wC:7,  hC:9,  color:"#B0A08A", isDrawer:false},
    corner_lazy: {label:"Corner L.S.", cat:"Corner", price:6200, wMm:900,  wC:9,  hC:9,  color:"#B0A08A", isDrawer:false},
    corner_blind:{label:"Corner Blind",cat:"Corner", price:4800, wMm:600,  wC:6,  hC:9,  color:"#B0A08A", isDrawer:false},
    corner_1200: {label:"Corner 1200", cat:"Corner", price:7200, wMm:1200, wC:12, hC:9,  color:"#B0A08A", isDrawer:false},
  },
  carcass: {
    melamine:   {label:"Melamine Board", matType:"melamine",   color:"#F0EDE5"},
    solid_wood: {label:"Solid Wood",     matType:"solid_wood", color:"#C8924A"},
  },
  countertop: {
    // -- FORMICA (laminate) -- ppm 950 -----------------------------
    formica_white:   {label:"Formica White",    group:"Formica", ppm:950,  color:"#F4F2EE"},
    formica_ivory:   {label:"Formica Ivory",    group:"Formica", ppm:950,  color:"#EDE6D5"},
    formica_concrete:{label:"Formica Concrete", group:"Formica", ppm:950,  color:"#A8A49E"},
    formica_slate:   {label:"Formica Slate",    group:"Formica", ppm:950,  color:"#6E6E6A"},
    formica_oak:     {label:"Formica Oak",      group:"Formica", ppm:1050, color:"#C8A870"},
    formica_wenge:   {label:"Formica Wenge",    group:"Formica", ppm:1050, color:"#4A3428"},
    // -- QUARTZ -- ppm 6500 ----------------------------------------
    quartz_arctic:   {label:"Quartz Arctic",    group:"Quartz",  ppm:6500, color:"#F0EEEB"},
    quartz_calacatta:{label:"Quartz Calacatta", group:"Quartz",  ppm:6800, color:"#EDE8E0"},
    quartz_grigio:   {label:"Quartz Grigio",    group:"Quartz",  ppm:6500, color:"#B8B4AE"},
    quartz_charcoal: {label:"Quartz Charcoal",  group:"Quartz",  ppm:6800, color:"#4A4A48"},
    quartz_pearl:    {label:"Quartz Pearl",     group:"Quartz",  ppm:6500, color:"#D8D0C4"},
    quartz_nero:     {label:"Quartz Nero",      group:"Quartz",  ppm:7200, color:"#2A2824"},
  },
  doors: {
    supawood_white: {label:"Supawood White",    ppd:680,  color:"#F0F0EC", wood:false},
    supawood_grey:  {label:"Supawood Dove",     ppd:680,  color:"#C0C0BC", wood:false},
    veneer_oak:     {label:"Oak Veneer",        ppd:1400, color:"#C4914A", wood:true },
    veneer_walnut:  {label:"Walnut Veneer",     ppd:1600, color:"#6B3E26", wood:true },
    mel_charcoal:   {label:"Melamine Charcoal", ppd:520,  color:"#3D3D3D", wood:false},
    mel_navy:       {label:"Melamine Navy",     ppd:520,  color:"#1B2A4A", wood:false},
    mel_sage:       {label:"Melamine Sage",     ppd:520,  color:"#8FAF8A", wood:false},
    mel_terracotta: {label:"Melamine Terra",    ppd:520,  color:"#C4704A", wood:false},
  },
  handles: {
    black_bar:  {label:"Black Bar Handle",   pe:185},
    brass_cup:  {label:"Brushed Brass Cup",  pe:245},
    brass_bar:  {label:"Brushed Brass Bar",  pe:265},
    integrated: {label:"Integrated J-Pull",  pe:0  },
    chrome_bar: {label:"Satin Chrome Bar",   pe:195},
  },
};

// -- APPLIANCES (display only -- no cost, no run metres) ------------------------
// wC = width in 100mm grid cells, hC = height in cells (floor-snapped)
// All floor-height (hC=9 = 720mm+kick zone) except fridges which are taller
const APPLIANCES = {
  washing_machine: {label:"Washing Machine", wMm:600, wC:6, hC:9,  color:"#E8E8EC", icon:"wash"  },
  tumble_dryer:    {label:"Tumble Dryer",    wMm:600, wC:6, hC:9,  color:"#ECEAE8", icon:"dry"   },
  dishwasher:      {label:"Dishwasher",      wMm:600, wC:6, hC:9,  color:"#E8ECE8", icon:"dish"  },
  fridge_single:   {label:"Single Fridge",   wMm:600, wC:6, hC:22, color:"#EAEAEC", icon:"fridge1"},
  fridge_double:   {label:"Double Fridge",   wMm:900, wC:9, hC:22, color:"#EAEAEC", icon:"fridge2"},
  oven:            {label:"Oven Unit",        wMm:600, wC:6, hC:9,  color:"#E8E4E0", icon:"oven",    isWall:false},
  extractor:       {label:"Extractor Fan",   wMm:600, wC:6, hC:7,  color:"#E4E4E8", icon:"extractor",isWall:true },
};

const STEPS = ["Layout","Materials","Finishes","Preview","Quote","Plans"];
const CATS  = ["Floor","Drawer","Wall","Tall","Corner","Appliance"];

function fmt(n){ return `R ${Math.round(n).toLocaleString("en-ZA")}`; }

function calcQ(placed, carcKey, ctKey, doorKey, handleKey) {
  // Exclude appliances from all pricing -- display only
  const cabPlaced = placed.filter(p => !APPLIANCES[p.tid]);
  if (!cabPlaced.length) return {cab:0,ctr:0,dr:0,hinges:0,runners:0,hnd:0,total:0,ctMm:0,totalDoorLeaves:0,totalRunnerPairs:0,details:[]};
  const placed_ = cabPlaced; // shadow for rest of function
  const carcM   = PM.carcass[carcKey];
  const labMult = carcM ? LABOUR_MULT[carcM.matType] : LABOUR_MULT.melamine;
  const cab     = placed_.reduce((s,p) => s + cabDef(p.tid).price, 0) * labMult;
  const ctUnits = placed_.filter(p => ["Floor","Corner"].includes(cabDef(p.tid).cat));
  const ctMm    = ctUnits.reduce((s,p) => s + cabDef(p.tid).wMm, 0);
  const ctr     = (PM.countertop[ctKey]?.ppm || 0) * (ctMm / 1000);
  const totalDoorLeaves  = placed_.reduce((s,p) => s + doorCount(cabDef(p.tid)), 0);
  const totalRunnerPairs = placed_.reduce((s,p) => s + runnerPairs(cabDef(p.tid)), 0);
  const dr      = (PM.doors[doorKey]?.ppd    || 0) * totalDoorLeaves;
  const hinges  = totalDoorLeaves * 2 * HINGE_PRICE;
  const runners = totalRunnerPairs * RUNNER_PRICE;
  const hnd     = (PM.handles[handleKey]?.pe || 0) * totalDoorLeaves;
  const details = placed_.map(p => {
    const c = cabDef(p.tid);
    const dc = doorCount(c), rp = runnerPairs(c);
    return {
      id:p.id, label:c.label, col:p.col,
      unitBase: c.price * labMult,
      doorCost: (PM.doors[doorKey]?.ppd||0)*dc,
      hingeCost: dc*2*HINGE_PRICE,
      runnerCost: rp*RUNNER_PRICE,
      handleCost: (PM.handles[handleKey]?.pe||0)*dc,
      dc, rp,
    };
  });
  return {cab,ctr,dr,hinges,runners,hnd,total:cab+ctr+dr+hinges+runners+hnd,ctMm,totalDoorLeaves,totalRunnerPairs,details};
}

function overlaps(placed, col, row, wc, hc, skipId=null) {
  return placed.some(p => {
    if (p.id === skipId) return false;
    const c = APPLIANCES[p.tid] || PM.cabinets[p.tid];
    if (!c) return false;
    return col < p.col+c.wC && col+wc > p.col && row < p.row+c.hC && row+hc > p.row;
  });
}

// --- LOGO ---------------------------------------------------------------------
function Logo({size=20}){
  const cs=[{bg:B.orange,d:B.gold,dot:B.dark},{bg:B.dark,d:B.white,dot:B.orange},{bg:B.gold,d:B.orange,dot:B.dark}];
  return(
    <div className="flex gap-0.5">
      {cs.map((c,i)=>(
        <svg key={i} width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="20" fill={c.bg}/>
          <polygon points="20,6 34,20 20,34 6,20" fill={c.d}/>
          <circle cx="20" cy="20" r="6" fill={c.dot}/>
        </svg>
      ))}
    </div>
  );
}


// Safe lookup -- returns cabinet or appliance definition for any tid
function cabDef(tid){ return PM.cabinets[tid] || APPLIANCES[tid] || {}; }
// --- CABINET SVG --------------------------------------------------------------
// Fine-line architectural style: thin strokes, minimal padding, clean reveals
function CabSVG({tid, cs, doorColor, doorKey="supawood_white", sel, handleKey="black_bar"}){
  const cab    = cabDef(tid);
  const w      = cab.wC * cs;
  const h      = cab.hC * cs;
  const dc     = doorColor || "#EAE4DC";
  const stroke = sel ? B.orange : "#9A8E82";
  const sw     = sel ? 1.5 : 0.6;                   // much thinner carcass outline
  const kickH   = cab.cat==="Wall" ? 0 : Math.round(1.5*cs);
  const fillerH = (cab.cat==="Tall" || cab.cat==="Wall") ? Math.round(1.5*cs) : 0;
  const bodyTop = fillerH;
  const bodyH   = h - fillerH - kickH;
  const pad     = Math.max(1.5, cs * 0.09);          // tighter pad — was 0.18
  const reveal  = Math.max(1, cs * 0.07);            // fine reveal gap

  // Lighter, more neutral carcass fill
  const carcassFill = cab.color;

  // -- Handle renderer ----------------------------------------------------------
  function Handle({x, y, dw, dh, isDrawerFront=false}){
    const hk = handleKey;
    const hcx = x + dw/2;
    const hy  = isDrawerFront ? y + dh/2 : y + dh*0.68;

    if(hk==="integrated"){
      return <rect x={x+dw*0.12} y={y+dh*0.07} width={dw*0.76} height={Math.max(1.5,dh*0.055)}
        fill="rgba(0,0,0,0.20)" rx="0.5"/>;
    }
    if(hk==="brass_cup"){
      const r = Math.max(2, dw*0.07);
      return <g>
        <circle cx={hcx} cy={hy} r={r} fill="none" stroke="#C8A850" strokeWidth="0.8"/>
        <circle cx={hcx} cy={hy} r={r*0.4} fill="#C8A850" opacity="0.6"/>
      </g>;
    }
    if(hk==="brass_bar" || hk==="chrome_bar"){
      const barColor = hk==="brass_bar" ? "#C8A850" : "#B8B8C0";
      const barW = isDrawerFront ? dw*0.5 : Math.max(3, dw*0.08);
      const barH = isDrawerFront ? Math.max(1.5, dh*0.10) : Math.max(4, dh*0.26);
      return <rect x={hcx-barW/2} y={hy-barH/2} width={barW} height={barH}
        fill={barColor} rx={Math.min(barW,barH)/2} opacity="0.9"/>;
    }
    // black_bar default
    const barW = isDrawerFront ? dw*0.5 : Math.max(3, dw*0.08);
    const barH = isDrawerFront ? Math.max(1.5, dh*0.10) : Math.max(4, dh*0.26);
    return <rect x={hcx-barW/2} y={hy-barH/2} width={barW} height={barH}
      fill="#1E1208" rx={Math.min(barW,barH)/2} opacity="0.75"/>;
  }

  // -- Door panel — fine-line architectural style --------------------------------
  function Door({x, y, dw, dh, isDrawerFront=false}){
    return(
      <g>
        {/* Door face — light fill, clean outline only */}
        <rect x={x+reveal} y={y+reveal} width={dw-reveal*2} height={dh-reveal*2}
          fill={dc} stroke={stroke} strokeWidth="0.5" rx="0.5"/>
        {/* Single fine shadow line at bottom and right — subtle depth */}
        <line x1={x+reveal+1}     y1={y+dh-reveal}   x2={x+dw-reveal}   y2={y+dh-reveal}
          stroke="rgba(0,0,0,0.10)" strokeWidth="0.5"/>
        <line x1={x+dw-reveal}    y1={y+reveal+1}     x2={x+dw-reveal}   y2={y+dh-reveal}
          stroke="rgba(0,0,0,0.10)" strokeWidth="0.5"/>
        {/* Wood grain — very subtle for veneer */}
        {["veneer_oak","veneer_walnut"].includes(doorKey) && [0.3,0.6].map((t,i)=>(
          <line key={i}
            x1={x+reveal+dw*t*0.65} y1={y+reveal+2}
            x2={x+reveal+dw*t*0.65+dw*0.03} y2={y+dh-reveal-2}
            stroke="rgba(0,0,0,0.06)" strokeWidth="0.6"/>
        ))}
        <Handle x={x+reveal} y={y+reveal} dw={dw-reveal*2} dh={dh-reveal*2} isDrawerFront={isDrawerFront}/>
      </g>
    );
  }

  // -- Door layout per cabinet type ----------------------------------------------
  let doors;
  if(cab.isDrawer){
    const gap = Math.max(1.5, pad*0.8);
    const totalGap = gap*(4);
    const frontH = (bodyH - totalGap) / 3;
    doors=<>{[0,1,2].map(i=>(
      <Door key={i} x={pad} y={bodyTop+gap+i*(frontH+gap)} dw={w-pad*2} dh={frontH} isDrawerFront={true}/>
    ))}</>;
  } else if(cab.cat==="Tall"){
    const midY    = bodyTop + bodyH/2;
    const secH    = bodyH/2 - pad*1.2;
    const halfW   = (w - pad*3) / 2;
    doors=<>
      <Door x={pad}         y={bodyTop+pad} dw={halfW} dh={secH}/>
      <Door x={pad*2+halfW} y={bodyTop+pad} dw={halfW} dh={secH}/>
      <Door x={pad}         y={midY+pad*0.4} dw={halfW} dh={secH}/>
      <Door x={pad*2+halfW} y={midY+pad*0.4} dw={halfW} dh={secH}/>
    </>;
  } else if(cab.cat==="Wall" && cab.wC<9){
    doors=<Door x={pad} y={bodyTop+pad} dw={w-pad*2} dh={bodyH-pad*2}/>;
  } else {
    const halfW = (w - pad*3) / 2;
    doors=<>
      <Door x={pad}         y={bodyTop+pad} dw={halfW} dh={bodyH-pad*2}/>
      <Door x={pad*2+halfW} y={bodyTop+pad} dw={halfW} dh={bodyH-pad*2}/>
    </>;
  }

  return(
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block",pointerEvents:"none"}}>
      {/* Carcass body — clean flat fill, single thin outline */}
      <rect x={0} y={0} width={w} height={h} fill={carcassFill} stroke={stroke} strokeWidth={sw}/>

      {/* Filler strip — fine label only */}
      {fillerH>0&&<>
        <rect x={0.5} y={0.5} width={w-1} height={fillerH-0.5}
          fill="#C4AA78" stroke={stroke} strokeWidth="0.4"/>
        <text x={w/2} y={fillerH/2+2.5} textAnchor="middle"
          fontSize={Math.max(4,cs*0.38)} fill="rgba(255,255,255,0.85)"
          fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">FILLER</text>
      </>}

      {/* Kick plate — fine bottom band */}
      {kickH>0&&<>
        <rect x={0.5} y={h-kickH} width={w-1} height={kickH-0.5}
          fill="#8A7860" stroke={stroke} strokeWidth="0.4"/>
        <text x={w/2} y={h-kickH/2+2.5} textAnchor="middle"
          fontSize={Math.max(4,cs*0.38)} fill="rgba(220,200,170,0.9)"
          fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">KICK</text>
      </>}

      {/* Centre divider line for double-door units — fine vertical line */}
      {!cab.isDrawer && cab.cat!=="Tall" && !(cab.cat==="Wall"&&cab.wC<9) && (
        <line x1={w/2} y1={bodyTop+pad+reveal} x2={w/2} y2={bodyTop+bodyH-pad-reveal}
          stroke={stroke} strokeWidth="0.4" opacity="0.5"/>
      )}

      {doors}

      {/* Selection ring */}
      {sel&&<rect x={0.5} y={0.5} width={w-1} height={h-1}
        fill="none" stroke={B.orange} strokeWidth="1.2" strokeDasharray="4 2"/>}

      {/* Width label — small, tucked into kick or body base */}
      <text x={w/2} y={bodyTop+bodyH-(kickH>0?1:3)} textAnchor="middle"
        fontSize={Math.max(5,cs*0.52)} fill={sel?B.orange:"rgba(80,65,48,0.6)"}
        fontWeight="600" fontFamily="sans-serif">{cab.wMm}</text>
    </svg>
  );
}


// --- APPLIANCE SVG ------------------------------------------------------------
function ApplianceSVG({aid, cs, sel}){
  const ap  = APPLIANCES[aid];
  const w   = ap.wC * cs;
  const h   = ap.hC * cs;
  const stroke = sel ? B.orange : "#9A9AB0";
  const sw     = sel ? 2 : 1;
  const cx=w/2, cy=h/2;

  const icons = {
    wash: <>
      <circle cx={cx} cy={cy*0.9} r={w*0.28} fill="none" stroke={stroke} strokeWidth="1.5"/>
      <circle cx={cx} cy={cy*0.9} r={w*0.14} fill={ap.color} stroke={stroke} strokeWidth="1"/>
      <rect x={w*0.1} y={h*0.75} width={w*0.8} height={h*0.06} fill={stroke} opacity="0.4" rx="1"/>
      <text x={cx} y={h*0.92} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">WASH</text>
    </>,
    dry: <>
      <circle cx={cx} cy={cy*0.9} r={w*0.28} fill="none" stroke={stroke} strokeWidth="1.5"/>
      <circle cx={cx} cy={cy*0.9} r={w*0.1} fill={stroke} opacity="0.5"/>
      {[0,1,2,3,4,5].map(i=><line key={i} x1={cx} y1={cy*0.9} x2={cx+w*0.22*Math.cos(i*Math.PI/3)} y2={cy*0.9+w*0.22*Math.sin(i*Math.PI/3)} stroke={stroke} strokeWidth="0.8" opacity="0.4"/>)}
      <text x={cx} y={h*0.92} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">DRY</text>
    </>,
    dish: <>
      <rect x={w*0.2} y={h*0.15} width={w*0.6} height={h*0.55} fill="none" stroke={stroke} strokeWidth="1" rx="2"/>
      {[0.3,0.45,0.6].map((t,i)=><line key={i} x1={w*0.25} y1={h*t} x2={w*0.75} y2={h*t} stroke={stroke} strokeWidth="0.7" opacity="0.5"/>)}
      <text x={cx} y={h*0.88} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">DISH</text>
    </>,
    fridge1: <>
      <rect x={w*0.12} y={h*0.04} width={w*0.76} height={h*0.48} fill="rgba(255,255,255,0.4)" stroke={stroke} strokeWidth="1" rx="2"/>
      <rect x={w*0.12} y={h*0.54} width={w*0.76} height={h*0.36} fill="rgba(255,255,255,0.25)" stroke={stroke} strokeWidth="1" rx="2"/>
      <rect x={w*0.44} y={h*0.24} width={w*0.12} height={h*0.08} fill={stroke} opacity="0.5" rx="1"/>
      <rect x={w*0.44} y={h*0.67} width={w*0.12} height={h*0.08} fill={stroke} opacity="0.5" rx="1"/>
      <text x={cx} y={h*0.96} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">FRIDGE</text>
    </>,
    fridge2: <>
      <rect x={w*0.08} y={h*0.04} width={w*0.4} height={h*0.84} fill="rgba(255,255,255,0.4)" stroke={stroke} strokeWidth="1" rx="2"/>
      <rect x={w*0.52} y={h*0.04} width={w*0.4} height={h*0.84} fill="rgba(255,255,255,0.25)" stroke={stroke} strokeWidth="1" rx="2"/>
      <rect x={w*0.26} y={h*0.42} width={w*0.08} height={h*0.12} fill={stroke} opacity="0.5" rx="1"/>
      <rect x={w*0.66} y={h*0.42} width={w*0.08} height={h*0.12} fill={stroke} opacity="0.5" rx="1"/>
      <text x={cx} y={h*0.96} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">DBL FRIDGE</text>
    </>,
    oven: <>
      {/* Oven body outline */}
      <rect x={w*0.08} y={h*0.06} width={w*0.84} height={h*0.86} fill="rgba(255,255,255,0.15)" stroke={stroke} strokeWidth="1.2" rx="2"/>
      {/* Control panel strip at top */}
      <rect x={w*0.08} y={h*0.06} width={w*0.84} height={h*0.14} fill={stroke} opacity="0.15" rx="2"/>
      {/* 4 control knobs */}
      {[0.22,0.38,0.62,0.78].map((t,i)=>(
        <g key={i}>
          <circle cx={w*t} cy={h*0.13} r={w*0.055} fill="none" stroke={stroke} strokeWidth="1" opacity="0.8"/>
          <circle cx={w*t} cy={h*0.13} r={w*0.02} fill={stroke} opacity="0.7"/>
        </g>
      ))}
      {/* Oven door window */}
      <rect x={w*0.16} y={h*0.26} width={w*0.68} height={h*0.42} fill="rgba(255,255,255,0.25)" stroke={stroke} strokeWidth="0.8" rx="2"/>
      {/* Inner window frame */}
      <rect x={w*0.22} y={h*0.31} width={w*0.56} height={h*0.32} fill="rgba(0,0,0,0.08)" stroke={stroke} strokeWidth="0.5" rx="1"/>
      {/* Door handle bar */}
      <rect x={w*0.16} y={h*0.72} width={w*0.68} height={h*0.06} fill={stroke} opacity="0.5" rx="2"/>
      {/* Bottom drawer strip */}
      <rect x={w*0.08} y={h*0.80} width={w*0.84} height={h*0.10} fill="none" stroke={stroke} strokeWidth="0.7" rx="1" opacity="0.5"/>
      <text x={cx} y={h*0.96} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">OVEN</text>
    </>,
    extractor: <>
      {/* Housing body */}
      <rect x={w*0.08} y={h*0.06} width={w*0.84} height={h*0.82} fill="rgba(255,255,255,0.15)" stroke={stroke} strokeWidth="1.2" rx="3"/>
      {/* Canopy slope — trapezoid */}
      <path d={`M${w*0.08},${h*0.24} L${w*0.18},${h*0.06} L${w*0.82},${h*0.06} L${w*0.92},${h*0.24} Z`}
        fill={stroke} opacity="0.12" stroke={stroke} strokeWidth="0.8"/>
      {/* Filter grille lines */}
      {[0.38,0.50,0.62].map((t,i)=>(
        <line key={i} x1={w*0.14} y1={h*t} x2={w*0.86} y2={h*t} stroke={stroke} strokeWidth="1.2" opacity="0.35"/>
      ))}
      {/* Centre fan circle */}
      <circle cx={cx} cy={h*0.50} r={w*0.18} fill="none" stroke={stroke} strokeWidth="1" opacity="0.6"/>
      {/* Fan blades */}
      {[0,1,2,3].map(i=>(
        <path key={i}
          d={`M${cx},${h*0.50} Q${cx+w*0.14*Math.cos((i*Math.PI/2)+0.4)},${h*0.50+w*0.14*Math.sin((i*Math.PI/2)+0.4)} ${cx+w*0.15*Math.cos(i*Math.PI/2)},${h*0.50+w*0.15*Math.sin(i*Math.PI/2)}`}
          fill={stroke} opacity="0.4"/>
      ))}
      {/* Control strip at top */}
      <rect x={w*0.25} y={h*0.08} width={w*0.18} height={h*0.07} fill={stroke} opacity="0.3" rx="1"/>
      <rect x={w*0.50} y={h*0.08} width={w*0.25} height={h*0.07} fill={stroke} opacity="0.2" rx="1"/>
      <text x={cx} y={h*0.94} textAnchor="middle" fontSize={Math.max(6,cs*0.55)} fill={stroke} fontWeight="700" fontFamily="sans-serif">EXTRACTOR</text>
    </>,
  };

  return(
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block",pointerEvents:"none"}}>
      <rect x={0} y={0} width={w} height={h} fill={ap.color} stroke={stroke} strokeWidth={sw} rx="2"/>
      <rect x={0} y={0} width={w} height={h} fill="url(#cg_ap)" stroke="none" opacity="0.5"/>
      {icons[ap.icon]}
      {sel&&<rect x={1} y={1} width={w-2} height={h-2} fill="none" stroke={B.orange} strokeWidth="1.5" strokeDasharray="3 2"/>}
    </svg>
  );
}

// --- WALL GRID ----------------------------------------------------------------
function WallGrid({placed, setPlaced, selType, door, handle, cs, gridCols=60, setGridCols}){
  const gridRef  = useRef(null);
  const [selId,  setSelId] = useState(null);
  const [ghost,  setGhost] = useState(null);
  const [mode,   setMode]  = useState("place");

  // Always-fresh refs -- the key fix: event listeners read these, never stale closures
  const R = useRef({ placed, selType, mode, cs, gridCols, drag: null });
  useEffect(() => { R.current.placed  = placed;  }, [placed]);
  useEffect(() => { R.current.selType = selType; }, [selType]);
  useEffect(() => { R.current.mode    = mode;    }, [mode]);
  useEffect(() => { R.current.cs      = cs;      }, [cs]);
  useEffect(() => { R.current.gridCols = gridCols; }, [gridCols]);

  const doorColor = PM.doors[door]?.color;

  function gridPos(cx, cy) {
    const el = gridRef.current;
    if (!el) return null;
    const r   = el.getBoundingClientRect();
    const csz = R.current.cs;
    return {
      col: Math.max(0, Math.min(Math.floor((cx-r.left)/csz), R.current.gridCols-1)),
      row: Math.max(0, Math.min(Math.floor((cy-r.top) /csz), GRID_ROWS-1)),
    };
  }

  function snapPos(col, row, tid) {
    // Check appliance first
    if (APPLIANCES[tid]) {
      const ap = APPLIANCES[tid];
      // Fridges are tall, wall appliances snap to wall zone, others snap to floor
      const isTallApp = ap.hC > 10;
      const isWallApp = ap.isWall === true;
      const sr = isTallApp ? (FLOOR_ROW + 9) - ap.hC
               : isWallApp ? (FLOOR_ROW + 9) - PM.cabinets["tall_pantry"].hC
               : FLOOR_ROW;
      return { col: Math.max(0, Math.min(col, R.current.gridCols - ap.wC)), row: Math.max(0, sr) };
    }
    const cab = cabDef(tid);
    let sr;
    if      (cab.cat==="Wall") sr = (FLOOR_ROW + 9) - PM.cabinets["tall_pantry"].hC; // align top with tall units
    else if (cab.cat==="Tall") sr = (FLOOR_ROW + 9) - cab.hC;
    else                       sr = FLOOR_ROW;
    return { col: Math.max(0, Math.min(col, R.current.gridCols-cab.wC)), row: sr };
  }

  // Attach all grid event listeners once, read live values via R.current
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    function doMove(cx, cy) {
      const pos = gridPos(cx, cy);
      if (!pos) return;
      const { drag, placed: pl, selType: st, mode: m } = R.current;

      if (drag) {
        const p = pl.find(x => x.id === drag.id);
        if (!p) return;
        const cab = APPLIANCES[p.tid] || PM.cabinets[p.tid];
        const { col, row } = snapPos(pos.col-drag.oc, pos.row-drag.or, p.tid);
        const valid = col+cab.wC<=R.current.gridCols && row+cab.hC<=GRID_ROWS && !overlaps(pl,col,row,cab.wC,cab.hC,drag.id);
        setGhost({ col, row, tid: p.tid, valid });
        return;
      }
      if (m==="place" && st) {
        const cab = APPLIANCES[st] || PM.cabinets[st];
        const { col, row } = snapPos(pos.col, pos.row, st);
        const valid = col+cab.wC<=R.current.gridCols && row+cab.hC<=GRID_ROWS && !overlaps(pl,col,row,cab.wC,cab.hC);
        setGhost({ col, row, tid: st, valid });
      } else {
        setGhost(null);
      }
    }

    function doPlace(cx, cy) {
      const { drag, placed: pl, selType: st, mode: m } = R.current;
      if (drag) return;
      if (m==="place" && st) {
        const pos = gridPos(cx, cy);
        if (!pos) return;
        const cab = APPLIANCES[st] || PM.cabinets[st];
        const { col, row } = snapPos(pos.col, pos.row, st);
        const valid = col+cab.wC<=R.current.gridCols && row+cab.hC<=GRID_ROWS && !overlaps(pl,col,row,cab.wC,cab.hC);
        if (valid) {
          const newItem = { id: Date.now().toString(), tid: st, col, row };
          setPlaced(prev => [...prev, newItem]);
          setGhost({ col, row, tid: st, valid: true });
        }
      } else if (m==="select") {
        setSelId(null);
      }
    }

    function doUp() {
      const { drag } = R.current;
      if (!drag) return;
      // read ghost via state setter callback to get latest value without closure
      setGhost(g => {
        if (g && g.valid) {
          setPlaced(prev => prev.map(p => p.id===drag.id ? {...p,col:g.col,row:g.row} : p));
        }
        R.current.drag = null;
        return null;
      });
    }

    const onMouseMove  = e => doMove(e.clientX, e.clientY);
    const onMouseLeave = () => { if (!R.current.drag) setGhost(null); };
    const onMouseUp    = () => doUp();
    const onClick      = e => doPlace(e.clientX, e.clientY);
    const onTouchMove  = e => { e.preventDefault(); doMove(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd   = e => { doUp(); setTimeout(()=>doPlace(e.changedTouches[0].clientX, e.changedTouches[0].clientY), 0); };

    el.addEventListener("mousemove",  onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup",    onMouseUp);
    el.addEventListener("click",      onClick);
    el.addEventListener("touchmove",  onTouchMove,  {passive:false});
    el.addEventListener("touchend",   onTouchEnd);

    return () => {
      el.removeEventListener("mousemove",  onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup",    onMouseUp);
      el.removeEventListener("click",      onClick);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, []); // attach once -- live values via R.current

  // Handle placed-cabinet interactions (select/drag start)
  // Always set selId so Remove button appears in both modes
  function onCabDown(e, p) {
    e.stopPropagation();
    setSelId(p.id);
    if (R.current.mode==="select") {
      const pos = gridPos(e.clientX, e.clientY);
      if (pos) R.current.drag = { id:p.id, oc:pos.col-p.col, or:pos.row-p.row };
    }
  }

  const delSel = () => { setPlaced(prev => prev.filter(p => p.id !== selId)); setSelId(null); };

  const gridW  = gridCols * cs;
  const gridH  = GRID_ROWS * cs;
  const floorY = FLOOR_ROW * cs;
  const maxMm  = gridCols * 100;
  const tickMm  = Array.from({length:gridCols/6+1},(_,i)=>i*600).filter(m=>m<=maxMm);

  return(
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{id:"place",icon:MousePointer,label:"Place"},{id:"select",icon:Move,label:"Move"}].map(({id,icon:Icon,label})=>(
          <button key={id} onClick={()=>{setMode(id);setGhost(null);}}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{background:mode===id?B.dark:B.parchment,color:mode===id?B.white:B.dark,border:`1.5px solid ${mode===id?B.orange:"#D0C8BC"}`}}>
            <Icon size={11}/>{label}
          </button>
        ))}
        {selId&&(
          <button onClick={delSel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{background:"#6B1A12",color:B.white}}>
            <Trash2 size={11}/> Remove
          </button>
        )}
        <button onClick={()=>{setPlaced([]);setSelId(null);}}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{background:B.parchment,color:"#9A8878",border:"1.5px solid #D0C8BC"}}>
          <RotateCcw size={11}/> Clear
        </button>
        {/* Wall width toggle */}
        <div className="flex items-center gap-1 ml-auto rounded-lg overflow-hidden" style={{border:"1.5px solid #D0C8BC"}}>
          {[{v:60,l:"6m"},{v:80,l:"8m"},{v:100,l:"10m"},{v:120,l:"12m"}].map(({v,l})=>(
            <button key={v} onClick={()=>setGridCols(v)}
              className="px-2 py-1.5 text-[10px] font-black transition-all"
              style={{background:gridCols===v?B.dark:B.parchment,color:gridCols===v?B.white:"#9A8878"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="overflow-x-auto rounded-xl" style={{border:`1.5px solid #C0B8AC`}}>
        <div ref={gridRef} className="relative select-none"
          style={{width:gridW, height:gridH, cursor:mode==="place"&&selType?"crosshair":"default"}}>

          {/* BG zones */}
          <div className="absolute inset-0" style={{background:"#F2EDE4"}}/>
          <div className="absolute" style={{top:0,left:0,right:0,height:floorY,background:"#EDE7DC"}}/>
          <div className="absolute" style={{top:floorY,left:0,right:0,bottom:0,background:"#E8E0D4"}}/>

          {/* Zone labels */}
          <div className="absolute pointer-events-none" style={{top:4,left:6,color:B.dark,fontSize:8,fontWeight:700,letterSpacing:2,opacity:0.4,textTransform:"uppercase"}}>Wall Zone -- 2000mm</div>
          <div className="absolute pointer-events-none" style={{top:floorY+4,left:6,color:B.dark,fontSize:8,fontWeight:700,letterSpacing:2,opacity:0.4,textTransform:"uppercase"}}>Floor Zone</div>
          <div className="absolute pointer-events-none" style={{top:2,right:6,color:B.dark,fontSize:7,fontWeight:700,opacity:0.35,textTransform:"uppercase"}}>CEILING / 2750mm</div>

          {/* Grid lines + ruler */}
          <svg className="absolute inset-0 pointer-events-none" width={gridW} height={gridH}>
            {Array.from({length:gridCols+1}).map((_,i)=>(
              <line key={`v${i}`} x1={i*cs} y1={0} x2={i*cs} y2={gridH} stroke={i%6===0?"#C0B8AC":"#DDD8D0"} strokeWidth={i%6===0?0.8:0.4}/>
            ))}
            {Array.from({length:GRID_ROWS+1}).map((_,i)=>(
              <line key={`h${i}`} x1={0} y1={i*cs} x2={gridW} y2={i*cs} stroke={i===FLOOR_ROW?B.orange:i===0?"#B0A898":"#DDD8D0"} strokeWidth={i===FLOOR_ROW?1.5:i===0?1:0.4}/>
            ))}
            {tickMm.map(mm=>{
              const x=(mm/100)*cs;
              return(<g key={mm}><line x1={x} y1={gridH-14} x2={x} y2={gridH} stroke={B.dark} strokeWidth="0.8" opacity="0.3"/><text x={x+2} y={gridH-3} fontSize="7" fill={B.dark} opacity="0.35" fontFamily="sans-serif">{mm}mm</text></g>);
            })}
          </svg>

          {/* Floor line */}
          <div className="absolute pointer-events-none" style={{top:floorY,left:0,right:0,height:2,background:B.orange,opacity:0.8}}/>

          {/* Placed cabinets */}
          {placed.map(p=>{
            const cab   = APPLIANCES[p.tid] || PM.cabinets[p.tid];
            if(!cab) return null;
            const isSel = p.id===selId;
            const isDrg = R.current.drag?.id===p.id;
            return(
              <div key={p.id} className="absolute"
                style={{left:p.col*cs,top:p.row*cs,width:cab.wC*cs,height:cab.hC*cs,
                  opacity:isDrg?0.25:1,cursor:mode==="select"?"grab":"pointer",zIndex:isSel?10:5}}
                onMouseDown={e=>onCabDown(e,p)}
                onTouchStart={e=>{const t=e.touches[0];onCabDown({clientX:t.clientX,clientY:t.clientY,stopPropagation:()=>e.stopPropagation()},p);}}>
                {APPLIANCES[p.tid]
                  ? <ApplianceSVG aid={p.tid} cs={cs} sel={isSel}/>
                  : <CabSVG tid={p.tid} cs={cs} doorColor={doorColor} doorKey={door} sel={isSel} handleKey={handle}/>}
                {isSel&&(
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap z-20"
                    style={{background:B.orange,color:B.white}}>
                    {cab.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ghost preview */}
          {ghost&&(()=>{const gc=APPLIANCES[ghost.tid]||PM.cabinets[ghost.tid];if(!gc)return null;return(
            <div className="absolute pointer-events-none"
              style={{left:ghost.col*cs,top:ghost.row*cs,
                width:gc.wC*cs,height:gc.hC*cs,
                opacity:0.65,zIndex:20}}>
              {APPLIANCES[ghost.tid]
                ?<ApplianceSVG aid={ghost.tid} cs={cs} sel={ghost.valid}/>
                :<CabSVG tid={ghost.tid} cs={cs} doorColor={doorColor} doorKey={door} sel={ghost.valid} handleKey={handle}/>}
              {!ghost.valid&&<div className="absolute inset-0" style={{background:"rgba(180,40,20,0.4)",border:"2px solid #C03020"}}/>}
            </div>);})()}
        </div>
      </div>

      {/* Layout metrics */}
      {placed.length>0&&(
        <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
          <div className="flex">
            {[
              {label:"Floor Run",   val:(placed.filter(p=>["Floor","Corner","Tall"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
              {label:"Wall Run",    val:(placed.filter(p=>cabDef(p.tid).cat==="Wall").reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
              {label:"Countertop",  val:(placed.filter(p=>["Floor","Corner"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
            ].map((m,i)=>(
              <div key={m.label} className="flex-1 text-center py-2"
                style={{borderRight:i<2?"1px solid #E0D8CC":"none",background:i===1?B.parchment:B.white}}>
                <p className="text-base font-black leading-tight" style={{color:B.dark}}>{m.val}</p>
                <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="px-3 py-1.5 flex items-center justify-between" style={{background:B.dark}}>
            <span className="text-[10px] font-bold" style={{color:"#C4B8A8"}}>{placed.filter(p=>!APPLIANCES[p.tid]).length} unit{placed.filter(p=>!APPLIANCES[p.tid]).length!==1?"s":""} placed</span>

          </div>
        </div>
      )}
    </div>
  );
}

// --- PALETTE ------------------------------------------------------------------
function Palette({selType, setSelType}){
  const [cat,setCat] = useState("Floor");
  const isApplTab = cat==="Appliance";
  const filtered = isApplTab
    ? Object.entries(APPLIANCES)
    : Object.entries(PM.cabinets).filter(([,v])=>
        cat==="Drawer" ? v.isDrawer : (v.cat===cat && !v.isDrawer)
      );
  return(
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all"
            style={{background:cat===c?B.dark:"transparent",color:cat===c?B.white:"#9A8878",border:`1.5px solid ${cat===c?B.dark:"#D0C8BC"}`}}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filtered.map(([id,cab])=>{
          const on=selType===id;
          return(
            <button key={id}
              onClick={e=>{ e.stopPropagation(); setSelType(on?null:id); }}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
              style={{border:`2px solid ${on?B.orange:"#D0C8BC"}`,background:on?B.dark:B.white,minWidth:72}}>
              <div className="flex items-end justify-center pt-2 px-2" style={{height:44,background:on?"#1A0F0D":B.parchment}}>
                {isApplTab
                  ? <ApplianceSVG aid={id} cs={7} sel={on}/>
                  : <svg width={Math.min(52,16+cab.wC*4)} height={cab.cat==="Tall"?40:cab.cat==="Wall"?22:28} viewBox={`0 0 ${cab.wC*8} ${cab.hC*8}`}>
                      <rect x={0} y={0} width={cab.wC*8} height={cab.hC*8} fill={cab.color} stroke={on?B.orange:"#A09080"} strokeWidth="1" rx="1"/>
                      {cab.cat!=="Wall"&&<rect x={1} y={cab.hC*8-13} width={cab.wC*8-2} height={12} fill="#8A7A60" opacity="0.7"/>}
                      {(cab.cat==="Tall"||cab.cat==="Wall")&&<rect x={1} y={1} width={cab.wC*8-2} height={12} fill="#A89870" opacity="0.7"/>}
                    </svg>
                }
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[9px] font-black leading-tight" style={{color:on?B.white:B.dark}}>{cab.label}</p>

              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// --- COUNTERTOP PICKER (grouped) ---------------------------------------------
function CountertopPicker({ct, setCt}){
  const groups = ["Formica","Quartz"];
  const curGroup = PM.countertop[ct]?.group || "Formica";
  const [activeGroup, setActiveGroup] = useState(curGroup);

  // Sync active group if ct changes externally
  useEffect(()=>{ setActiveGroup(PM.countertop[ct]?.group || "Formica"); },[ct]);

  const filtered = Object.entries(PM.countertop).filter(([,v])=>v.group===activeGroup);

  return(
    <div className="flex flex-col gap-2">
      {/* Group toggle */}
      <div className="flex rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
        {groups.map(g=>(
          <button key={g} onClick={()=>{
            setActiveGroup(g);
            // Auto-select first of new group if current isn't in it
            if(PM.countertop[ct]?.group!==g){
              const first=Object.entries(PM.countertop).find(([,v])=>v.group===g);
              if(first) setCt(first[0]);
            }
          }}
            className="flex-1 py-2 text-xs font-black tracking-widest uppercase transition-all"
            style={{background:activeGroup===g?B.dark:B.white,color:activeGroup===g?B.white:"#9A8878"}}>
            {g}
            {g==="Formica"&&<span className="ml-1 text-[8px] opacity-60">Laminate</span>}
            {g==="Quartz"&&<span className="ml-1 text-[8px] opacity-60">Stone</span>}
          </button>
        ))}
      </div>
      {/* Colour swatches grid */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map(([id,m])=>{
          const sel=ct===id;
          return(
            <button key={id} onClick={()=>setCt(id)}
              className="rounded-xl overflow-hidden transition-all"
              style={{border:`2px solid ${sel?B.orange:"#E0D8CC"}`}}>
              <div className="h-10 relative" style={{background:m.color}}>
                {/* Subtle texture for quartz */}
                {m.group==="Quartz"&&<div className="absolute inset-0 opacity-10"
                  style={{backgroundImage:"radial-gradient(circle at 30% 40%,rgba(255,255,255,0.8) 1px,transparent 1px),radial-gradient(circle at 70% 60%,rgba(255,255,255,0.6) 0.5px,transparent 0.5px)",backgroundSize:"8px 8px,5px 5px"}}/>}
                {sel&&<div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{background:B.orange}}><Check size={9} color={B.white}/></div>}
              </div>
              <div className="px-1.5 py-1.5" style={{background:sel?B.dark:B.white}}>
                <p className="text-[9px] font-black leading-tight" style={{color:sel?B.white:B.dark}}>{m.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- STEP 2: MATERIALS --------------------------------------------------------
function SelCard({sel,onSel,color,label,badge,sub,badgeStyle}){
  return(
    <button onClick={onSel}
      className="flex items-center gap-3 rounded-xl px-4 py-3 w-full text-left transition-all"
      style={{background:sel?B.dark:B.white,border:`1.5px solid ${sel?B.orange:"#E0D8CC"}`}}>
      <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{background:color,border:"1.5px solid rgba(0,0,0,0.1)"}}/>
      <div className="flex-1">
        <span className="text-sm font-bold block" style={{color:sel?B.white:B.dark}}>{label}</span>
        {sub&&<span className="text-[10px] block" style={{color:sel?"#C4B8A8":"#9A8878"}}>{sub}</span>}
      </div>
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={badgeStyle||{background:sel?B.orange:"#F0EDE5",color:sel?B.white:"#9A8878"}}>
        {badge}
      </span>
      {sel&&<Check size={14} color={B.orange}/>}
    </button>
  );
}

function Step2({carc,setCarc,ct,setCt}){
  const labMult = PM.carcass[carc] ? LABOUR_MULT[PM.carcass[carc].matType] : 3.5;
  return(
    <div className="flex flex-col gap-5">
      <div className="rounded-xl px-4 py-3 flex gap-3 items-start" style={{background:"#FFF8EC",border:`1.5px solid ${B.gold}`}}>
        <Info size={14} color={B.gold} className="mt-0.5 flex-shrink-0"/>
        <div>
          <p className="text-xs font-black" style={{color:B.dark}}>Labour & Installation Included</p>
          
          
        </div>
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{color:B.dark}}>Carcass Material</p>
        <p className="text-[11px] mb-2" style={{color:"#9A8878"}}>The main body of all cabinets</p>
        <div className="flex flex-col gap-2">
          {Object.entries(PM.carcass).map(([id,m])=>{
            const lm=LABOUR_MULT[m.matType];
            const isWood=m.matType==="solid_wood";
            return(<SelCard key={id} sel={carc===id} onSel={()=>setCarc(id)} color={m.color} label={m.label}
              sub={isWood?"Solid Wood -- premium":"Melamine Board"}
              badge={m.matType==="solid_wood"?"Solid Wood":"Melamine"}
              badgeStyle={isWood?{background:B.gold,color:B.dark}:{background:carc===id?B.orange:"#F0EDE5",color:carc===id?B.white:"#9A8878"}}/>);
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{color:B.dark}}>Countertop</p>
        <p className="text-[11px] mb-2" style={{color:"#9A8878"}}>Floor, drawer & corner units only</p>
        {/* Group tabs */}
        {(()=>{
          const [ctGroup,setCtGroup] = [
            ["Formica","Quartz"].includes(PM.countertop[ct]?.group) ? PM.countertop[ct].group : "Formica",
            (g)=>{ const first=Object.entries(PM.countertop).find(([,v])=>v.group===g); if(first&&PM.countertop[ct]?.group!==g) setCt(first[0]); }
          ];
          // Can't use hook inside render -- use inline state workaround via key
          return null;
        })()}
        <CountertopPicker ct={ct} setCt={setCt}/>
      </div>
    </div>
  );
}

// --- STEP 3: FINISHES --------------------------------------------------------
function Step3({door,setDoor,handle,setHandle,placed}){
  const totalLeaves  = placed.reduce((s,p)=>s+doorCount(cabDef(p.tid)),0);
  const totalRunners = placed.reduce((s,p)=>s+runnerPairs(cabDef(p.tid)),0);
  return(
    <div className="flex flex-col gap-5">
      {placed.length>0&&(
        <div className="rounded-xl px-4 py-3 grid grid-cols-4 gap-2" style={{background:B.dark}}>
          {[["Door Leaves",totalLeaves],["Hinges",totalLeaves*2],["Runner Pairs",totalRunners],["Handles",totalLeaves]].map(([lbl,val])=>(
            <div key={lbl} className="text-center">
              <p className="text-lg font-black" style={{color:B.gold}}>{val}</p>
              <p className="text-[9px] tracking-widest uppercase leading-tight" style={{color:"#9A8878"}}>{lbl}</p>
            </div>
          ))}
        </div>
      )}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{color:B.dark}}>Door Finish</p>
        <p className="text-[11px] mb-2" style={{color:"#9A8878"}}>Applied to all placed cabinets -- live preview on grid</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PM.doors).map(([id,d])=>(
            <button key={id} onClick={()=>setDoor(id)}
              className="rounded-xl overflow-hidden transition-all"
              style={{border:`2px solid ${door===id?B.orange:"#E0D8CC"}`}}>
              <div className="h-12 relative" style={{background:d.color}}>
                {d.wood&&<div className="absolute inset-0 opacity-20" style={{backgroundImage:"repeating-linear-gradient(90deg,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 1px,transparent 1px,transparent 7px)"}}/>}
                {door===id&&<div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{background:B.orange}}><Check size={11} color={B.white}/></div>}
              </div>
              <div className="px-2 py-1.5" style={{background:door===id?B.dark:B.white}}>
                <p className="text-[10px] font-bold" style={{color:door===id?B.white:B.dark}}>{d.label}</p>

              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{color:B.dark}}>Handles</p>
        <p className="text-[11px] mb-2" style={{color:"#9A8878"}}>1 per door leaf  x  {totalLeaves} total</p>
        <div className="flex flex-col gap-2">
          {Object.entries(PM.handles).map(([id,h])=>(
            <button key={id} onClick={()=>setHandle(id)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 w-full text-left transition-all"
              style={{background:handle===id?B.dark:B.white,border:`1.5px solid ${handle===id?B.orange:"#E0D8CC"}`}}>
              <div className="flex-1">
                <span className="text-sm font-bold block" style={{color:handle===id?B.white:B.dark}}>{h.label}</span>
                <span className="text-[10px]" style={{color:handle===id?"#C4B8A8":"#9A8878"}}>

                </span>
              </div>
              {handle===id&&<Check size={14} color={B.orange}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


// --- STEP 4: LAYOUT PREVIEW --------------------------------------------------
function StepPreview({placed, carc, ct, door, handle, cs}){
  const carcM  = PM.carcass[carc];
  const ctM    = PM.countertop[ct];
  const drM    = PM.doors[door];
  const hndM   = PM.handles[handle];
  const doorColor = drM?.color || "#E0D8C8";
  const floorUnits  = placed.filter(p=>["Floor","Corner"].includes(cabDef(p.tid).cat));
  const wallUnits   = placed.filter(p=>cabDef(p.tid).cat==="Wall");
  const tallUnits   = placed.filter(p=>cabDef(p.tid).cat==="Tall");
  const drawerUnits = placed.filter(p=>cabDef(p.tid).isDrawer);

  // Mini read-only grid -- same grid dimensions but rendered at reduced cell size
  const previewCs = Math.max(7, cs - 2);
  const gridW = GRID_COLS * previewCs;
  const gridH = GRID_ROWS * previewCs;
  const floorY = FLOOR_ROW * previewCs;

  return(
    <div className="flex flex-col gap-4">
      {/* Mini grid preview */}
      <div>
        <p className="text-[9px] font-bold tracking-widest uppercase mb-2" style={{color:"#9A8878"}}>Layout with Selected Finishes</p>
        <div className="overflow-x-auto rounded-xl" style={{border:"1.5px solid #C0B8AC"}}>
          <div className="relative select-none pointer-events-none" style={{width:gridW,height:gridH}}>
            <div className="absolute inset-0" style={{background:"#F2EDE4"}}/>
            <div className="absolute" style={{top:0,left:0,right:0,height:floorY,background:"#EDE7DC"}}/>
            <div className="absolute" style={{top:floorY,left:0,right:0,bottom:0,background:"#E8E0D4"}}/>
            {/* Countertop band -- floor/corner/drawer units only, not tall or appliances */}
            {(()=>{
              // Only units that physically get a countertop: Floor (incl drawers) + Corner, NOT Tall, NOT appliances
              const ctEligible = placed.filter(p=>{
                const c = cabDef(p.tid);
                return c && ["Floor","Corner"].includes(c.cat) && !APPLIANCES[p.tid];
              });
              if(!ctEligible.length) return null;
              // Render one band per contiguous group of eligible units
              const sorted = [...ctEligible].sort((a,b)=>a.col-b.col);
              // Build contiguous spans
              const spans=[];
              let spanStart=sorted[0], spanEnd=sorted[0];
              for(let i=1;i<sorted.length;i++){
                const prev=cabDef(spanEnd.tid);
                const cur=sorted[i];
                // contiguous if cur starts where prev ends
                if(cur.col === spanEnd.col+(prev.wC||0)){
                  spanEnd=cur;
                } else {
                  spans.push({start:spanStart,end:spanEnd});
                  spanStart=cur; spanEnd=cur;
                }
              }
              spans.push({start:spanStart,end:spanEnd});
              return spans.map((sp,i)=>{
                const startCab=cabDef(sp.start.tid);
                const endCab=cabDef(sp.end.tid);
                const left=sp.start.col*previewCs;
                const right=(sp.end.col+(endCab.wC||0))*previewCs;
                return <div key={i} className="absolute pointer-events-none"
                  style={{left,top:floorY-previewCs*0.6,height:previewCs*0.6,width:right-left,
                    background:ctM?.color||"#C8C0B0",opacity:0.9,zIndex:6}}/>;
              });
            })()}
            <svg className="absolute inset-0 pointer-events-none" width={gridW} height={gridH}>
              {Array.from({length:GRID_COLS+1}).map((_,i)=>(
                <line key={`v${i}`} x1={i*previewCs} y1={0} x2={i*previewCs} y2={gridH} stroke={i%6===0?"#C0B8AC":"#DDD8D0"} strokeWidth={i%6===0?0.6:0.3}/>
              ))}
              {Array.from({length:GRID_ROWS+1}).map((_,i)=>(
                <line key={`h${i}`} x1={0} y1={i*previewCs} x2={gridW} y2={i*previewCs} stroke={i===FLOOR_ROW?B.orange:"#DDD8D0"} strokeWidth={i===FLOOR_ROW?1.2:0.3}/>
              ))}
            </svg>
            <div className="absolute pointer-events-none" style={{top:floorY,left:0,right:0,height:1.5,background:B.orange,opacity:0.8}}/>
            {placed.map(p=>{
              const cab=APPLIANCES[p.tid]||PM.cabinets[p.tid];
              if(!cab) return null;
              return(
                <div key={p.id} className="absolute" style={{left:p.col*previewCs,top:p.row*previewCs,width:cab.wC*previewCs,height:cab.hC*previewCs,zIndex:5}}>
                  {APPLIANCES[p.tid]
                    ? <ApplianceSVG aid={p.tid} cs={previewCs} sel={false}/>
                    : <CabSVG tid={p.tid} cs={previewCs} doorColor={doorColor} doorKey={door} sel={false} handleKey={handle}/>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selection summary cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          {label:"Carcass",  val:carcM?.label||"--",  color:carcM?.color||"#F0EDE5"},
          {label:"Countertop",val:ctM?.label||"--",   color:ctM?.color||"#C8C0B0"},
          {label:"Door Finish",val:drM?.label||"--",  color:drM?.color||"#F0F0EC"},
          {label:"Handles",  val:hndM?.label||"--",   color:B.dark},
        ].map(item=>(
          <div key={item.label} className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
            <div className="h-8" style={{background:item.color}}/>
            <div className="px-3 py-2" style={{background:B.white}}>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>{item.label}</p>
              <p className="text-xs font-black" style={{color:B.dark}}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Unit count summary */}
      <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
        <div className="px-4 py-2" style={{background:B.parchment}}>
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>Layout Summary</p>
        </div>
        <div className="grid grid-cols-4 divide-x" style={{borderTop:"1px solid #E0D8CC",borderColor:"#E0D8CC"}}>
          {[
            {label:"Floor",  val:floorUnits.filter(p=>!cabDef(p.tid).isDrawer).length},
            {label:"Drawer", val:drawerUnits.length},
            {label:"Wall",   val:wallUnits.length},
            {label:"Tall",   val:tallUnits.length},
          ].map((m,i)=>(
            <div key={m.label} className="text-center py-3" style={{borderRight:i<3?"1px solid #E0D8CC":"none",background:B.white}}>
              <p className="text-lg font-black" style={{color:B.dark}}>{m.val}</p>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>{m.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 divide-x" style={{borderTop:"1px solid #E0D8CC",borderColor:"#E0D8CC"}}>
          {[
            {label:"Floor Run",  val:([...floorUnits,...tallUnits].reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
            {label:"Wall Run",   val:(wallUnits.reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
            {label:"Countertop", val:(floorUnits.reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
          ].map((m,i)=>(
            <div key={m.label} className="text-center py-2" style={{borderRight:i<2?"1px solid #E0D8CC":"none",background:B.parchment}}>
              <p className="text-sm font-black" style={{color:B.dark}}>{m.val}</p>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:B.orange}}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 flex gap-2 items-center" style={{background:"#FFF8EC",border:`1.5px solid ${B.gold}`}}>
        <Info size={13} color={B.gold} className="flex-shrink-0"/>
        <p className="text-[11px]" style={{color:"#9A6A00"}}>Happy with your layout and selections? Proceed to view your full itemised quote.</p>
      </div>
    </div>
  );
}


// --- CABINET DEPTH LOOKUP (mm) ------------------------------------------------
const CAB_DEPTH = { Floor:600, Corner:600, Tall:600, Wall:350 };
const PANEL_T   = 18;  // standard board thickness mm
const SHEET_W   = 2750;
const SHEET_H   = 1830;

// Build full cutting spec for one placed unit
function cuttingSpec(tid, carcLabel) {
  const cab  = PM.cabinets[tid];
  if (!cab) return { tid, label: tid, w:0, d:0, panels:[] }; // guard for appliances
  const w    = cab.wMm;
  const d    = CAB_DEPTH[cab.cat] || 600;
  const t    = PANEL_T;

  // Inner width / depth after side panels
  const iw = w - t*2;
  const id = d - t;   // back panel flush

  let panels = [];
  let note   = "";

  if (cab.cat === "Wall") {
    const h = 700;
    panels = [
      {part:"Left Side",    qty:1, l:h,    w:d,  note:""},
      {part:"Right Side",   qty:1, l:h,    w:d,  note:""},
      {part:"Top Panel",    qty:1, l:iw,   w:d,  note:""},
      {part:"Bottom Panel", qty:1, l:iw,   w:d,  note:""},
      {part:"Back Panel",   qty:1, l:iw,   w:h,  note:"12mm back"},
      {part:"Shelf",        qty:1, l:iw,   w:id, note:"adjustable"},
      {part:"Door Face",    qty:cab.wC<9?1:2, l:Math.round((h-4)/1), w:cab.wC<9?w-4:Math.round((w-6)/2), note:"finished size"},
    ];
  } else if (cab.isDrawer) {
    const h = 570; // body height (720 - 150 kick)
    const dh = Math.round((h - 4*3) / 3); // drawer front height
    panels = [
      {part:"Left Side",      qty:1, l:h,    w:d,  note:""},
      {part:"Right Side",     qty:1, l:h,    w:d,  note:""},
      {part:"Top Panel",      qty:1, l:iw,   w:d,  note:""},
      {part:"Bottom Panel",   qty:1, l:iw,   w:d,  note:""},
      {part:"Back Panel",     qty:1, l:iw,   w:h,  note:"12mm back"},
      {part:"Drawer Box Side",qty:6, l:id-50,w:130, note:"x3 boxes"},
      {part:"Drawer Box Front/Back",qty:6, l:iw-50,w:130, note:"x3 boxes"},
      {part:"Drawer Box Base",qty:3, l:iw-50,w:id-50, note:"6mm ply"},
      {part:"Drawer Front",   qty:3, l:w-4,  w:dh, note:"finished size"},
      {part:"Kick Plate",     qty:1, l:w,    w:150, note:""},
    ];
  } else if (cab.cat === "Tall") {
    const h = 2450; // body only (excl kick + filler)
    panels = [
      {part:"Left Side",    qty:1, l:h,    w:d,  note:""},
      {part:"Right Side",   qty:1, l:h,    w:d,  note:""},
      {part:"Top Panel",    qty:1, l:iw,   w:d,  note:""},
      {part:"Bottom Panel", qty:1, l:iw,   w:d,  note:""},
      {part:"Mid Shelf",    qty:1, l:iw,   w:id, note:"fixed mid"},
      {part:"Shelf",        qty:2, l:iw,   w:id, note:"adjustable"},
      {part:"Back Panel",   qty:1, l:iw,   w:h,  note:"12mm back -- may splice"},
      {part:"Door Face",    qty:2, l:Math.round((h/2)-4), w:Math.round((w-6)/2), note:"upper pair"},
      {part:"Door Face",    qty:2, l:Math.round((h/2)-4), w:Math.round((w-6)/2), note:"lower pair"},
      {part:"Kick Plate",   qty:1, l:w,    w:150, note:""},
      {part:"Filler Strip", qty:1, l:w,    w:150, note:"top closure"},
    ];
  } else {
    // Floor / Corner
    const h = 570; // 720 - 150 kick
    panels = [
      {part:"Left Side",    qty:1, l:h,    w:d,  note:""},
      {part:"Right Side",   qty:1, l:h,    w:d,  note:""},
      {part:"Top Panel",    qty:1, l:iw,   w:d,  note:""},
      {part:"Bottom Panel", qty:1, l:iw,   w:d,  note:""},
      {part:"Back Panel",   qty:1, l:iw,   w:h,  note:"12mm back"},
      {part:"Shelf",        qty:1, l:iw,   w:id, note:"adjustable"},
      {part:"Door Face",    qty:2, l:h-4,  w:Math.round((w-6)/2), note:"finished size"},
      {part:"Kick Plate",   qty:1, l:w,    w:150, note:""},
    ];
  }
  return { tid, label:cab.label, w, d, panels };
}

// --- STEP 5: QUOTE ------------------------------------------------------------
function Step5Quote({placed, carc, ct, door, handle}){
  const q     = calcQ(placed,carc,ct,door,handle);
  const carcM = PM.carcass[carc];
  const lm    = carcM ? LABOUR_MULT[carcM.matType] : 3.5;
  const lines = [
    {label:"Cabinet Carcasses + Labour", sub:`${placed.length} units  x  ${carcM?.label}`, val:q.cab},
    {label:"Countertop",                 sub:`${(q.ctMm/1000).toFixed(2)}m  x  ${PM.countertop[ct]?.label}`,    val:q.ctr},
    {label:"Door Faces",                 sub:`${q.totalDoorLeaves} leaves  x  ${PM.doors[door]?.label}`,         val:q.dr},
    {label:"Hinges",                     sub:`${q.totalDoorLeaves*2} @ ${fmt(HINGE_PRICE)} each`,              val:q.hinges},
    {label:"Drawer Runners",             sub:`${q.totalRunnerPairs} pairs @ ${fmt(RUNNER_PRICE)} each`,        val:q.runners},
    {label:"Handles / Ironmongery",      sub:`${q.totalDoorLeaves}  x  ${PM.handles[handle]?.label}`,            val:q.hnd},
  ];
  return(
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-4 flex gap-3 items-center" style={{background:B.dark}}>
        <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{background:PM.doors[door]?.color||B.orange}}/>
        <div>
          <p className="text-[10px] tracking-widest uppercase font-bold" style={{color:B.gold}}>Your Configuration</p>
          <p className="text-sm font-bold" style={{color:B.white}}>{carcM?.label}</p>
          <p className="text-xs" style={{color:"#C4B8A8"}}>{PM.countertop[ct]?.label}  x  {PM.doors[door]?.label}</p>
        </div>
      </div>
      {/* Layout run summary */}
      <div className="rounded-2xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
        <div className="px-4 py-2" style={{background:B.parchment}}>
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>Layout Summary</p>
        </div>
        <div className="grid grid-cols-3 divide-x" style={{borderTop:"1px solid #E0D8CC",borderColor:"#E0D8CC"}}>
          {[
            {label:"Floor Run",   sub:"floor, corner & tall", val:(placed.filter(p=>["Floor","Corner","Tall"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
            {label:"Wall Run",    sub:"wall-hung units",       val:(placed.filter(p=>cabDef(p.tid).cat==="Wall").reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
            {label:"Countertop",  sub:"worktop linear run",    val:(placed.filter(p=>["Floor","Corner"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
          ].map((m,i)=>(
            <div key={m.label} className="text-center px-2 py-3" style={{borderRight:i<2?"1px solid #E0D8CC":"none",background:B.white}}>
              <p className="text-xl font-black leading-none mb-0.5" style={{color:B.dark}}>{m.val}</p>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:B.orange}}>{m.label}</p>
              <p className="text-[9px]" style={{color:"#9A8878"}}>{m.sub}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 flex justify-between" style={{background:B.parchment,borderTop:"1px solid #E0D8CC"}}>
          <span className="text-[10px]" style={{color:"#9A8878"}}>{placed.length} units total</span>
          <span className="text-[10px] font-bold" style={{color:B.dark}}>
            {placed.filter(p=>cabDef(p.tid).cat==="Tall").length} tall  x  {placed.filter(p=>["Floor","Corner"].includes(cabDef(p.tid).cat)&&!cabDef(p.tid).isDrawer).length} floor  x  {placed.filter(p=>cabDef(p.tid).isDrawer).length} drawer  x  {placed.filter(p=>cabDef(p.tid).cat==="Wall").length} wall
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
        {lines.map((l,i)=>(
          <div key={i} className="flex justify-between px-4 py-3"
            style={{borderBottom:i<lines.length-1?"1px solid #E0D8CC":"none",background:i%2===0?B.white:B.parchment}}>
            <div><p className="text-xs font-bold" style={{color:B.dark}}>{l.label}</p><p className="text-[10px]" style={{color:"#9A8878"}}>{l.sub}</p></div>
            <p className="text-sm font-bold" style={{color:B.dark}}>{fmt(l.val)}</p>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-xl px-3 py-2" style={{background:"#FFF8EC"}}>
        <Info size={12} color={B.gold} className="mt-0.5 flex-shrink-0"/>
        <p className="text-[11px]" style={{color:"#9A6A00"}}>Estimated quote only. VAT, site survey adjustments, and delivery not included.</p>
      </div>
      <div className="rounded-2xl px-5 py-4 flex items-center justify-between" style={{background:B.dark}}>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase" style={{color:B.gold}}>Estimated Total</p>
          <p className="text-[10px]" style={{color:"#9A8878"}}>excl. VAT & delivery</p>
        </div>
        <p className="text-2xl font-black" style={{color:B.white}}>{fmt(q.total)}</p>
      </div>
      <button className="w-full py-4 rounded-2xl font-black tracking-widest uppercase text-sm active:scale-95 transition-all"
        style={{background:B.orange,color:B.white}}>Request Full Quote -></button>
      {/* Grouped cabinet summary -- no per-unit pricing exposed */}
      <div className="rounded-2xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
        <div className="px-4 py-2.5" style={{background:B.parchment}}>
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>Cabinet Schedule</p>
        </div>
        {(()=>{
          // Group placed units by their label, count qty, sum total cost per group
          const groups = {};
          q.details.forEach(d=>{
            if(!groups[d.label]) groups[d.label]={label:d.label,qty:0,total:0};
            groups[d.label].qty++;
            groups[d.label].total += d.unitBase+d.doorCost+d.hingeCost+d.runnerCost+d.handleCost;
          });
          const rows = Object.values(groups);
          return rows.map((g,i)=>(
            <div key={g.label} className="flex items-center justify-between px-4 py-3"
              style={{borderBottom:i<rows.length-1?"1px solid #E0D8CC":"none",background:i%2===0?B.white:B.parchment}}>
              <div>
                <p className="text-xs font-black" style={{color:B.dark}}>{g.label}</p>
                <p className="text-[10px]" style={{color:"#9A8878"}}>Qty: {g.qty}</p>
              </div>
              <p className="text-sm font-black" style={{color:B.dark}}>{fmt(g.total)}</p>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}


// --- STEP 6: FLOOR PLAN & CUTTING SPEC ---------------------------------------
function Step6FloorPlan({placed, carc, ct, door}){
  const [activeTab, setActiveTab] = useState("plan");   // "plan" | "spec"
  const [activeUnit, setActiveUnit] = useState(null);   // tid for spec detail

  const carcM = PM.carcass[carc];

  // -- Floor plan SVG ----------------------------------------------------------
  // Scale: 1mm = PX px
  const PX      = 0.16;
  const MARGIN  = 40;   // px left margin for labels
  const wallLen = placed.length
    ? Math.max(...placed.filter(p=>cabDef(p.tid).wC).map(p => (p.col + cabDef(p.tid).wC) * 100)) + 400
    : 6400;
  const planW   = wallLen * PX + MARGIN + 20;
  const maxDepth= 750; // floor + wall depth zone in plan
  const planH   = maxDepth * PX + 80;

  // Group units
  const floorUnits = placed.filter(p=>{ const c=cabDef(p.tid); return c && ["Floor","Corner","Tall"].includes(c.cat); });
  const wallUnits  = placed.filter(p=>cabDef(p.tid).cat==="Wall" && PM.cabinets[p.tid]);

  function dimLine(x1,y,x2,label,above=true){
    const y2 = above ? y-10 : y+10;
    const yText = above ? y-14 : y+20;
    return(
      <g>
        <line x1={x1} y1={y} x2={x1} y2={y2} stroke="#888" strokeWidth="0.6"/>
        <line x1={x2} y1={y} x2={x2} y2={y2} stroke="#888" strokeWidth="0.6"/>
        <line x1={x1} y1={y2} x2={x2} y2={y2} stroke="#888" strokeWidth="0.6"
          markerStart="url(#arr)" markerEnd="url(#arr)"/>
        <text x={(x1+x2)/2} y={yText} textAnchor="middle"
          fontSize="7" fill="#555" fontFamily="monospace">{label}</text>
      </g>
    );
  }

  const FloorPlan = () => {
    // -- Architectural top-down plan layout -----------------------------------
    // Reading top -> bottom:
    //   [structural wall -- hatched]
    //   [wall units -- 350mm deep, tight against wall, dashed outline]
    //   [floor/tall units -- 600mm deep, solid fill]
    //   [door swing arcs -- opening into room]
    //   [dimension lines]
    //
    // All Y coords grow downward from the structural wall at top.

    const wallThickPx = 15;          // structural wall block height in px
    const wallY       = 18;          // top of structural wall
    const wallBotY    = wallY + wallThickPx; // bottom of structural wall = back of wall units

    const wallUnitDepthPx  = 350 * PX;  // 350mm
    const floorUnitDepthPx = 600 * PX;  // 600mm

    // Wall units sit directly below structural wall
    const wallUnitTopY  = wallBotY;
    const wallUnitBotY  = wallUnitTopY + wallUnitDepthPx;

    // Floor units sit directly below wall units (share the same wall face)
    const floorUnitTopY = wallUnitBotY;
    const floorUnitBotY = floorUnitTopY + floorUnitDepthPx;

    // Total SVG height: wall + wall units + floor units + swing arcs + dim lines + legend
    const maxSwingR = Math.max(
      floorUnits.length ? Math.max(...floorUnits.map(p=>(PM.cabinets[p.tid]?.wMm||600)*PX/2)) : 0,
      0
    );
    const svgH = floorUnitBotY + Math.min(maxSwingR, 60) + 30 + 20; // arcs + dim + legend

    return(
      <svg width={planW} height={svgH} style={{display:"block"}}>
        <defs>
          <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5" fill="none" stroke="#777" strokeWidth="1"/>
          </marker>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#B0A898" strokeWidth="1.2"/>
          </pattern>
        </defs>

        {/* -- Structural wall -- */}
        <rect x={MARGIN} y={wallY} width={wallLen*PX} height={wallThickPx}
          fill="url(#hatch)" stroke="#7A7068" strokeWidth="1.2"/>
        <text x={MARGIN-3} y={wallY+10} textAnchor="end" fontSize="7"
          fill="#666" fontFamily="monospace" fontWeight="700">WALL</text>

        {/* -- Wall units -- between structural wall and floor units -- */}
        {wallUnits.map(p=>{
          const cab = PM.cabinets[p.tid]||{};
          const wMm = cab.wMm||0;
          const x   = MARGIN + p.col*100*PX;
          const pw  = wMm*PX;
          const ph  = wallUnitDepthPx;
          return(
            <g key={p.id}>
              {/* Hatched fill to distinguish from floor units */}
              <rect x={x} y={wallUnitTopY} width={pw} height={ph}
                fill="#EAE4D8" stroke="#8A7A68" strokeWidth="0.8" strokeDasharray="4 2"/>
              {/* Centre lines */}
              <line x1={x+pw/2-3} y1={wallUnitTopY+ph/2} x2={x+pw/2+3} y2={wallUnitTopY+ph/2}
                stroke="#8A7A68" strokeWidth="0.5" opacity="0.6"/>
              <line x1={x+pw/2} y1={wallUnitTopY+ph/2-3} x2={x+pw/2} y2={wallUnitTopY+ph/2+3}
                stroke="#8A7A68" strokeWidth="0.5" opacity="0.6"/>
              <text x={x+pw/2} y={wallUnitTopY+ph/2+3} textAnchor="middle"
                fontSize={Math.max(6,pw*0.085)} fill="#6A5848" fontFamily="monospace">
                {wMm}
              </text>
            </g>
          );
        })}

        {/* Divider line between wall units and floor units */}
        {(floorUnits.length>0||wallUnits.length>0)&&(
          <line x1={MARGIN} y1={floorUnitTopY} x2={MARGIN+wallLen*PX} y2={floorUnitTopY}
            stroke="#9A8878" strokeWidth="0.8" strokeDasharray="6 3"/>
        )}

        {/* -- Floor / Tall / Corner units -- */}
        {floorUnits.map(p=>{
          const cab = PM.cabinets[p.tid]||{};
          const wMm = cab.wMm||0;
          const x   = MARGIN + p.col*100*PX;
          const pw  = wMm*PX;
          const ph  = floorUnitDepthPx;
          const frontY = floorUnitTopY + ph; // front face of cabinet (room side)
          const swingR = pw/2 - 3;

          const fillColor = cab.cat==="Tall" ? "#C8C0A8"
                          : cab.isDrawer     ? "#C4B8A4"
                          : "#D4C8B4";

          return(
            <g key={p.id}>
              {/* Cabinet footprint */}
              <rect x={x} y={floorUnitTopY} width={pw} height={ph}
                fill={fillColor} stroke="#7A6A58" strokeWidth="0.9"/>

              {/* Centre cross */}
              <line x1={x+pw/2-4} y1={floorUnitTopY+ph/2} x2={x+pw/2+4} y2={floorUnitTopY+ph/2}
                stroke="#7A6A58" strokeWidth="0.5"/>
              <line x1={x+pw/2} y1={floorUnitTopY+ph/2-4} x2={x+pw/2} y2={floorUnitTopY+ph/2+4}
                stroke="#7A6A58" strokeWidth="0.5"/>

              {/* Width label inside unit */}
              <text x={x+pw/2} y={floorUnitTopY+ph/2+3} textAnchor="middle"
                fontSize={Math.max(6,pw*0.085)} fill="#4A3828" fontWeight="700" fontFamily="monospace">
                {wMm}
              </text>

              {/* Door swing arcs -- each leaf pivots 90deg from hinge corner into room */}
              {cab.cat!=="Tall"&&!APPLIANCES[p.tid]&&swingR>3&&(()=>{
                // doorW = width of one door leaf
                const doorW = swingR; // pw/2 - 3
                // Left door: hinge at left edge, swings right then down
                // Arc from (x, frontY) sweeping 90deg CW -> endpoint (x+doorW, frontY+doorW)
                const lHx=x, lHy=frontY;
                const lEx=x+doorW, lEy=frontY+doorW;
                // Right door: hinge at right edge, swings left then down
                // Arc from (x+pw, frontY) sweeping 90deg CCW -> endpoint (x+pw-doorW, frontY+doorW)
                const rHx=x+pw, rHy=frontY;
                const rEx=x+pw-doorW, rEy=frontY+doorW;
                return(
                  <>
                    {/* Left door leaf */}
                    <line x1={lHx} y1={lHy} x2={lHx+doorW} y2={lHy}
                      stroke="#A09080" strokeWidth="0.5" opacity="0.7"/>
                    <path d={`M${lHx+doorW},${lHy} A${doorW},${doorW} 0 0,1 ${lEx},${lEy}`}
                      fill="none" stroke="#A09080" strokeWidth="0.5" strokeDasharray="2.5 1.5"/>
                    {/* Right door leaf */}
                    <line x1={rHx} y1={rHy} x2={rHx-doorW} y2={rHy}
                      stroke="#A09080" strokeWidth="0.5" opacity="0.7"/>
                    <path d={`M${rHx-doorW},${rHy} A${doorW},${doorW} 0 0,0 ${rEx},${rEy}`}
                      fill="none" stroke="#A09080" strokeWidth="0.5" strokeDasharray="2.5 1.5"/>
                  </>
                );
              })()}

              {/* Individual dim line below swing */}
              {dimLine(x, frontY+(cab.cat!=="Tall"&&swingR>3?swingR+6:6), x+pw, `${wMm}mm`)}
            </g>
          );
        })}

        {/* -- Depth labels on left axis -- */}
        {wallUnits.length>0&&(
          <text x={MARGIN-5} y={wallUnitTopY+wallUnitDepthPx/2+3} textAnchor="end"
            fontSize="6" fill="#888" fontFamily="monospace"
            transform={`rotate(-90,${MARGIN-16},${wallUnitTopY+wallUnitDepthPx/2})`}>
            350D WALL
          </text>
        )}
        <text x={MARGIN-5} y={floorUnitTopY+floorUnitDepthPx/2+3} textAnchor="end"
          fontSize="6" fill="#888" fontFamily="monospace"
          transform={`rotate(-90,${MARGIN-16},${floorUnitTopY+floorUnitDepthPx/2})`}>
          600D FLOOR
        </text>

        {/* -- Total run dimension at top -- */}
        {floorUnits.length>0&&(()=>{
          const allUnits = [...floorUnits, ...wallUnits];
          if (!allUnits.length) return null;
          const leftX  = MARGIN + Math.min(...allUnits.map(p=>p.col))*100*PX;
          const rightX = MARGIN + Math.max(...allUnits.map(p=>(p.col+(PM.cabinets[p.tid]?.wC||0))*100))*PX;
          const totMm  = Math.max(...allUnits.map(p=>(p.col+(PM.cabinets[p.tid]?.wC||0))*100))
                       - Math.min(...allUnits.map(p=>p.col*100));
          return dimLine(leftX, wallY-2, rightX, `TOTAL RUN: ${totMm}mm`, true);
        })()}

        {/* -- Legend -- */}
        <g transform={`translate(${MARGIN},${svgH-14})`}>
          {[
            {fill:"#D4C8B4",stroke:"#7A6A58",dash:"",      label:"Floor / Corner / Tall"},
            {fill:"#EAE4D8",stroke:"#8A7A68",dash:"4 2",   label:"Wall unit (above bench)"},
            {fill:"none",   stroke:"#A09080",dash:"2.5 1.5",label:"Door swing arc"},
          ].map((l,i)=>(
            <g key={i} transform={`translate(${i*110},0)`}>
              <rect x={0} y={0} width={9} height={9} fill={l.fill} stroke={l.stroke}
                strokeWidth="0.8" strokeDasharray={l.dash}/>
              <text x={12} y={8} fontSize="6.5" fill="#5A4A38" fontFamily="sans-serif">{l.label}</text>
            </g>
          ))}
        </g>
      </svg>
    );
  };

  // -- Cutting spec -------------------------------------------------------------
  const specs = placed.filter(p => PM.cabinets[p.tid]).map(p => cuttingSpec(p.tid, PM.cabinets[p.tid].label));

  // Sheet usage estimate: total panel area / sheet area, add 20% waste
  const totalPanelArea = specs.reduce((sum,s)=>
    sum + s.panels.reduce((ps,pan)=> ps + (pan.l * pan.w * pan.qty), 0), 0);
  const sheetArea   = SHEET_W * SHEET_H;
  const sheetsNeeded = Math.ceil((totalPanelArea / sheetArea) * 1.2);

  // Group unique panels across all units for summary
  const panelSummary = {};
  specs.forEach(s=>{
    s.panels.forEach(pan=>{
      const key = `${pan.part}|${pan.l}x${pan.w}`;
      if(!panelSummary[key]) panelSummary[key]={part:pan.part,l:pan.l,w:pan.w,qty:0,note:pan.note};
      panelSummary[key].qty += pan.qty;
    });
  });

  return(
    <div className="flex flex-col gap-4">
      {/* Carpenter badge */}
      <div className="rounded-xl px-4 py-2.5 flex items-center gap-2"
        style={{background:B.dark}}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:B.orange}}/>
        <p className="text-[10px] font-black tracking-widest uppercase" style={{color:B.gold}}>
          Carpenter's Working Document
        </p>
        <span className="ml-auto text-[9px] font-bold" style={{color:"#6A5A50"}}>
          {carcM?.label}
        </span>
      </div>

      {/* Tab toggle */}
      <div className="flex rounded-xl overflow-hidden" style={{border:`1.5px solid #E0D8CC`}}>
        {[{id:"plan",label:"Floor Plan"},{id:"spec",label:"Cutting Spec"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            className="flex-1 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
            style={{background:activeTab===t.id?B.dark:B.white, color:activeTab===t.id?B.white:"#9A8878"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* -- FLOOR PLAN TAB ------------------------------------------------------ */}
      {activeTab==="plan"&&(
        <div className="flex flex-col gap-3">
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>
            Top-down plan view  x  all dimensions in mm  x  depths to scale
          </p>
          <div className="overflow-x-auto rounded-xl" style={{border:"1.5px solid #C0B8AC",background:B.white}}>
            <div style={{padding:"12px 8px 8px 8px"}}>
              <FloorPlan/>
            </div>
          </div>

          {/* Quick plan stats */}
          <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
            <div className="grid grid-cols-2 divide-x" style={{borderColor:"#E0D8CC"}}>
              {[
                {label:"Floor Units",val:`${floorUnits.length} units`,sub:`${(floorUnits.reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)}m run`},
                {label:"Wall Units", val:`${wallUnits.length} units`, sub:`${(wallUnits.reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)}m run`},
              ].map((m,i)=>(
                <div key={m.label} className="px-4 py-3" style={{background:i===0?B.white:B.parchment}}>
                  <p className="text-[9px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>{m.label}</p>
                  <p className="text-sm font-black" style={{color:B.dark}}>{m.val}</p>
                  <p className="text-[10px]" style={{color:B.orange}}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl px-4 py-2.5 flex gap-2 items-start"
            style={{background:"#FFF8EC",border:`1.5px solid ${B.gold}`}}>
            <Info size={12} color={B.gold} className="mt-0.5 flex-shrink-0"/>
            <p className="text-[10px]" style={{color:"#9A6A00"}}>
              Door swing arcs shown for reference. Dashed boxes = wall-hung units shown at floor position for layout reference. All dimensions are nominal -- verify on site.
            </p>
          </div>
        </div>
      )}

      {/* -- CUTTING SPEC TAB ---------------------------------------------------- */}
      {activeTab==="spec"&&(
        <div className="flex flex-col gap-4">

          {/* Sheet material summary */}
          <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
            <div className="px-4 py-2" style={{background:B.dark}}>
              <p className="text-[9px] font-black tracking-widest uppercase" style={{color:B.gold}}>Material Summary</p>
            </div>
            <div className="grid grid-cols-3 divide-x" style={{borderColor:"#E0D8CC"}}>
              {[
                {label:"Board Thickness", val:`${PANEL_T}mm`, sub:"carcass panels"},
                {label:"Sheet Size",      val:`${SHEET_W}x${SHEET_H}`, sub:"mm standard"},
                {label:"Est. Sheets",     val:sheetsNeeded,   sub:"incl. 20% waste"},
              ].map((m,i)=>(
                <div key={m.label} className="text-center py-3 px-1"
                  style={{background:i===1?B.parchment:B.white}}>
                  <p className="text-lg font-black leading-none" style={{color:i===2?B.orange:B.dark}}>{m.val}</p>
                  <p className="text-[8px] font-bold tracking-widest uppercase mt-0.5" style={{color:"#9A8878"}}>{m.label}</p>
                  <p className="text-[9px]" style={{color:"#B0A090"}}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unit selector */}
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase mb-2" style={{color:"#9A8878"}}>
              Select unit for panel sizes
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={()=>setActiveUnit(null)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                style={{background:activeUnit===null?B.dark:B.parchment,color:activeUnit===null?B.white:B.dark,
                  border:`1.5px solid ${activeUnit===null?B.orange:"#D0C8BC"}`}}>
                All Units
              </button>
              {[...new Set(placed.filter(p=>PM.cabinets[p.tid]).map(p=>p.tid))].map(tid=>{
                const cab=cabDef(tid);
                return(
                  <button key={tid} onClick={()=>setActiveUnit(tid===activeUnit?null:tid)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                    style={{background:activeUnit===tid?B.dark:B.parchment,color:activeUnit===tid?B.white:B.dark,
                      border:`1.5px solid ${activeUnit===tid?B.orange:"#D0C8BC"}`}}>
                    {cab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel table */}
          {(()=>{
            const filteredSpecs = activeUnit
              ? specs.filter(s=>s.tid===activeUnit)
              : specs.filter((s,i,arr)=>arr.findIndex(x=>x.tid===s.tid)===i); // unique tids
            return filteredSpecs.map(spec=>{
              const placed_count = placed.filter(p=>p.tid===spec.tid).length;
              return(
                <div key={spec.tid} className="rounded-xl overflow-hidden"
                  style={{border:"1.5px solid #E0D8CC"}}>
                  {/* Unit header */}
                  <div className="px-4 py-2.5 flex items-center justify-between"
                    style={{background:B.dark}}>
                    <div>
                      <p className="text-xs font-black" style={{color:B.white}}>{spec.label}</p>
                      <p className="text-[9px]" style={{color:"#9A8878"}}>
                        {spec.w}mm wide x {spec.d}mm deep  x  {placed_count} in layout
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded" style={{background:"#3A2820",color:B.gold}}>
                      x{placed_count}
                    </span>
                  </div>
                  {/* Column headers */}
                  <div className="grid px-4 py-1.5"
                    style={{gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",background:B.parchment,borderBottom:"1px solid #E0D8CC"}}>
                    {["Part","Qty","L (mm)","W (mm)","Note"].map(h=>(
                      <p key={h} className="text-[8px] font-black tracking-widest uppercase" style={{color:"#9A8878"}}>{h}</p>
                    ))}
                  </div>
                  {/* Panel rows */}
                  {spec.panels.map((pan,i)=>(
                    <div key={i} className="grid px-4 py-2"
                      style={{gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",
                        borderBottom:i<spec.panels.length-1?"1px solid #E0D8CC":"none",
                        background:i%2===0?B.white:B.parchment}}>
                      <p className="text-[10px] font-bold" style={{color:B.dark}}>{pan.part}</p>
                      <p className="text-[10px] font-black" style={{color:B.orange}}>{pan.qty}</p>
                      <p className="text-[10px]" style={{color:B.dark}}>{pan.l}</p>
                      <p className="text-[10px]" style={{color:B.dark}}>{pan.w}</p>
                      <p className="text-[10px]" style={{color:"#9A8878"}}>{pan.note}</p>
                    </div>
                  ))}
                  {/* Multiplied totals footer */}
                  <div className="px-4 py-2 flex items-center justify-between"
                    style={{background:"#F8F0E8",borderTop:"1px solid #E0D8CC"}}>
                    <p className="text-[9px]" style={{color:"#9A8878"}}>
                      {placed_count} unit{placed_count>1?"s":""} x {spec.panels.reduce((s,p)=>s+p.qty,0)} panels each
                    </p>
                    <p className="text-[9px] font-black" style={{color:B.dark}}>
                      = {placed_count * spec.panels.reduce((s,p)=>s+p.qty,0)} total pieces
                    </p>
                  </div>
                </div>
              );
            });
          })()}

          {/* Consolidated cut list */}
          <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E0D8CC"}}>
            <div className="px-4 py-2" style={{background:B.parchment}}>
              <p className="text-[9px] font-black tracking-widest uppercase" style={{color:B.dark}}>
                Consolidated Cut List
              </p>
              <p className="text-[9px]" style={{color:"#9A8878"}}>All panels grouped by size</p>
            </div>
            {/* Column headers */}
            <div className="grid px-4 py-1.5"
              style={{gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"#F5F0E8",borderBottom:"1px solid #E0D8CC"}}>
              {["Part","Total Qty","L (mm)","W (mm)"].map(h=>(
                <p key={h} className="text-[8px] font-black tracking-widest uppercase" style={{color:"#9A8878"}}>{h}</p>
              ))}
            </div>
            {Object.values(panelSummary).sort((a,b)=>b.qty-a.qty).map((pan,i,arr)=>(
              <div key={i} className="grid px-4 py-2"
                style={{gridTemplateColumns:"2fr 1fr 1fr 1fr",
                  borderBottom:i<arr.length-1?"1px solid #E0D8CC":"none",
                  background:i%2===0?B.white:B.parchment}}>
                <p className="text-[10px] font-bold" style={{color:B.dark}}>{pan.part}</p>
                <p className="text-[10px] font-black" style={{color:B.orange}}>{pan.qty}</p>
                <p className="text-[10px]" style={{color:B.dark}}>{pan.l}</p>
                <p className="text-[10px]" style={{color:B.dark}}>{pan.w}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-4 py-2.5 flex gap-2 items-start"
            style={{background:"#FFF8EC",border:`1.5px solid ${B.gold}`}}>
            <Info size={12} color={B.gold} className="mt-0.5 flex-shrink-0"/>
            <p className="text-[10px]" style={{color:"#9A6A00"}}>
              Panel sizes are nominal at {PANEL_T}mm board thickness. Door/drawer faces are finished sizes with 2mm gap per edge. Verify all dimensions on site before cutting. Back panels at 12mm.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- APP ----------------------------------------------------------------------
export default function App(){
  const [step,    setStep]    = useState(1);
  const [placed,  setPlaced]  = useState([]);
  const [selType, setSelType] = useState(null);
  const [carc,    setCarc]    = useState("melamine");
  const [ct,      setCt]      = useState("formica_white");
  const [door,    setDoor]    = useState("supawood_white");
  const [handle,  setHandle]  = useState("black_bar");
  const [cs,      setCs]      = useState(13);
  const [gridCols, setGridCols] = useState(60); // 6000mm default

  useEffect(()=>{
    const upd = () => setCs(window.innerWidth<480?9:window.innerWidth<768?11:13);
    upd();
    window.addEventListener("resize",upd);
    return()=>window.removeEventListener("resize",upd);
  },[]);

  const q = calcQ(placed,carc,ct,door,handle);

  return(
    <div className="flex flex-col min-h-screen" style={{background:B.cream,fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3" style={{background:B.dark,borderBottom:`3px solid ${B.orange}`}}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Logo size={19}/>
            <div>
              <p className="text-xs font-black tracking-widest uppercase leading-none" style={{color:B.white}}>HWH</p>
              <p className="text-[8px] tracking-widest" style={{color:B.gold}}>DESIGNS</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold tracking-widest uppercase" style={{color:"#9A8878"}}>Built-In Configurator</p>
            {placed.length>0&&step===5&&<p className="text-xs font-black" style={{color:B.gold}}>{fmt(q.total)}</p>}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {STEPS.map((s,i)=>{
            const done=step>i+1, active=step===i+1;
            return(
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
                    style={{background:done?B.orange:active?B.white:"transparent",border:`2px solid ${done?B.orange:active?B.white:"#6A5A50"}`,color:done?B.white:active?B.dark:"#6A5A50"}}>
                    {done?<Check size={12}/>:`0${i+1}`}
                  </div>
                  <span className="text-[8px] font-bold tracking-widest uppercase" style={{color:active?B.gold:done?"#C4B8A8":"#6A5A50"}}>{s}</span>
                </div>
                {i<5&&<div className="w-5 h-px mx-1 mb-3" style={{background:step>i+1?B.orange:"#4A3A30"}}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}>
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{color:B.orange}}>Step {step} of 6</p>
              <p className="text-xl font-black" style={{color:B.dark}}>
                {["Design Your Layout","Core Materials","Finishes & Ironmongery","Layout Preview","Your Estimate","Floor Plan & Cutting Spec"][step-1]}
              </p>
              {step>=2&&step<5&&placed.length>0&&(
                <div className="mt-2 rounded-xl overflow-hidden" style={{background:B.dark}}>
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{borderBottom:"1px solid #3A2820"}}>
                    <div className="w-4 h-4 rounded flex-shrink-0" style={{background:PM.doors[door]?.color,border:"1px solid rgba(255,255,255,0.2)"}}/>
                    <div className="w-4 h-4 rounded flex-shrink-0" style={{background:PM.countertop[ct]?.color,border:"1px solid rgba(255,255,255,0.2)"}}/>
                    <p className="text-[10px] flex-1" style={{color:"#C4B8A8"}}>{placed.length} units  x  {PM.carcass[carc]?.label}</p>

                  </div>
                  <div className="grid grid-cols-3 divide-x" style={{borderColor:"#3A2820"}}>
                    {[
                      {label:"Floor Run",  val:(placed.filter(p=>["Floor","Corner","Tall"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
                      {label:"Wall Run",   val:(placed.filter(p=>cabDef(p.tid).cat==="Wall").reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
                      {label:"Countertop", val:(placed.filter(p=>["Floor","Corner"].includes(cabDef(p.tid).cat)).reduce((s,p)=>s+cabDef(p.tid).wMm,0)/1000).toFixed(2)+"m"},
                    ].map(m=>(
                      <div key={m.label} className="text-center py-1.5" style={{borderRight:"1px solid #3A2820"}}>
                        <p className="text-sm font-black leading-none" style={{color:B.white}}>{m.val}</p>
                        <p className="text-[8px] font-bold tracking-widest uppercase" style={{color:"#6A5A50"}}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {step===1&&(
              <div className="flex flex-col gap-3">
                <WallGrid placed={placed} setPlaced={setPlaced} selType={selType} setSelType={setSelType} door={door} handle={handle} cs={cs} gridCols={gridCols} setGridCols={setGridCols}/>
                <div className="rounded-2xl p-3" style={{background:B.white,border:"1.5px solid #E0D8CC"}}>
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-2" style={{color:B.orange}}>
                    {selType ? `v ${(APPLIANCES[selType]||PM.cabinets[selType])?.label||selType} selected -- click/tap the grid above to place` : "Select a unit below  x  then click the grid to place it"}
                  </p>
                  <Palette selType={selType} setSelType={setSelType}/>
                </div>
              </div>
            )}
            {step===2&&<Step2 carc={carc} setCarc={setCarc} ct={ct} setCt={setCt}/>}
            {step===3&&<Step3 door={door} setDoor={setDoor} handle={handle} setHandle={setHandle} placed={placed}/>}
            {step===4&&<StepPreview placed={placed} carc={carc} ct={ct} door={door} handle={handle} cs={cs}/>}
            {step===5&&<Step5Quote placed={placed} carc={carc} ct={ct} door={door} handle={handle}/>}
            {step===6&&<Step6FloorPlan placed={placed} carc={carc} ct={ct} door={door}/> }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 flex gap-2"
        style={{background:B.white,borderTop:`2px solid ${B.parchment}`,boxShadow:"0 -4px 20px rgba(37,25,23,0.12)"}}>
        {step>1&&(
          <button onClick={()=>setStep(s=>s-1)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
            style={{background:B.parchment,color:B.dark}}>
            <ChevronLeft size={16}/> Back
          </button>
        )}
        {step<6?(
          <button disabled={placed.filter(p=>!APPLIANCES[p.tid]).length===0&&step===1} onClick={()=>setStep(s=>s+1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm tracking-widest uppercase active:scale-95 transition-all disabled:opacity-40"
            style={{background:placed.length>0||step>1?B.dark:"#C4B8A8",color:B.white}}>
            {step===1&&`Next -- ${placed.filter(p=>!APPLIANCES[p.tid]).length} unit${placed.filter(p=>!APPLIANCES[p.tid]).length!==1?"s":""} placed`}
            {step===2&&"Next -> Finishes"}
            {step===3&&"Next -> Preview"}
            {step===4&&"View Quote"}
            {step===5&&"Floor Plan & Spec"}
            <ChevronRight size={16}/>
          </button>
        ):(
          <button onClick={()=>{setStep(1);setPlaced([]);setSelType(null);}}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
            style={{background:B.parchment,color:B.dark}}>
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
