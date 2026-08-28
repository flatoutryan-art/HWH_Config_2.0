import { useState, useRef, useEffect, useCallback } from "react";

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

const _S = Math.random().toString(36).slice(2,7);
const C = {
  black:  "#2A1D16",
  orange: "#D96339",
  gold:   "#A8700A",
  white:  "#FFFFFF",
  darkbg: "#F2EEE8",
  panel:  "#FAFAF7",
  border: "#E0D8CE",
  text:   "#2C211A",
  sub:    "#7A6658",
};

const LOGO_SRC = "data:image/png;base64,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";

const WALL_H_MM  = 2750;
const KICK_H_MM   = 150;
const FILLER_H_MM = 150;
const FLOOR_H_MM  = 870;
const UPPER_H_MM  = 720;
const UPPER_TOTAL = FILLER_H_MM + UPPER_H_MM;
const TALL_H_MM   = FILLER_H_MM + 2100 + KICK_H_MM;
const SNAP_MM    = 100;

// Corner rotation: 0=top-left, 1=top-right, 2=bottom-right, 3=bottom-left
const CORNER_ROTATIONS = ["↖ Top-Left","↗ Top-Right","↘ Bottom-Right","↙ Bottom-Left"];

// ─── Project-level materials ───────────────────────────────────────────────────
const COUNTERTOP_TYPES = [
  { id:"marble",   label:"Marble",   subtitle:"Natural / Engineered stone" },
  { id:"quartz",   label:"Quartz",   subtitle:"Engineered stone — consistent & durable" },
  { id:"melamine", label:"Formica",  subtitle:"Laminate board surface — wide colour range" },
];

const COUNTERTOP_COLOURS = [
  { id:"ct-white",  label:"White / Off-white",    color:"#F5F2EC", pattern:null,     types:["marble","melamine"] },
  { id:"ct-grey",   label:"Light Grey / Concrete",color:"#C8C8C4", pattern:"concrete",types:["marble","melamine"] },
  { id:"ct-black",  label:"Black / Nero",          color:"#1E1E1E", pattern:null,     types:["marble","melamine"] },
  { id:"ct-marble", label:"Marble / Stone look",   color:"#EAE6E0", pattern:"marble", types:["marble"] },
  { id:"ct-q-iceberg",       label:"Iceberg",          color:"#F8F8F6", pattern:"quartz-white",    types:["quartz"] },
  { id:"ct-q-magnolia",      label:"Magnolia",         color:"#F5F0E8", pattern:"quartz-cream",    types:["quartz"] },
  { id:"ct-q-macadamia",     label:"Macadamia",        color:"#E8E0CC", pattern:"quartz-sparkle",  types:["quartz"] },
  { id:"ct-q-sparkle",       label:"Sparkle",          color:"#ECEAE4", pattern:"quartz-sparkle",  types:["quartz"] },
  { id:"ct-q-stratus",       label:"Stratus",          color:"#F2F0E8", pattern:"quartz-white",    types:["quartz"] },
  { id:"ct-q-bianco-cloud",  label:"Bianco Cloud",     color:"#F4F2EE", pattern:"quartz-white",    types:["quartz"] },
  { id:"ct-q-aurelia",       label:"Aurelia",          color:"#F0EDE6", pattern:"quartz-white",    types:["quartz"] },
  { id:"ct-q-noble-white",   label:"Noble White",      color:"#F6F4F2", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-beach",         label:"Beach",            color:"#D8CEBC", pattern:"quartz-stone",    types:["quartz"] },
  { id:"ct-q-dazzle",        label:"Dazzle",           color:"#DDD8CC", pattern:"quartz-stone",    types:["quartz"] },
  { id:"ct-q-misty-pearl",   label:"Misty Pearl",      color:"#D4D0C4", pattern:"quartz-stone",    types:["quartz"] },
  { id:"ct-q-dusty-stone",   label:"Dusty Stone",      color:"#C8C4B8", pattern:"quartz-stone",    types:["quartz"] },
  { id:"ct-q-cremalat",      label:"Cremalat",         color:"#C8C4B0", pattern:"quartz-stone",    types:["quartz"] },
  { id:"ct-q-bianco-sup",    label:"Bianco Supremo",   color:"#EEE8DC", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-platinum",      label:"Platinum",         color:"#A8A8A4", pattern:"quartz-sparkle-grey",types:["quartz"] },
  { id:"ct-q-grey-river",    label:"Grey River",       color:"#B8B4AC", pattern:"quartz-sparkle-grey",types:["quartz"] },
  { id:"ct-q-slate",         label:"Slate",            color:"#6E7068", pattern:"quartz-grey",     types:["quartz"] },
  { id:"ct-q-charcoal-grey", label:"Charcoal Grey",    color:"#5A5C54", pattern:"quartz-grey",     types:["quartz"] },
  { id:"ct-q-fawn",          label:"Fawn",             color:"#9A9484", pattern:"quartz-grey",     types:["quartz"] },
  { id:"ct-q-grigio-cem",    label:"Grigio Cemento",   color:"#888882", pattern:"quartz-cement",   types:["quartz"] },
  { id:"ct-q-wrought-iron",  label:"Wrought Iron",     color:"#7A7870", pattern:"quartz-cement",   types:["quartz"] },
  { id:"ct-q-pietra-tempesta",label:"Pietra Tempesta", color:"#707070", pattern:"quartz-grey",     types:["quartz"] },
  { id:"ct-q-thunder",       label:"Thunder",          color:"#6A6860", pattern:"quartz-cement",   types:["quartz"] },
  { id:"ct-q-galaxy",        label:"Galaxy",           color:"#1A1A1A", pattern:"quartz-sparkle-dark",types:["quartz"] },
  { id:"ct-q-nero",          label:"Nero",             color:"#161616", pattern:"quartz-black",    types:["quartz"] },
  { id:"ct-q-calacatta-fine",label:"Calacatta Fine",   color:"#F4F2EE", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-bianco-venato", label:"Bianco Venato",    color:"#F2F0EC", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-calacatta-gold",label:"Calacatta Gold",   color:"#F5F0E4", pattern:"quartz-vein-gold",types:["quartz"] },
  { id:"ct-q-blanco-steel",  label:"Blanco Steel",     color:"#E8E4E0", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-blanco-bronze", label:"Blanco Bronze",    color:"#F0EDE4", pattern:"quartz-vein-bronze",types:["quartz"] },
  { id:"ct-q-blanco-pewter", label:"Blanco Pewter",    color:"#E0DCDA", pattern:"quartz-vein-grey",types:["quartz"] },
  { id:"ct-q-whisper",       label:"Whisper",          color:"#F6F4F2", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-bianco-stat",   label:"Bianco Statuario", color:"#F0EEEA", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-bianco-calac",  label:"Bianco Calacatta", color:"#F2F0EC", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-q-nero-venato",   label:"Nero Venato",      color:"#1C1C1C", pattern:"quartz-vein-dark",types:["quartz"] },
  { id:"ct-q-calacatta-zara",label:"Calacatta Zara",   color:"#111210", pattern:"quartz-vein-dark",types:["quartz"] },
  { id:"ct-q-bianco-carb",   label:"Bianco Carbonio",  color:"#F0EEE8", pattern:"quartz-vein-fine",types:["quartz"] },
  { id:"ct-f-walnut",        label:"Walnut Oak",       color:"#7A5C3C", pattern:"formica-wood-warm",  types:["melamine"] },
  { id:"ct-f-ash",           label:"Ash Grey",         color:"#B8AFA0", pattern:"formica-wood-ash",   types:["melamine"] },
  { id:"ct-f-ebony",         label:"Ebony Grain",      color:"#2E2A28", pattern:"formica-wood-dark",  types:["melamine"] },
  { id:"ct-f-matte-black",   label:"Matte Black",      color:"#1E1E20", pattern:"formica-solid-black",types:["melamine"] },
  { id:"ct-f-white-sparkle", label:"White Sparkle",    color:"#EEECEA", pattern:"formica-sparkle-wht",types:["melamine"] },
  { id:"ct-f-grey-slate",    label:"Grey Slate",       color:"#B0B4B8", pattern:"formica-slate",      types:["melamine"] },
  { id:"ct-f-salt-pepper",   label:"Salt & Pepper",    color:"#C0BCBA", pattern:"formica-speckle-lt", types:["melamine"] },
  { id:"ct-f-blue-granite",  label:"Blue Granite",     color:"#484C54", pattern:"formica-speckle-dk", types:["melamine"] },
  { id:"ct-f-emperador",     label:"Emperador Dark",   color:"#2A2420", pattern:"formica-emperador",  types:["melamine"] },
  { id:"ct-f-grey-stone",    label:"Grey Stone",       color:"#A4A8AC", pattern:"formica-stone-grey", types:["melamine"] },
];

const CARCASS_TYPES_MATERIAL = [
  { id:"solid",    label:"Solid Wood",  subtitle:"Hardwood carcass — premium" },
  { id:"melamine", label:"Melamine",    subtitle:"MDF / chipboard laminate"   },
];

const DRAWER_H_MM = 870; // same footprint as base, but drawn with drawer stacks

// Floor-standing types that get a kick plate
const FLOOR_TYPES = ["base","drawer","tall-single","tall-double","corner"];

const CARCASS_TYPES = [
  // Base units
  { id:"base-450",         type:"base",        label:"Base Unit",          width:450, height:FLOOR_H_MM, desc:"450mm",   icon:"▬", bg:"#3D2A1F" },
  { id:"base-600",         type:"base",        label:"Base Unit",          width:600, height:FLOOR_H_MM, desc:"600mm",   icon:"▬", bg:"#3D2A1F" },
  { id:"base-750",         type:"base",        label:"Base Unit",          width:750, height:FLOOR_H_MM, desc:"750mm",   icon:"▬", bg:"#3D2A1F" },
  { id:"base-800",         type:"base",        label:"Base Unit",          width:800, height:FLOOR_H_MM, desc:"800mm",   icon:"▬", bg:"#3D2A1F" },
  { id:"base-900",         type:"base",        label:"Base Unit",          width:900, height:FLOOR_H_MM, desc:"900mm",   icon:"▬", bg:"#3D2A1F" },
  // Drawer units
  { id:"drawer-450",       type:"drawer",      label:"Drawer Unit",        width:450, height:DRAWER_H_MM,desc:"450mm",   icon:"▤", bg:"#3A2A20" },
  { id:"drawer-600",       type:"drawer",      label:"Drawer Unit",        width:600, height:DRAWER_H_MM,desc:"600mm",   icon:"▤", bg:"#3A2A20" },
  { id:"drawer-750",       type:"drawer",      label:"Drawer Unit",        width:750, height:DRAWER_H_MM,desc:"750mm",   icon:"▤", bg:"#3A2A20" },
  { id:"drawer-800",       type:"drawer",      label:"Drawer Unit",        width:800, height:DRAWER_H_MM,desc:"800mm",   icon:"▤", bg:"#3A2A20" },
  { id:"drawer-900",       type:"drawer",      label:"Drawer Unit",        width:900, height:DRAWER_H_MM,desc:"900mm",   icon:"▤", bg:"#3A2A20" },
  // Wall cabinets (no kick plate)
  { id:"upper-450",        type:"upper",       label:"Wall Cabinet",       width:450, height:UPPER_TOTAL, desc:"450mm",   icon:"▭", bg:"#2A1D16" },
  { id:"upper-600",        type:"upper",       label:"Wall Cabinet",       width:600, height:UPPER_TOTAL, desc:"600mm",   icon:"▭", bg:"#2A1D16" },
  { id:"upper-750",        type:"upper",       label:"Wall Cabinet",       width:750, height:UPPER_TOTAL, desc:"750mm",   icon:"▭", bg:"#2A1D16" },
  { id:"upper-800",        type:"upper",       label:"Wall Cabinet",       width:800, height:UPPER_TOTAL, desc:"800mm",   icon:"▭", bg:"#2A1D16" },
  { id:"upper-900",        type:"upper",       label:"Wall Cabinet",       width:900, height:UPPER_TOTAL, desc:"900mm",   icon:"▭", bg:"#2A1D16" },
  // Tall — single full-height door (1 door, 3 hinges)
  { id:"tall-single-450",  type:"tall-single", label:"Tall — Single Door", width:450, height:TALL_H_MM,  desc:"450mm · 1 door", icon:"▮", bg:"#321E14" },
  { id:"tall-single-600",  type:"tall-single", label:"Tall — Single Door", width:600, height:TALL_H_MM,  desc:"600mm · 1 door", icon:"▮", bg:"#321E14" },
  { id:"tall-single-750",  type:"tall-single", label:"Tall — Single Door", width:750, height:TALL_H_MM,  desc:"750mm · 1 door", icon:"▮", bg:"#321E14" },
  { id:"tall-single-800",  type:"tall-single", label:"Tall — Single Door", width:800, height:TALL_H_MM,  desc:"800mm · 1 door", icon:"▮", bg:"#321E14" },
  { id:"tall-single-900",  type:"tall-single", label:"Tall — Single Door", width:900, height:TALL_H_MM,  desc:"900mm · 1 door", icon:"▮", bg:"#321E14" },
  // Tall — double stacked doors (2 doors, 4 hinges total — 2 per door)
  { id:"tall-double-450",  type:"tall-double", label:"Tall — Double Door",  width:450, height:TALL_H_MM,  desc:"450mm · 2 doors", icon:"▯", bg:"#2C1C12" },
  { id:"tall-double-600",  type:"tall-double", label:"Tall — Double Door",  width:600, height:TALL_H_MM,  desc:"600mm · 2 doors", icon:"▯", bg:"#2C1C12" },
  { id:"tall-double-750",  type:"tall-double", label:"Tall — Double Door",  width:750, height:TALL_H_MM,  desc:"750mm · 2 doors", icon:"▯", bg:"#2C1C12" },
  { id:"tall-double-800",  type:"tall-double", label:"Tall — Double Door",  width:800, height:TALL_H_MM,  desc:"800mm · 2 doors", icon:"▯", bg:"#2C1C12" },
  { id:"tall-double-900",  type:"tall-double", label:"Tall — Double Door",  width:900, height:TALL_H_MM,  desc:"900mm · 2 doors", icon:"▯", bg:"#2C1C12" },
  // Corner units
  { id:"corner-900",       type:"corner",      label:"Corner Unit",        width:900, height:FLOOR_H_MM, desc:"900×900", icon:"◣", bg:"#2D1C13" },
];

const APPLIANCE_TYPES = [
  { id:"appl-washer",     type:"appliance", label:"Washing Machine", width:600,  height:870,  icon:"⊙", desc:"600mm · floor", bg:"#2E3C44" },
  { id:"appl-dryer",      type:"appliance", label:"Tumble Dryer",    width:600,  height:870,  icon:"↻", desc:"600mm · floor", bg:"#2E3C44" },
  { id:"appl-dishwasher", type:"appliance", label:"Dishwasher",      width:600,  height:870,  icon:"≡", desc:"600mm · floor", bg:"#2E3C44" },
  { id:"appl-oven",       type:"appliance", label:"Oven",            width:600,  height:870,  icon:"▣", desc:"600mm · floor", bg:"#2E3C44" },
  { id:"appl-fridge-s",   type:"appliance", label:"Fridge (Single)", width:600,  height:1800, icon:"❄", desc:"600mm · tall",  bg:"#263040" },
  { id:"appl-fridge-d",   type:"appliance", label:"Fridge (Double)", width:900,  height:1800, icon:"❄", desc:"900mm · tall",  bg:"#263040" },
];

// ─── Hinges ───────────────────────────────────────────────────────────────────
const HINGES = [
  { id:"hinge-soft",  label:"Soft-Close Hinge",  subtitle:"Dampened soft-close action",  icon:"⬡" },
];
const DEFAULT_HINGE = "hinge-soft";

// Hinge count rules — returns { doors, hingesPerDoor, total }
function hingeCount(unit) {
  const t = unit.type;
  if (t === "drawer")      return { doors:0, hingesPerDoor:0, total:0 };
  if (t === "base")        return { doors: unit.width >= 600 ? 2 : 1, hingesPerDoor:2, total: unit.width >= 600 ? 4 : 2 };
  if (t === "upper")       return { doors: unit.width >= 600 ? 2 : 1, hingesPerDoor:2, total: unit.width >= 600 ? 4 : 2 };
  if (t === "corner")      return { doors:1, hingesPerDoor:2, total:2 };
  if (t === "tall-single") return { doors:1, hingesPerDoor:3, total:3 };   // 1 tall door needs 3 hinges
  if (t === "tall-double") return { doors:2, hingesPerDoor:2, total:4 };   // 2 stacked doors, 2 hinges each
  return { doors:0, hingesPerDoor:0, total:0 };
}

// ─── Runners ─────────────────────────────────────────────────────────────────
const RUNNERS = [
  { id:"runner-soft", label:"Soft-Close Runner", subtitle:"Dampened soft-close action",   icon:"⇒" },
];
const DEFAULT_RUNNER = "runner-soft";

// Drawer count per unit
function drawerCount(unit) {
  if (unit.type !== "drawer") return 0;
  return unit.width <= 450 ? 3 : 4;
}

const FINISHES = [
  { id:"matte-folkstone",  label:"Folkstone Grey",  color:"#C4D0D4", type:"matte" },
  { id:"matte-white",      label:"Matte White",     color:"#F5F5F0", type:"matte" },
  { id:"matte-cream",      label:"Matte Cream",     color:"#EDE8DC", type:"matte" },
  { id:"matte-sage",       label:"Sage Green",      color:"#8A9E85", type:"matte" },
  { id:"matte-charcoal",   label:"Charcoal",        color:"#4A4A4A", type:"matte" },
  { id:"matte-navy",       label:"Navy Blue",       color:"#2C3E6B", type:"matte" },
  { id:"matte-clay",       label:"Clay",            color:"#C4724A", type:"matte" },
  { id:"matte-dustpink",   label:"Dusty Rose",      color:"#C9A49A", type:"matte" },
  { id:"matte-slate",      label:"Slate Grey",      color:"#7A8A96", type:"matte" },
  { id:"gloss-iceberg",    label:"Iceberg White",   color:"#EAF0F0", type:"gloss" },
  { id:"gloss-cappuccino", label:"Cappuccino",      color:"#C8C4A8", type:"gloss" },
  { id:"gloss-dunblane",   label:"Dunblane Grey",   color:"#9A9C9C", type:"gloss" },
  { id:"gloss-storm",      label:"Storm Grey",      color:"#4A5158", type:"gloss" },
  { id:"gloss-caraz",      label:"Caraz",           color:"#7A9488", type:"gloss" },
  { id:"gloss-petrol",     label:"Petrol Blue",     color:"#1E3A50", type:"gloss" },
  { id:"gloss-white",      label:"Gloss White",     color:"#FAFAFA", type:"gloss" },
  { id:"gloss-black",      label:"Gloss Black",     color:"#1A1A1A", type:"gloss" },
  { id:"gloss-champ",      label:"Champagne",       color:"#D4B896", type:"gloss" },
  { id:"wood-shale",       label:"Shale Oak",       color:"#C0B09C", type:"wood"  },
  { id:"wood-treviso",     label:"Treviso",         color:"#9A9084", type:"wood"  },
  { id:"wood-alegria",     label:"Alegria",         color:"#6E5C48", type:"wood"  },
  { id:"wood-cherry",      label:"Harvard Cherry",  color:"#A07868", type:"wood"  },
  { id:"wood-oak",         label:"Natural Oak",     color:"#C8A870", type:"wood"  },
  { id:"wood-walnut",      label:"Dark Walnut",     color:"#5C3D2E", type:"wood"  },
  { id:"wood-ash",         label:"Ash Grey",        color:"#A8A8A0", type:"wood"  },
  { id:"wood-pine",        label:"Light Pine",      color:"#DEC48A", type:"wood"  },
];

const HARDWARE = [
  { id:"none",   label:"Push-Open",    color:null      },
  { id:"gold",   label:"Brushed Gold", color:"#C9A84C" },
  { id:"silver", label:"Chrome Silver",color:"#C0C0C0" },
  { id:"black",  label:"Matte Black",  color:"#2A2A2A" },
  { id:"bronze", label:"Oil Bronze",   color:"#614E3A" },
];


// ─── Pricing Catalog (ingested from hwh_pricing_catalog.xlsx) ─────────────────
const PRICING = {
  // 1. Carcass units — price per unit (R)
  carcass: {
    "base-450": 450,   "base-600": 550,   "base-750": 650,  "base-800": 720,  "base-900": 820,
    "drawer-450": 950, "drawer-600": 1150,"drawer-750":1300, "drawer-800": 1450,"drawer-900":1600,
    "upper-450": 450,  "upper-600": 550,  "upper-750": 650,  "upper-800": 720,  "upper-900": 820,
    "tall-single-450": 1150, "tall-single-600": 1450, "tall-single-750":1700, "tall-single-800": 1950, "tall-single-900":2100,
    "tall-double-450": 1150, "tall-double-600": 1450, "tall-double-750":1700, "tall-double-800": 1950, "tall-double-900":2100,
    "corner-900": 1650,
  },
  countertop: {
    "ct-white": 2350, "ct-grey": 2350, "ct-black": 2450, "ct-marble": 2600,
    "ct-q-iceberg": 1950, "ct-q-magnolia": 1950, "ct-q-macadamia": 2050, "ct-q-sparkle": 2050,
    "ct-q-stratus": 1950, "ct-q-bianco-cloud": 1950, "ct-q-aurelia": 2050, "ct-q-noble-white": 2150,
    "ct-q-beach": 2050, "ct-q-dazzle": 2050, "ct-q-misty-pearl": 2050, "ct-q-dusty-stone": 2050,
    "ct-q-cremalat": 2050, "ct-q-bianco-sup": 2150,
    "ct-q-platinum": 2100, "ct-q-grey-river": 2100, "ct-q-slate": 2100, "ct-q-charcoal-grey": 2100,
    "ct-q-fawn": 2100, "ct-q-grigio-cem": 2150, "ct-q-wrought-iron": 2150,
    "ct-q-pietra-tempesta": 2200, "ct-q-thunder": 2150, "ct-q-galaxy": 2350, "ct-q-nero": 2350,
    "ct-q-calacatta-fine": 2450, "ct-q-bianco-venato": 2350, "ct-q-calacatta-gold": 2650,
    "ct-q-blanco-steel": 2350, "ct-q-blanco-bronze": 2550, "ct-q-blanco-pewter": 2450,
    "ct-q-whisper": 2250, "ct-q-bianco-stat": 2450, "ct-q-bianco-calac": 2450,
    "ct-q-nero-venato": 2550, "ct-q-calacatta-zara": 2750, "ct-q-bianco-carb": 2350,
    "ct-f-walnut": 950, "ct-f-ash": 850, "ct-f-ebony": 950, "ct-f-matte-black": 850,
    "ct-f-white-sparkle": 850, "ct-f-grey-slate": 950, "ct-f-salt-pepper": 850,
    "ct-f-blue-granite": 950, "ct-f-emperador": 1050, "ct-f-grey-stone": 850,
  },
  // 3. Carcass build upcharge per unit (R) — added on top of carcass base price
  carcassBuild: { "melamine": 650, "solid": 950 },
  // 4. Door finishes — price per door leaf (R), keyed by finish id
  finish: {
    "matte-folkstone": 650, "matte-white": 650, "matte-cream": 650, "matte-sage": 650,
    "matte-charcoal": 650, "matte-navy": 650, "matte-clay": 650, "matte-dustpink": 650, "matte-slate": 650,
    "gloss-iceberg": 950, "gloss-cappuccino": 950, "gloss-dunblane": 950, "gloss-storm": 950,
    "gloss-caraz": 950, "gloss-petrol": 950, "gloss-white": 950, "gloss-black": 950, "gloss-champ": 950,
    "wood-shale": 1100, "wood-treviso": 1100, "wood-alegria": 1100, "wood-cherry": 1100,
    "wood-oak": 1100, "wood-walnut": 1100, "wood-ash": 1100, "wood-pine": 1100,
  },
  // 5. Handles — price per handle (R), keyed by hardware id
  hardware: { "none": 110, "gold": 25, "silver": 25, "black": 25, "bronze": 25 },
  // 6. Hinges — price per hinge (R)
  hinge: { "hinge-soft": 115 },
  // 7. Drawer runners — price per pair (R)
  runner: { "runner-soft": 195 },
  // 8. Kick plate — price per linear metre (R/lm)
  kickPlate: 85,
};

// ── Calculate total price for the full job ─────────────────────────────────────
function calcJobTotal(units, materials) {
  let total = 0;
  const nonAppliance = units.filter(u => u.type !== "appliance");
  const carcassBuildUpcharge = PRICING.carcassBuild[materials.carcass] || 0;
  const carcassMarkup = materials.carcass === "solid" ? 6.0 : 3.5;

  const floorRunM = nonAppliance
    .filter(u => ["base","drawer","tall-single","tall-double","corner"].includes(u.type))
    .reduce((s, u) => s + u.width, 0) / 1000;

  const countertopRunM = nonAppliance
    .filter(u => ["base","drawer","corner"].includes(u.type))
    .reduce((s, u) => s + u.width, 0) / 1000;

  const fillerRunM = nonAppliance
    .filter(u => ["tall-single","tall-double","upper"].includes(u.type))
    .reduce((s, u) => s + u.width, 0) / 1000;

  nonAppliance.forEach(u => {
    const carcassKey = `${u.type}-${u.width}`;
    const carcassPrice = PRICING.carcass[carcassKey] || 0;
    total += (carcassPrice + carcassBuildUpcharge) * carcassMarkup;

    const hc = hingeCount(u);
    const finishPricePerDoor = PRICING.finish[u.finish || DEFAULT_FINISH] || 0;
    total += finishPricePerDoor * hc.doors;

    const dc = drawerCount(u);
    const handlePrice = PRICING.hardware[u.hardware || DEFAULT_HW] || 0;
    total += handlePrice * (hc.doors + dc);

    const hingePrice = PRICING.hinge[u.hinge || DEFAULT_HINGE] || 0;
    total += hingePrice * hc.total;

    const runnerPrice = PRICING.runner[u.runner || DEFAULT_RUNNER] || 0;
    total += runnerPrice * dc;
  });

  const ctPrice = PRICING.countertop[materials.ctColour] || 0;
  total += ctPrice * countertopRunM;

  total += PRICING.kickPlate * floorRunM;
  total += PRICING.kickPlate * fillerRunM;

  return Math.round(total);
}

const DEFAULT_FINISH = "gloss-iceberg";
const DEFAULT_HW     = "gold";

const snapMm    = v => Math.round(v / SNAP_MM) * SNAP_MM;
const getFinish = id => FINISHES.find(f => f.id === id) || FINISHES[0];

function finishBg(id) {
  const f = getFinish(id);
  if (f.type === "wood")  return `repeating-linear-gradient(90deg,${f.color}CC 0,${f.color} 2px,${f.color}88 5px,${f.color} 8px)`;
  if (f.type === "gloss") return `linear-gradient(145deg,${f.color} 55%,#fff5 100%)`;
  return f.color;
}

function countertopBg(ct) {
  if (!ct) return "transparent";
  switch(ct.pattern) {
    case "marble":        return `linear-gradient(135deg,#EAE6E0 38%,#D8D4CE 40%,#EAE6E0 42%,#E0DCD5 58%,#EAE6E0 60%,#D4D0CA 78%,#EAE6E0 80%)`;
    case "concrete":      return `radial-gradient(ellipse at 30% 40%,#C0C0BC 0%,#C8C8C4 40%,#BEBEBA 100%)`;
    case "wood":          return `repeating-linear-gradient(90deg,#C4935A 0,#B8864E 2px,#C4935A 5px,#BE8D54 8px)`;
    case "granite-dark":  return `radial-gradient(ellipse at 20% 30%,#2A2A2A 0%,#1A1A1A 50%,#242424 100%)`;
    case "granite-grey":  return `radial-gradient(ellipse at 60% 40%,#7A8690 0%,#6E7A80 50%,#626E74 100%)`;
    case "granite-light": return `radial-gradient(ellipse at 30% 60%,#F0EBE2 0%,#EDE8DF 50%,#E4DFD4 100%)`;
    case "granite-brown": return `radial-gradient(ellipse at 70% 30%,#8A5438 0%,#7A4A30 50%,#6A3E28 100%)`;
    case "granite-green": return `radial-gradient(ellipse at 40% 50%,#567860 0%,#4A6A50 50%,#3E5C44 100%)`;
    case "granite-blue":  return `radial-gradient(ellipse at 50% 40%,#46567A 0%,#3A4A6A 50%,#2E3E5A 100%)`;
    case "quartz-white":        return ct.color;
    case "quartz-cream":        return `linear-gradient(135deg,${ct.color} 60%,${ct.color}CC 100%)`;
    case "quartz-sparkle":      return `radial-gradient(ellipse at 30% 40%,${ct.color}EE 0%,${ct.color} 40%,${ct.color}CC 100%)`;
    case "quartz-sparkle-grey": return `radial-gradient(ellipse at 60% 30%,#C0C0BC 0%,#B8B4AC 50%,#B0ACA4 100%)`;
    case "quartz-sparkle-dark": return `radial-gradient(ellipse at 40% 40%,#242424 0%,#1A1A1A 50%,#101010 100%)`;
    case "quartz-stone":        return `radial-gradient(ellipse at 40% 50%,${ct.color}EE 0%,${ct.color} 50%,${ct.color}BB 100%)`;
    case "quartz-grey":         return ct.color;
    case "quartz-cement":       return `radial-gradient(ellipse at 30% 30%,${ct.color}EE 0%,${ct.color} 60%,${ct.color}CC 100%)`;
    case "quartz-black":        return "#161616";
    case "quartz-vein-fine":    return `linear-gradient(125deg,${ct.color} 38%,rgba(180,180,175,0.4) 40%,${ct.color} 42%,${ct.color} 65%,rgba(190,188,184,0.3) 67%,${ct.color} 69%)`;
    case "quartz-vein-gold":    return `linear-gradient(130deg,#F8F4EC 30%,#C8A860 32%,#F5F0E4 34%,#F5F0E4 55%,#D4B070 57%,#F5F0E4 59%)`;
    case "quartz-vein-bronze":  return `linear-gradient(140deg,#F4F0E8 35%,#A07840 37%,#F0EDE4 39%,#F0EDE4 60%,#8A6838 62%,#F0EDE4 64%)`;
    case "quartz-vein-grey":    return `linear-gradient(130deg,#E8E4E2 40%,#9A9894 42%,#E0DCDA 44%,#E0DCDA 62%,#A8A6A2 64%,#E0DCDA 66%)`;
    case "quartz-vein-dark":    return `linear-gradient(135deg,#1C1C1C 35%,#3A3A38 37%,#1A1A18 39%,#141412 60%,#2E2E2C 62%,#121210 64%)`;
    case "formica-wood-warm":   return `linear-gradient(180deg,#8A6844 0%,#7A5C3C 15%,#6E5234 30%,#7E6040 45%,#8A6844 60%,#6A4E30 75%,#7A5C3C 100%)`;
    case "formica-wood-ash":    return `linear-gradient(180deg,#C4BAA8 0%,#B8AFA0 20%,#C0B5A4 40%,#ACAA9A 60%,#B8AFA0 80%,#BEB4A4 100%)`;
    case "formica-wood-dark":   return `linear-gradient(180deg,#343030 0%,#2E2A28 12%,#383432 25%,#2A2624 40%,#302C2A 55%,#262220 70%,#2E2A28 85%,#343030 100%)`;
    case "formica-solid-black": return `#1E1E20`;
    case "formica-sparkle-wht": return `radial-gradient(ellipse at 30% 40%,#F4F2F0 0%,#EEECEA 40%,#E8E6E4 100%)`;
    case "formica-slate":       return `linear-gradient(145deg,#B8BCC0 30%,#222222 32%,#B0B4B8 34%,#B0B4B8 58%,#1A1A1A 60%,#AEB2B6 62%)`;
    case "formica-speckle-lt":  return `radial-gradient(ellipse at 40% 50%,#D0CCCA 0%,#C0BCBA 40%,#B4B0AE 100%)`;
    case "formica-speckle-dk":  return `radial-gradient(ellipse at 50% 40%,#54585E 0%,#484C54 40%,#3C4048 100%)`;
    case "formica-emperador":   return `radial-gradient(ellipse at 30% 30%,#3A302C 0%,#2A2420 50%,#1E1A18 100%)`;
    case "formica-stone-grey":  return `radial-gradient(ellipse at 50% 40%,#B0B4B8 0%,#A4A8AC 50%,#9CA0A4 100%)`;
    default:              return ct.color;
  }
}

// Returns corner polygon points based on rotation (0-3)
function cornerPoints(W, H, rot) {
  const cx = W * 0.38, cy = H * 0.38;
  switch(rot % 4) {
    case 0: return `0,0 ${W},0 ${W},${H} ${cx},${H} 0,${H-cy}`; // top-left notch
    case 1: return `0,0 ${W},0 ${W},${H-cy} ${W-cx},${H} 0,${H}`; // top-right notch
    case 2: return `${W-cx},0 ${W},${cy} ${W},${H} 0,${H} 0,0`; // bottom-right notch
    case 3: return `0,${cy} ${cx},0 ${W},0 ${W},${H} 0,${H}`; // bottom-left notch
    default: return `0,0 ${W},0 ${W},${H} ${cx},${H} 0,${H-cy}`;
  }
}

function ApplianceSVG({ unit, pxPerMm, selected }) {
  const W = unit.width * pxPerMm, H = unit.height * pxPerMm;
  const uid = `a${unit.id}`;
  const a = APPLIANCE_TYPES.find(x => x.id === unit.appId) || APPLIANCE_TYPES[0];
  const detail = () => {
    if (a.id==="appl-washer"||a.id==="appl-dryer") {
      const cx=W/2,cy=H*0.42,r=Math.min(W,H)*0.26;
      return (<><circle cx={cx} cy={cy} r={r} fill="#9BBCCC" stroke="#6A90A0" strokeWidth={1.5}/><circle cx={cx} cy={cy} r={r*0.52} fill="#C8DCE8" stroke="#6A90A0" strokeWidth={1}/><circle cx={cx} cy={cy} r={r*0.1} fill="#5A8090"/><rect x={W*0.1} y={H*0.08} width={W*0.55} height={H*0.055} rx={2} fill="#8AAABB" opacity={0.7}/></>);
    }
    if (a.id==="appl-dishwasher") return (<><rect x={W*0.1} y={H*0.06} width={W*0.8} height={H*0.09} rx={2} fill="#9AACB8"/><rect x={W*0.08} y={H*0.18} width={W*0.84} height={H*0.6} rx={3} fill="#B8CCDA" stroke="#7A9AAC" strokeWidth={1}/>{[0.3,0.44,0.58].map((y,i)=><line key={i} x1={W*0.14} y1={H*y} x2={W*0.86} y2={H*y} stroke="#7A9AAC" strokeWidth={0.8}/>)}</>);
    if (a.id==="appl-oven") return (<><rect x={W*0.08} y={H*0.05} width={W*0.84} height={H*0.22} rx={2} fill="#9AACB4" stroke="#708090" strokeWidth={1}/>{[0.22,0.48,0.74].map((x,i)=><circle key={i} cx={W*x} cy={H*0.16} r={W*0.07} fill="#607080"/>)}<rect x={W*0.08} y={H*0.3} width={W*0.84} height={H*0.58} rx={3} fill="#B0BCCA" stroke="#708090" strokeWidth={1}/><rect x={W*0.14} y={H*0.36} width={W*0.72} height={H*0.46} rx={2} fill="#8090A0" opacity={0.5}/></>);
    if (a.id==="appl-fridge-s") return (<><rect x={W*0.06} y={H*0.03} width={W*0.88} height={H*0.32} rx={4} fill="#B0C4D0" stroke="#7A9AAA" strokeWidth={1.5}/><rect x={W*0.06} y={H*0.38} width={W*0.88} height={H*0.59} rx={4} fill="#B8CCDA" stroke="#7A9AAA" strokeWidth={1.5}/><rect x={W*0.76} y={H*0.16} width={W*0.07} height={H*0.09} rx={2} fill="#7A9AAA"/><rect x={W*0.76} y={H*0.6} width={W*0.07} height={H*0.14} rx={2} fill="#7A9AAA"/></>);
    if (a.id==="appl-fridge-d") return (<><rect x={W*0.04} y={H*0.03} width={W*0.44} height={H*0.94} rx={4} fill="#B0C4D0" stroke="#7A9AAA" strokeWidth={1.5}/><rect x={W*0.52} y={H*0.03} width={W*0.44} height={H*0.94} rx={4} fill="#B8CCDA" stroke="#7A9AAA" strokeWidth={1.5}/><rect x={W*0.2} y={H*0.44} width={W*0.08} height={H*0.12} rx={2} fill="#7A9AAA"/><rect x={W*0.72} y={H*0.44} width={W*0.08} height={H*0.12} rx={2} fill="#7A9AAA"/></>);
    return null;
  };
  return (
    <svg width={W} height={H} style={{ display:"block", overflow:selected?"visible":"hidden", pointerEvents:"none" }}>
      <defs>{selected&&<filter id={`sel${uid}`} x="-12%" y="-12%" width="124%" height="124%"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={C.orange} floodOpacity="1"/></filter>}</defs>
      <rect x={0} y={0} width={W} height={H} rx={4} fill="#D4E4EE" stroke={selected?C.orange:"#90B0C0"} strokeWidth={selected?2.5:1.5} filter={selected?`url(#sel${uid})`:undefined}/>
      {detail()}
      <rect x={W/2-34} y={H*0.82} width={68} height={15} rx={3} fill="rgba(255,255,255,0.75)"/>
      <text x={W/2} y={H*0.82+11} textAnchor="middle" fontSize={Math.max(7,pxPerMm*22)} fill="#3A5060" fontFamily="sans-serif" fontWeight="bold">{a.label}</text>
      <rect x={W/2-22} y={H-17} width={44} height={13} rx={3} fill="rgba(0,0,0,0.35)"/>
      <text x={W/2} y={H-7} textAnchor="middle" fontSize={Math.max(7,pxPerMm*28)} fill="#FFF" fontFamily="sans-serif">{unit.width}mm</text>
    </svg>
  );
}


// ─── Footer Component ──────────────────────────────────────────────────────────
function HWHFooter() {
  return (
    <footer style={{ background:"#1A1614", color:"#C8B8A8", fontFamily:"'Trebuchet MS',sans-serif", padding:"40px 24px 24px", borderTop:"3px solid #D96339" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        {/* Logo + Nav */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:32, alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
          {/* Logo */}
          <a href="https://hwhdesigns.co.za" rel="dofollow" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:12 }}>
            <svg viewBox="0 0 48 16" width={48} height={16}>
              <circle cx="8"  cy="8" r="8" fill="#D96339"/>
              <polygon points="8,3.3 12.7,8 8,12.7 3.3,8" fill="#EBBD46"/>
              <circle cx="8"  cy="8" r="1.8" fill="#1A1A1A"/>
              <circle cx="24" cy="8" r="8" fill="#1A1A1A"/>
              <polygon points="24,3.3 28.7,8 24,12.7 19.3,8" fill="#FFFFFF"/>
              <circle cx="24" cy="8" r="1.8" fill="#D96339"/>
              <circle cx="40" cy="8" r="8" fill="#EBBD46"/>
              <polygon points="40,3.3 44.7,8 40,12.7 35.3,8" fill="#D96339"/>
              <circle cx="40" cy="8" r="1.8" fill="#1A1A1A"/>
            </svg>
            <span style={{ fontSize:13, letterSpacing:3, color:"#F0EDE8", fontWeight:"bold", textTransform:"uppercase" }}>HWH Designs</span>
          </a>
          {/* Nav links */}
          <nav style={{ display:"flex", flexWrap:"wrap", gap:"8px 24px" }}>
            {[
              ["Portfolio",    "https://hwhdesigns.co.za/portfolio"],
              ["About",        "https://hwhdesigns.co.za/about"],
              ["Services",     "https://hwhdesigns.co.za/services"],
              ["Contact",      "https://hwhdesigns.co.za/contact"],
              ["Meet the Team","https://hwhdesigns.co.za/meet-the-team"],
              ["Kitchen Guide","https://hwhdesigns.co.za/kitchen-guide"],
            ].map(([label, href]) => (
              <a key={label} href={href} rel="dofollow"
                style={{ color:"#C8B8A8", textDecoration:"none", fontSize:11, letterSpacing:1.5, textTransform:"uppercase",
                  transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#D96339"}
                onMouseLeave={e=>e.target.style.color="#C8B8A8"}>
                {label}
              </a>
            ))}
          </nav>
          {/* Social icons */}
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <a href="https://www.instagram.com/hwhdesigns" rel="dofollow" aria-label="HWH Designs on Instagram"
              style={{ color:"#C8B8A8", textDecoration:"none", fontSize:20, lineHeight:1 }}
              onMouseEnter={e=>e.target.style.color="#D96339"} onMouseLeave={e=>e.target.style.color="#C8B8A8"}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/hwhdesigns" rel="dofollow" aria-label="HWH Designs on Facebook"
              style={{ color:"#C8B8A8", textDecoration:"none", lineHeight:1 }}
              onMouseEnter={e=>e.target.style.color="#D96339"} onMouseLeave={e=>e.target.style.color="#C8B8A8"}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16, marginBottom:12 }}/>

        {/* Service areas */}
        <p style={{ fontSize:10, color:"#A09080", lineHeight:1.8, marginBottom:12 }}>
          Proudly serving{" "}
          {[
            ["Johannesburg","https://hwhdesigns.co.za/kitchen-designers-johannesburg"],
            ["Sandton",     "https://hwhdesigns.co.za/kitchen-designers-sandton"],
            ["Bryanston",   "https://hwhdesigns.co.za/kitchen-designers-bryanston"],
            ["Waterfall",   "https://hwhdesigns.co.za/kitchen-designers-waterfall"],
          ].map(([city, href], i, arr) => (
            <span key={city}>
              <a href={href} rel="dofollow"
                style={{ color:"#C8B8A8", textDecoration:"underline", textDecorationColor:"rgba(217,99,57,0.4)" }}>
                {city}
              </a>{i < arr.length-1 ? ", " : ""}
            </span>
          ))}
          {" "}and surrounding Gauteng areas — custom built-in kitchens, joinery & interior design.
        </p>

        {/* Copyright */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"space-between", alignItems:"center", fontSize:9, color:"#706050", letterSpacing:0.5 }}>
          <span>© {new Date().getFullYear()} <a href="https://hwhdesigns.co.za" rel="dofollow" style={{ color:"#A09080", textDecoration:"none" }}>HWH Designs</a>. All rights reserved.</span>
          <span>
            Configurator by{" "}
            <a href="https://revyourbusiness.co.za" rel="dofollow"
              style={{ color:"#D96339", textDecoration:"none", fontWeight:"bold", letterSpacing:1 }}>
              REV Improvement Consulting
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page ───────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const steps = [
    { num:"01", icon:"📐", title:"Set Your Wall Width", body:"Enter your kitchen wall measurement in millimetres. The canvas scales to your exact space." },
    { num:"02", icon:"🪵", title:"Place Your Cabinets", body:"Drag units from the palette onto the wall — or tap ＋ on mobile. Mix base, drawer, wall, tall and corner units. Drop appliance placeholders to visualise your space." },
    { num:"03", icon:"🎨", title:"Choose Materials", body:"Select your carcass build, countertop type and colour from the full Quartz, Formica and Marble range." },
    { num:"04", icon:"✨", title:"Apply Door Finishes", body:"Pick your Supamatt, Supagloss or Wood Grain door finish per cabinet — or apply one to the entire run at once." },
    { num:"05", icon:"📋", title:"Get Your Quote", body:"Review the itemised build spec, run metres and estimated cost, then submit directly to Kim at HWH Designs." },
  ];
  return (
    <div style={{ minHeight:"100vh", background:"#F2EEE8", fontFamily:"'Trebuchet MS',sans-serif", display:"flex", flexDirection:"column" }}>
      {/* Hero */}
      <div style={{ background:"#2A1D16", color:"#F0EDE8", padding:"48px 24px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Subtle texture lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(90deg,rgba(217,99,57,0.04) 0,rgba(217,99,57,0.04) 1px,transparent 1px,transparent 80px)", pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <a href="https://hwhdesigns.co.za" rel="dofollow" style={{ display:"inline-flex", alignItems:"center", gap:12, textDecoration:"none", marginBottom:28 }}>
            <svg viewBox="0 0 48 16" width={52} height={18}>
              <circle cx="8"  cy="8" r="8" fill="#D96339"/>
              <polygon points="8,3.3 12.7,8 8,12.7 3.3,8" fill="#EBBD46"/>
              <circle cx="8"  cy="8" r="1.8" fill="#1A1A1A"/>
              <circle cx="24" cy="8" r="8" fill="#1A1A1A"/>
              <polygon points="24,3.3 28.7,8 24,12.7 19.3,8" fill="#FFFFFF"/>
              <circle cx="24" cy="8" r="1.8" fill="#D96339"/>
              <circle cx="40" cy="8" r="8" fill="#EBBD46"/>
              <polygon points="40,3.3 44.7,8 40,12.7 35.3,8" fill="#D96339"/>
              <circle cx="40" cy="8" r="1.8" fill="#1A1A1A"/>
            </svg>
            <span style={{ fontSize:11, letterSpacing:4, color:"#C8B8A8", textTransform:"uppercase" }}>HWH Designs</span>
          </a>
          <h1 style={{ fontSize:"clamp(22px,5vw,38px)", fontWeight:"bold", letterSpacing:1, marginBottom:12, lineHeight:1.2 }}>
            Kitchen Cabinet Configurator
          </h1>
          <p style={{ fontSize:"clamp(12px,2.5vw,15px)", color:"#C8B8A8", maxWidth:540, margin:"0 auto 32px", lineHeight:1.7 }}>
            Design your custom built-in kitchen online. Choose cabinet sizes, countertops, door finishes and get an instant indicative quote — then submit directly to our team.
          </p>
          <button onClick={onStart} style={{ background:"#D96339", color:"#FFFFFF", border:"none", borderRadius:6, padding:"14px 40px", fontSize:13, fontWeight:"bold", letterSpacing:2, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 24px rgba(217,99,57,0.45)", transition:"transform 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            Start Designing →
          </button>
          <p style={{ marginTop:12, fontSize:10, color:"rgba(200,184,168,0.6)", letterSpacing:1 }}>FREE · No account required · Takes 2–5 minutes</p>
        </div>
      </div>

      {/* How to use */}
      <div style={{ flex:1, padding:"44px 24px 48px", maxWidth:900, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:9, letterSpacing:4, color:"#D96339", textTransform:"uppercase", marginBottom:8 }}>How it works</div>
          <h2 style={{ fontSize:"clamp(16px,3vw,22px)", color:"#2A1D16", fontWeight:"bold", letterSpacing:0.5 }}>
            Five steps to your perfect kitchen
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
          {steps.map(s => (
            <div key={s.num} style={{ background:"#FAFAF7", border:"1px solid #E0D8CE", borderRadius:10, padding:"22px 20px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:14, right:16, fontSize:32, opacity:0.07, fontWeight:"bold", color:"#2A1D16", letterSpacing:-1 }}>{s.num}</div>
              <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:11, fontWeight:"bold", color:"#2A1D16", letterSpacing:0.5, marginBottom:6 }}>{s.title}</div>
              <div style={{ fontSize:11, color:"#7A6658", lineHeight:1.7 }}>{s.body}</div>
            </div>
          ))}
          {/* CTA card */}
          <div style={{ background:"#D96339", borderRadius:10, padding:"22px 20px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:10 }}>🏠</div>
            <div style={{ fontSize:11, fontWeight:"bold", color:"#FFFFFF", letterSpacing:0.5, marginBottom:10 }}>Ready to design?</div>
            <button onClick={onStart} style={{ background:"#FFFFFF", color:"#D96339", border:"none", borderRadius:5, padding:"10px 24px", fontSize:11, fontWeight:"bold", letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
              Open Configurator
            </button>
          </div>
        </div>

        {/* Feature pills */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginTop:36 }}>
          {["37 Quartz colours","10 Formica surfaces","4 Marble options","Supamatt · Supagloss · Wood Grain doors","750 → 900mm unit widths","Soft-close hardware only","Appliance placeholders","Instant indicative quote"].map(f => (
            <span key={f} style={{ background:"#EDE6DC", color:"#5A4A3A", fontSize:10, padding:"5px 12px", borderRadius:20, letterSpacing:0.5 }}>{f}</span>
          ))}
        </div>
      </div>

      <HWHFooter/>
    </div>
  );
}

// ─── Cabinet SVG ──────────────────────────────────────────────────────────────
function CabinetSVG({ unit, pxPerMm, selected, ctColour }) {
  const W           = unit.width  * pxPerMm;
  const H           = unit.height * pxPerMm;
  const f           = getFinish(unit.finish || DEFAULT_FINISH);
  const hw          = HARDWARE.find(h => h.id === (unit.hardware || DEFAULT_HW));
  const isWood      = f.type === "wood";
  const isGloss     = f.type === "gloss";
  const isBase      = unit.type === "base";
  const isDrawer    = unit.type === "drawer";
  const isCorner    = unit.type === "corner";
  const isUpper     = unit.type === "upper";
  const isTallSingle= unit.type === "tall-single";
  const isTallDouble= unit.type === "tall-double";
  const isTall      = isTallSingle || isTallDouble;
  const isFloor     = FLOOR_TYPES.includes(unit.type);
  const uid         = `${_S}_${unit.id}`;

  // Door count: base/upper 450=1, 600/800=2; tall-single always 1; tall-double always 2; corner=1
  const doors = isTallSingle ? 1
              : isTallDouble ? 2
              : unit.width >= 600 ? 2 : 1;

  const kickH    = isFloor ? KICK_H_MM * pxPerMm : 0;
  const fillerH  = (isTall || isUpper) ? FILLER_H_MM * pxPerMm : 0;
  const topH     = H - kickH;
  const carcassY = fillerH;
  const carcassH = topH - fillerH;
  const countTop = (isBase || isDrawer) ? 38 * pxPerMm : 0;
  const pad      = Math.max(3, W * 0.045);
  const topPad   = carcassY + pad + countTop;
  const bodyH    = topH - topPad - pad;
  const dw       = (W - pad * 2) / doors;
  const rot      = unit.rotation || 0;

  return (
    <svg width={W} height={H} style={{ display:"block", overflow:selected?"visible":"hidden", pointerEvents:"none" }}>
      <defs>
        {isWood && (
          <pattern id={`g${uid}`} patternUnits="userSpaceOnUse" width="8" height="200">
            <rect width="8" height="200" fill={f.color}/>
            <line x1="2" y1="0" x2="2" y2="200" stroke={f.color+"66"} strokeWidth="0.7"/>
            <line x1="5" y1="0" x2="5" y2="200" stroke={f.color+"44"} strokeWidth="1"/>
          </pattern>
        )}
        {isGloss && (
          <linearGradient id={`gs${uid}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.22"/>
            <stop offset="60%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        )}
        {selected && (
          <filter id={`sel${uid}`} x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={C.orange} floodOpacity="1"/>
          </filter>
        )}
      </defs>

      {isCorner ? (
        <>
          <polygon points={cornerPoints(W, topH, rot)}
            fill={isWood ? `url(#g${uid})` : f.color}
            stroke={selected ? C.orange : "#00000044"}
            strokeWidth={selected ? 2.5 : 1}
            filter={selected ? `url(#sel${uid})` : undefined}/>
          {isGloss && <polygon points={cornerPoints(W, topH, rot)} fill={`url(#gs${uid})`}/>}
          <rect x={0} y={topH} width={W} height={kickH} fill="#1A1210" rx={1}/>
          <rect x={4} y={topH+2} width={W-8} height={kickH-4} fill="#222" rx={1}/>
          <text x={W/2} y={topH/2+4} textAnchor="middle" fontSize={Math.max(9, pxPerMm*28)}
            fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{["↖","↗","↘","↙"][rot % 4]}</text>
          <rect x={W/2-22} y={topH-16} width={44} height={13} rx={3} fill="rgba(0,0,0,0.55)"/>
          <text x={W/2} y={topH-6} textAnchor="middle" fontSize={Math.max(7, pxPerMm*30)}
            fill={C.gold} fontFamily="sans-serif">900mm</text>
        </>
      ) : (
        <>
          {/* Carcass body */}
          <rect x={0} y={carcassY} width={W} height={carcassH} rx={1.5}
            fill={isWood ? `url(#g${uid})` : f.color}
            stroke={selected ? C.orange : "#00000044"}
            strokeWidth={selected ? 2.5 : 1}
            filter={selected ? `url(#sel${uid})` : undefined}/>
          {isGloss && <rect x={0} y={carcassY} width={W} height={carcassH} rx={1.5} fill={`url(#gs${uid})`}/>}

          {(isTall || isUpper) && (<>
            <rect x={0} y={0} width={W} height={fillerH} fill="#D8D0C4" rx={1}/>
            <rect x={3} y={2} width={W-6} height={fillerH-4} fill="#CEC0AE" rx={1}/>
            <line x1={0} x2={W} y1={fillerH} y2={fillerH} stroke="#B0A090" strokeWidth={1.5}/>
            <text x={W/2} y={fillerH/2+3} textAnchor="middle" fontSize={Math.max(6,pxPerMm*18)} fill="rgba(80,60,40,0.45)" fontFamily="sans-serif">FILLER</text>
          </>)}

          {/* Countertop on base/drawer — foreignObject so CSS gradients render */}
          {(isBase || isDrawer) && (() => {
            const ctBg = ctColour ? countertopBg(ctColour) : "#CEBFAE";
            return (<>
              <foreignObject x={0} y={0} width={W} height={countTop}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width:"100%", height:"100%", background:ctBg, borderRadius:"2px 2px 0 0" }}/>
              </foreignObject>
              <rect x={0} y={countTop-3} width={W} height={3} fill="rgba(0,0,0,0.2)"/>
            </>);
          })()}

          {/* Kick plate */}
          {isFloor && (<>
            <rect x={0} y={topH} width={W} height={kickH} fill="#1A1210" rx={1}/>
            <rect x={4} y={topH+2} width={W-8} height={kickH-4} fill="#222" rx={1}/>
          </>)}

          {/* Drawer stacks */}
          {isDrawer && (() => {
            const numD = unit.width <= 450 ? 3 : 4;
            const dH   = bodyH / numD;
            return Array.from({length:numD}).map((_,i) => (
              <g key={i}>
                <rect x={pad+2} y={topPad+i*dH+2} width={W-pad*2-4} height={dH-4}
                  fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={1} rx={1}/>
                {hw?.color && <rect x={W/2-18} y={topPad+i*dH+dH*0.44} width={36} height={4} rx={2} fill={hw.color}/>}
              </g>
            ));
          })()}

          {/* Door panels — tall-double gets two stacked doors with a mid-rail */}
          {!isDrawer && (() => {
            if (isTallDouble) {
              // Two stacked doors separated by a mid-rail at 50% body height
              const halfH = bodyH / 2;
              const railY  = topPad + halfH;
              return (<>
                {/* Top door */}
                <rect x={pad+3} y={topPad+3} width={W-pad*2-6} height={halfH-6}
                  fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth={1} rx={1}/>
                {hw?.color && <rect x={W/2-10} y={topPad+halfH*0.5} width={20} height={4} rx={2} fill={hw.color}/>}
                {/* Mid rail */}
                <rect x={0} y={railY-2} width={W} height={4} fill="rgba(0,0,0,0.25)"/>
                {/* Bottom door */}
                <rect x={pad+3} y={railY+3} width={W-pad*2-6} height={halfH-6}
                  fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth={1} rx={1}/>
                {hw?.color && <rect x={W/2-10} y={railY+halfH*0.5} width={20} height={4} rx={2} fill={hw.color}/>}
                {/* Double-door label badge */}
                <rect x={W/2-14} y={topH-28} width={28} height={10} rx={2} fill={C.orange+"44"}/>
                <text x={W/2} y={topH-20} textAnchor="middle" fontSize={Math.max(6, pxPerMm*18)}
                  fill={C.gold} fontFamily="sans-serif">2-door</text>
              </>);
            }
            // Single-door or standard multi-door (base/upper)
            return Array.from({length:doors}).map((_,i) => (
              <g key={i}>
                <rect x={pad+i*dw+3} y={topPad+3} width={dw-6} height={bodyH-6}
                  fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth={1} rx={1}/>
                {hw?.color && <rect x={pad+i*dw+dw/2-10} y={topPad+bodyH*0.5}
                  width={20} height={4} rx={2} fill={hw.color}/>}
              </g>
            ));
          })()}

          {/* Dimension chip */}
          <rect x={W/2-22} y={topH-16} width={44} height={13} rx={3} fill="rgba(0,0,0,0.55)"/>
          <text x={W/2} y={topH-6} textAnchor="middle" fontSize={Math.max(7, pxPerMm*30)}
            fill={C.gold} fontFamily="sans-serif">{unit.width}mm</text>
        </>
      )}
    </svg>
  );
}

// ─── HWH Logo SVG ─────────────────────────────────────────────────────────────
function HWHLogo({ size = 36 }) {
  const r = size / 2;
  const circles = [
    { bg:C.orange, diamond:C.gold,  dot:C.black },
    { bg:C.black,  diamond:C.white, dot:C.orange },
    { bg:C.gold,   diamond:C.orange,dot:C.black },
  ];
  const totalW = size*3 + 4;
  return (
    <svg width={totalW} height={size} viewBox={`0 0 ${totalW} ${size}`}>
      {circles.map((col, i) => {
        const cx = r + i*(size+2), cy = r, d = r*0.58;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={col.bg}/>
            <polygon points={`${cx},${cy-d} ${cx+d},${cy} ${cx},${cy+d} ${cx-d},${cy}`} fill={col.diamond}/>
            <circle cx={cx} cy={cy} r={r*0.2} fill={col.dot}/>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Left Panel: smart panel switches between palette & finish editor ──────────
function LeftPanel({ phase, units, selected, setSelected, setUnits, onClearAll, onPaletteDragStart, onTapAdd, totalFloor, onNext }) {
  const { w: lpW } = useWindowSize();
  const isPhone = lpW < 640;
  const selUnit   = units.find(u => u.id === selected);
  const updateSel = patch => setUnits(p => p.map(u => u.id===selected ? {...u,...patch} : u));
  const applyAll  = patch => setUnits(p => p.map(u => ({...u,...patch})));
  const applyType = patch => setUnits(p => p.map(u => u.type===selUnit?.type ? {...u,...patch} : u));
  const removeSel = ()    => { setUnits(p => p.filter(u => u.id!==selected)); setSelected(null); };

  // Show finish editor if something is selected AND we're in finish phase
  const showFinishes = phase === "finish" && selUnit;
  // Show unit list in finish phase but nothing selected
  const showUnitList = phase === "finish" && !selUnit;

  return (
    <aside style={{ width:220, background:C.panel, display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* Panel header */}
      <div style={{ padding:"10px 14px", fontSize:8, letterSpacing:3, color:C.orange, textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, background:"#EDE6DC", flexShrink:0 }}>
        {showFinishes
          ? (() => {
              const ct = CARCASS_TYPES.find(c=>c.type===selUnit.type&&c.width===selUnit.width);
              const isDrawer = selUnit.type === "drawer";
              return (
                <span>
                  {isDrawer ? "⇒ " : "⬡ "}
                  {ct?.label || selUnit.type} · {selUnit.width}mm
                  <span style={{ color:C.sub, marginLeft:6, fontSize:7 }}>
                    {isDrawer ? `${drawerCount(selUnit)} drawers` : `${hingeCount(selUnit).total} hinges`}
                  </span>
                </span>
              );
            })()
          : showUnitList ? "③ Tap a unit below to edit"
          : "① Add Cabinets"}
      </div>

      <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>

        {/* ── PALETTE (layout phase) ── */}
        {phase === "layout" && (
          <>
            {[
              { label:"Base Units",          types:["base"],       floor:true },
              { label:"Drawer Units",        types:["drawer"],     floor:true },
              { label:"Wall Cabinets",       types:["upper"]       },
              { label:"Tall — Single Door",  types:["tall-single"],floor:true },
              { label:"Tall — Double Door",  types:["tall-double"],floor:true },
              { label:"Corner Units",        types:["corner"],     floor:true },
              { label:"Appliances",          types:["appliance"],  appliance:true },
            ].map(group => {
              const isAppl = !!group.appliance;
              const items = isAppl ? APPLIANCE_TYPES : CARCASS_TYPES.filter(c => group.types.includes(c.type));
              const isFloorGroup = !!group.floor;
              return (
                <div key={group.label}>
                  <div style={{ padding:"8px 12px 4px", fontSize:7, letterSpacing:2, color:C.text, textTransform:"uppercase", borderBottom:`1px solid ${C.border}22` }}>
                    {group.label}
                    {isFloorGroup && <span style={{ color:C.orange+"66", marginLeft:4 }}>+kick</span>}
                    {isAppl && <span style={{ color:"#6090A0", marginLeft:6, fontStyle:"italic" }}>visual only</span>}
                  </div>
                  {items.map(c => (
                    <div key={c.id} draggable onDragStart={e=>onPaletteDragStart(e,c)}
                      style={{ margin:"3px 8px", padding:"8px 10px", background:c.bg, border:`1px solid ${C.border}`, borderRadius:5, cursor:"grab", display:"flex", alignItems:"center", gap:10, userSelect:"none", transition:"border-color 0.1s, transform 0.1s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.transform="translateX(2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}
                    >
                      <span style={{ fontSize:16, color:C.gold, opacity:0.8, flexShrink:0 }}>{c.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.72)" }}>{c.desc}</div>
                      </div>
                      {onTapAdd
                        ? <button onClick={()=>onTapAdd(c)} style={{ background:C.orange, border:"none", borderRadius:4, color:C.white, width:26, height:26, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>＋</button>
                        : <span style={{ fontSize:8, color:C.orange+"99" }}>drag</span>
                      }
                    </div>
                  ))}
                </div>
              );
            })}
            {units.length>0 && (
              <div style={{ margin:"12px 8px 0", paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.sub }}><span style={{color:C.orange, fontWeight:"bold"}}>{units.length}</span> unit{units.length!==1?"s":""} placed</div>
                <div style={{ fontSize:10, color:C.sub, marginTop:3 }}>Floor run: <span style={{color:C.gold}}>{totalFloor}mm</span></div>
                <button onClick={onClearAll} style={{ ...sBtn("transparent","#C55"), marginTop:8, padding:"5px 8px", fontSize:9, width:"100%" }}>Clear All</button>
              </div>
            )}
          </>
        )}

        {/* ── UNIT LIST (finish phase, nothing selected) ── */}
        {showUnitList && (
          <>
            <div style={{ padding:"10px 12px 4px", fontSize:10, color:C.sub }}>
              Select a cabinet to edit its finish:
            </div>
            {units.map(u => {
              const f  = getFinish(u.finish);
              const ct = CARCASS_TYPES.find(c => c.type===u.type && c.width===u.width);
              const isDrawer = u.type === "drawer";
              const hc = hingeCount(u);
              const dc = drawerCount(u);
              return (
                <button key={u.id} onClick={()=>setSelected(u.id)} style={{
                  width:"100%", padding:"9px 10px", border:"none",
                  borderLeft:`3px solid transparent`,
                  background:"transparent", color:"#9A8878",
                  textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:9,
                }}>
                  <div style={{ width:20, height:20, borderRadius:3, flexShrink:0, border:`1px solid ${C.border}`, background:finishBg(u.finish) }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:C.white }}>{ct?.label || u.type} · {u.width}mm</div>
                    <div style={{ fontSize:8, color:C.sub, marginTop:1 }}>
                      {isDrawer
                        ? `${dc} drawers · ${RUNNERS.find(r=>r.id===(u.runner||DEFAULT_RUNNER))?.label}`
                        : `${hc.total} hinges · ${HINGES.find(h=>h.id===(u.hinge||DEFAULT_HINGE))?.label}`
                      }
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {/* ── FINISH EDITOR (finish phase, unit selected) ── */}
        {showFinishes && (
          <div style={{ padding:"10px 12px" }}>

            {/* Unit switcher strip — tap to jump between units */}
            {units.length > 1 && (
              <div style={{ marginBottom:10, display:"flex", gap:4, overflowX:"auto", paddingBottom:2 }}>
                {units.map(u => {
                  const ct       = CARCASS_TYPES.find(c=>c.type===u.type&&c.width===u.width);
                  const isDrawer = u.type === "drawer";
                  const isSel    = selected === u.id;
                  return (
                    <button key={u.id} onClick={()=>setSelected(u.id)} title={`${ct?.label} ${u.width}mm`} style={{
                      flexShrink:0, padding:"4px 8px", borderRadius:12, cursor:"pointer",
                      border: isSel ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                      background: isSel ? C.orange+"22" : "rgba(255,255,255,0.03)",
                      color: isSel ? C.white : "#555",
                      fontSize:9, fontFamily:"inherit", whiteSpace:"nowrap",
                      display:"flex", alignItems:"center", gap:4,
                    }}>
                      <div style={{ width:8, height:8, borderRadius:1, background:finishBg(u.finish), flexShrink:0 }}/>
                      {u.width}
                      <span style={{ fontSize:7, color: isSel ? C.gold : "#444" }}>{isDrawer?"⇒":"⬡"}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Panel sub-header showing unit type clearly */}
            <div style={{ marginBottom:12, padding:"8px 10px", background:"rgba(0,0,0,0.3)", borderRadius:5, border:`1px solid ${C.border}33` }}>
              <div style={{ fontSize:9, color:C.orange, letterSpacing:1.5, textTransform:"uppercase" }}>
                {CARCASS_TYPES.find(c=>c.type===selUnit.type&&c.width===selUnit.width)?.label || selUnit.type}
              </div>
              <div style={{ fontSize:8, color:C.sub, marginTop:2 }}>
                {selUnit.width}mm
                {selUnit.type==="drawer" ? ` · ${drawerCount(selUnit)} drawers · Runners ↓` : ` · ${hingeCount(selUnit).total} hinges · Hinges ↓`}
              </div>
            </div>

            {/* Corner rotation */}
            {selUnit.type === "corner" && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:8, letterSpacing:2, color:C.sub, textTransform:"uppercase", marginBottom:8 }}>Rotation</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                  {CORNER_ROTATIONS.map((label, i) => (
                    <button key={i} onClick={()=>updateSel({rotation:i})} style={{
                      padding:"6px 4px", borderRadius:4, cursor:"pointer", fontSize:10,
                      border:(selUnit.rotation||0)===i?`1.5px solid ${C.orange}`:`1px solid ${C.border}`,
                      background:(selUnit.rotation||0)===i?C.orange+"22":"rgba(255,255,255,0.02)",
                      color:(selUnit.rotation||0)===i?C.white:"#666",
                      fontFamily:"inherit", textAlign:"center",
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ── DRAWERS: Runners first, then handle, then finish ── */}
            {selUnit.type === "drawer" && (() => {
              const dc = drawerCount(selUnit);
              return (<>
                {/* Runners — top of drawer editor */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                    <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase" }}>Drawer Runners</div>
                    <div style={{ fontSize:9, color:C.gold, fontWeight:"bold" }}>{dc} pair{dc!==1?"s":""}</div>
                  </div>
                  {RUNNERS.map(r => {
                    const isSel = (selUnit.runner || DEFAULT_RUNNER) === r.id;
                    return (
                      <button key={r.id} onClick={()=>updateSel({runner:r.id})} style={{
                        width:"100%", marginBottom:6, padding:"10px 12px", borderRadius:5, cursor:"pointer",
                        border: isSel ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
                        background: isSel ? C.orange+"22" : "rgba(255,255,255,0.02)",
                        textAlign:"left", fontFamily:"inherit", transition:"all 0.12s",
                        boxShadow: isSel ? `0 0 0 1px ${C.orange}44` : "none",
                      }}>
                        <div style={{ fontSize:11, color: isSel ? C.white : "#AAA", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontWeight: isSel ? "bold" : "normal" }}>{r.label}</span>
                          <span style={{ fontSize:9, color: isSel ? C.gold : "#555" }}>×{dc} pairs</span>
                        </div>
                        <div style={{ fontSize:9, color: isSel ? C.gold : "#555", marginTop:3 }}>{r.subtitle}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Handle */}
                <div style={{ marginBottom:12, paddingTop:10, borderTop:`1px solid ${C.border}33` }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:C.sub, textTransform:"uppercase", marginBottom:7 }}>Handle / Pull</div>
                  {HARDWARE.map(hw=>(
                    <button key={hw.id} onClick={()=>updateSel({hardware:hw.id})} style={{
                      width:"100%", marginBottom:4, padding:"7px 8px", borderRadius:4, cursor:"pointer",
                      border:selUnit.hardware===hw.id?`1px solid ${C.orange}`:`1px solid ${C.border}`,
                      background:selUnit.hardware===hw.id?C.orange+"18":"rgba(255,255,255,0.02)",
                      color:selUnit.hardware===hw.id?C.white:"#666",
                      textAlign:"left", display:"flex", alignItems:"center", gap:8, fontSize:10, fontFamily:"inherit",
                    }}>
                      {hw.color
                        ? <div style={{width:22,height:5,borderRadius:3,background:hw.color,flexShrink:0}}/>
                        : <div style={{width:22,textAlign:"center",color:C.text,fontSize:13,flexShrink:0}}>—</div>}
                      {hw.label}
                    </button>
                  ))}
                </div>

                {/* Finish swatches (drawer carcass colour) */}
                <div style={{ paddingTop:10, borderTop:`1px solid ${C.border}33` }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:C.sub, textTransform:"uppercase", marginBottom:8 }}>Carcass Finish</div>
                  {["matte","gloss","wood"].map(type => (
                    <div key={type} style={{ marginBottom:10 }}>
                      <div style={{ fontSize:7, letterSpacing:1.5, color:C.text, textTransform:"uppercase", marginBottom:5 }}>
                        {type==="wood"?"Wood Grain":type==="matte"?"Supamatt":"Supagloss"}
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                        {FINISHES.filter(f=>f.type===type).map(f=>(
                          <div key={f.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                            <button onClick={()=>updateSel({finish:f.id})} title={f.label} style={{
                              width:26, height:26, borderRadius:4, cursor:"pointer",
                              border:selUnit.finish===f.id?`2.5px solid ${C.orange}`:`1.5px solid ${C.border}`,
                              boxShadow:selUnit.finish===f.id?`0 0 0 2px ${C.orange}44`:"none",
                              transform:selUnit.finish===f.id?"scale(1.12)":"scale(1)",
                              transition:"all 0.12s", background:finishBg(f.id),
                            }}/>
                            <span style={{ fontSize:6, color:C.sub, textAlign:"center", maxWidth:26, lineHeight:1.2 }}>{f.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>);
            })()}

            {/* ── DOOR UNITS: Finish swatches, handle, then hinges ── */}
            {selUnit.type !== "drawer" && (<>

              {/* Finish swatches */}
              {["matte","gloss","wood"].map(type => (
                <div key={type} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:C.sub, textTransform:"uppercase", marginBottom:7 }}>
                    {type==="wood"?"Wood Grain":type==="matte"?"Supamatt":"Supagloss"}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {FINISHES.filter(f=>f.type===type).map(f=>(
                      <div key={f.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <button onClick={()=>updateSel({finish:f.id})} title={f.label} style={{
                          width:28, height:28, borderRadius:4, cursor:"pointer",
                          border:selUnit.finish===f.id?`2.5px solid ${C.orange}`:`1.5px solid ${C.border}`,
                          boxShadow:selUnit.finish===f.id?`0 0 0 2px ${C.orange}44`:"none",
                          transform:selUnit.finish===f.id?"scale(1.12)":"scale(1)",
                          transition:"all 0.12s", background:finishBg(f.id),
                        }}/>
                        <span style={{ fontSize:7, color:C.sub, textAlign:"center", maxWidth:28, lineHeight:1.2 }}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Handle / Pull */}
              <div style={{ marginBottom:12, paddingTop:4, borderTop:`1px solid ${C.border}22` }}>
                <div style={{ fontSize:8, letterSpacing:2, color:C.sub, textTransform:"uppercase", marginBottom:7 }}>Handle / Pull</div>
                {HARDWARE.map(hw=>(
                  <button key={hw.id} onClick={()=>updateSel({hardware:hw.id})} style={{
                    width:"100%", marginBottom:4, padding:"7px 8px", borderRadius:4, cursor:"pointer",
                    border:selUnit.hardware===hw.id?`1px solid ${C.orange}`:`1px solid ${C.border}`,
                    background:selUnit.hardware===hw.id?C.orange+"18":"rgba(255,255,255,0.02)",
                    color:selUnit.hardware===hw.id?C.white:"#666",
                    textAlign:"left", display:"flex", alignItems:"center", gap:8, fontSize:10, fontFamily:"inherit",
                  }}>
                    {hw.color
                      ? <div style={{width:22,height:5,borderRadius:3,background:hw.color,flexShrink:0}}/>
                      : <div style={{width:22,textAlign:"center",color:C.text,fontSize:13,flexShrink:0}}>—</div>}
                    {hw.label}
                  </button>
                ))}
              </div>

              {/* Hinges */}
              {(() => {
                const hc = hingeCount(selUnit);
                return (
                  <div style={{ paddingTop:10, borderTop:`1px solid ${C.border}33` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                      <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase" }}>Hinges</div>
                      <div style={{ fontSize:9, color:C.gold, fontWeight:"bold" }}>
                        {hc.total} hinge{hc.total!==1?"s":""} · {hc.doors} door{hc.doors!==1?"s":""}
                      </div>
                    </div>
                    {HINGES.map(h => {
                      const isSel = (selUnit.hinge || DEFAULT_HINGE) === h.id;
                      return (
                        <button key={h.id} onClick={()=>updateSel({hinge:h.id})} style={{
                          width:"100%", marginBottom:6, padding:"10px 12px", borderRadius:5, cursor:"pointer",
                          border: isSel ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
                          background: isSel ? C.orange+"22" : "rgba(255,255,255,0.02)",
                          textAlign:"left", fontFamily:"inherit", transition:"all 0.12s",
                          boxShadow: isSel ? `0 0 0 1px ${C.orange}44` : "none",
                        }}>
                          <div style={{ fontSize:11, color: isSel ? C.white : "#AAA", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontWeight: isSel ? "bold" : "normal" }}>{h.label}</span>
                            <span style={{ fontSize:9, color: isSel ? C.gold : "#555" }}>×{hc.total}</span>
                          </div>
                          <div style={{ fontSize:9, color: isSel ? C.gold : "#555", marginTop:3 }}>{h.subtitle}</div>
                        </button>
                      );
                    })}
                    <div style={{ fontSize:8, color:"#3A3028", marginTop:2, lineHeight:1.5 }}>
                      {selUnit.type==="tall-single" ? "1 full-height door · 3 hinges" :
                       selUnit.type==="tall-double" ? "2 stacked doors · 2 hinges each" :
                       `${hc.doors} door${hc.doors>1?"s":""} · 2 hinges each`}
                    </div>
                  </div>
                );
              })()}
            </>)}

            {/* Bulk actions */}
            <div style={{ display:"flex", flexDirection:"column", gap:4, marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
              <button onClick={()=>applyAll({finish:selUnit.finish,hardware:selUnit.hardware,hinge:selUnit.hinge,runner:selUnit.runner})} style={sBtn(C.orange+"18",C.orange)}>Apply to All</button>
              <button onClick={()=>applyType({finish:selUnit.finish,hardware:selUnit.hardware,hinge:selUnit.hinge,runner:selUnit.runner})} style={sBtn("transparent","#777")}>Apply to Same Type</button>
              <button onClick={()=>{ setSelected(null); }} style={sBtn("transparent","#888")}>← Back to List</button>
              <button onClick={removeSel} style={sBtn("transparent","#C55")}>Remove Unit</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom CTA — always visible ── */}
      <div style={{ padding:"10px 10px 10px", borderTop:`1px solid ${C.border}`, background:"#EDE6DC", flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>

        {phase === "layout" && (
          <>
            {units.length > 0 && (
              <button onClick={onNext} style={{
                background:C.orange, color:C.white, border:"none", borderRadius:6,
                width:"100%", padding:"11px 10px", cursor:"pointer",
                fontSize:11, fontWeight:"bold", letterSpacing:1.5,
                textTransform:"uppercase", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                boxShadow:`0 3px 12px ${C.orange}55`,
              }}>
                To Materials <span style={{fontSize:14}}>›</span>
              </button>
            )}
            {units.length === 0 && (
              <div style={{ fontSize:9, color:C.text, textAlign:"center", padding:"6px 0", letterSpacing:1 }}>
                Add cabinets to continue
              </div>
            )}
          </>
        )}

        {phase === "finish" && (
          <>
            <button onClick={onNext} style={{
              background:C.orange, color:C.white, border:"none", borderRadius:6,
              width:"100%", padding:"11px 10px", cursor:"pointer",
              fontSize:11, fontWeight:"bold", letterSpacing:1.5,
              textTransform:"uppercase", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              boxShadow:`0 3px 12px ${C.orange}55`,
            }}>
              Get Quote <span style={{fontSize:14}}>›</span>
            </button>
            {!showFinishes && (
              <div style={{ fontSize:9, color:C.text, textAlign:"center", letterSpacing:1 }}>
                Click a cabinet above to edit its finish
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Materials Panel ──────────────────────────────────────────────────────────
function MaterialsPanel({ materials, setMaterials, onNext, onBack }) {
  const set = patch => setMaterials(m => ({ ...m, ...patch }));

  // When type changes, clear colour if it doesn't belong to new type
  function selectType(id) {
    const currentColour = materials.ctColour;
    const colourStillValid = currentColour &&
      COUNTERTOP_COLOURS.find(c => c.id === currentColour)?.types?.includes(id);
    set({ ctType: id, ctColour: colourStillValid ? currentColour : null });
  }

  // Only show colours relevant to selected type
  const visibleColours = materials.ctType
    ? COUNTERTOP_COLOURS.filter(c => c.types.includes(materials.ctType))
    : COUNTERTOP_COLOURS;

  function CtSwatch({ ct }) {
    const sel = materials.ctColour === ct.id;
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
        <button onClick={() => set({ ctColour: ct.id })} title={ct.label} style={{
          width:50, height:34, borderRadius:5, cursor:"pointer",
          border: sel ? `2.5px solid ${C.orange}` : `1.5px solid ${C.border}`,
          boxShadow: sel ? `0 0 0 2px ${C.orange}44` : "none",
          transform: sel ? "scale(1.1)" : "scale(1)",
          transition:"all 0.12s",
          background: countertopBg(ct),
          flexShrink: 0,
        }}/>
        <span style={{ fontSize:7, color: sel ? C.white : "#666", textAlign:"center", maxWidth:52, lineHeight:1.3 }}>{ct.label}</span>
      </div>
    );
  }

  const ready = materials.ctType && materials.ctColour && materials.carcass;
  const isPremiumTop = ["marble","quartz"].includes(materials.ctType);
  const isPremiumAll = materials.carcass==="solid" && isPremiumTop;
  const isMid        = materials.carcass==="solid" || isPremiumTop;

  return (
    <aside style={{ width:220, background:C.panel, display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"10px 14px", fontSize:8, letterSpacing:3, color:C.orange, textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, background:"#EDE6DC", flexShrink:0 }}>
        ② Materials · <span style={{ color:C.sub }}>preview live on wall</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"12px 12px" }}>

        {/* ── Countertop type ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, letterSpacing:2, color:"#9A8878", textTransform:"uppercase", marginBottom:8 }}>Countertop Type</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {COUNTERTOP_TYPES.map(t => {
              const sel = materials.ctType === t.id;
              return (
                <button key={t.id} onClick={() => selectType(t.id)} style={{
                  padding:"9px 11px", borderRadius:5, cursor:"pointer", textAlign:"left",
                  border: sel ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                  background: sel ? C.orange+"20" : "rgba(255,255,255,0.02)",
                  fontFamily:"inherit", transition:"all 0.12s",
                }}>
                  <div style={{ fontSize:11, color: sel ? C.white : "#AAA", fontWeight: sel ? "bold" : "normal" }}>{t.label}</div>
                  <div style={{ fontSize:8, color: sel ? C.gold : "#555", marginTop:2 }}>{t.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Countertop colour — filtered by type ── */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:8, letterSpacing:2, color:"#9A8878", textTransform:"uppercase", marginBottom:8 }}>
            Countertop Colour
            {!materials.ctType && <span style={{ color:C.text, marginLeft:6 }}>— pick type first</span>}
          </div>
          {materials.ctType ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {visibleColours.map(ct => <CtSwatch key={ct.id} ct={ct}/>)}
            </div>
          ) : (
            <div style={{ fontSize:9, color:C.text, fontStyle:"italic" }}>Select a countertop type above to see colour options.</div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:C.border, margin:"4px 0 14px" }}/>

        {/* ── Carcass material ── */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:8, letterSpacing:2, color:"#9A8878", textTransform:"uppercase", marginBottom:8 }}>Carcass Build</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {CARCASS_TYPES_MATERIAL.map(t => {
              const sel = materials.carcass === t.id;
              return (
                <button key={t.id} onClick={() => set({ carcass: t.id })} style={{
                  padding:"9px 11px", borderRadius:5, cursor:"pointer", textAlign:"left",
                  border: sel ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                  background: sel ? C.orange+"20" : "rgba(255,255,255,0.02)",
                  fontFamily:"inherit", transition:"all 0.12s",
                }}>
                  <div style={{ fontSize:11, color: sel ? C.white : "#AAA", fontWeight: sel ? "bold" : "normal" }}>{t.label}</div>
                  <div style={{ fontSize:8, color: sel ? C.gold : "#555", marginTop:2 }}>{t.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing tier */}
        {materials.carcass && materials.ctType && (
          <div style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 11px" }}>
            <div style={{ fontSize:7, letterSpacing:2, color:C.gold, textTransform:"uppercase", marginBottom:5 }}>Pricing Tier</div>
            <div style={{ fontSize:10, color:"#A89888" }}>
              {isPremiumAll
                ? <span style={{color:C.orange}}>★ Premium — solid carcass + {materials.ctType} top</span>
                : isMid
                ? <span style={{color:C.gold}}>◆ Mid-range — one premium element</span>
                : <span style={{color:"#9A8878"}}>● Standard — melamine throughout</span>
              }
            </div>
            <div style={{ fontSize:8, color:C.sub, marginTop:4 }}>Final pricing confirmed on quote.</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ padding:"10px 10px 10px", borderTop:`1px solid ${C.border}`, background:"#EDE6DC", flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        <button onClick={onNext} disabled={!ready} style={{
          background: ready ? C.orange : C.border,
          color: ready ? C.white : "#444",
          border:"none", borderRadius:6, width:"100%", padding:"11px 10px",
          cursor: ready ? "pointer" : "not-allowed",
          fontSize:11, fontWeight:"bold", letterSpacing:1.5, textTransform:"uppercase",
          fontFamily:"inherit",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          boxShadow: ready ? `0 3px 12px ${C.orange}55` : "none",
          transition:"all 0.15s",
        }}>
          To Finishes <span style={{fontSize:14}}>›</span>
        </button>
        {!ready && (
          <div style={{ fontSize:9, color:C.text, textAlign:"center", letterSpacing:1 }}>
            Complete all selections above
          </div>
        )}
        <button onClick={onBack} style={{
          background:"transparent", color:C.sub, border:`1px solid ${C.border}44`,
          borderRadius:5, width:"100%", padding:"7px 8px", cursor:"pointer",
          fontSize:9, letterSpacing:1, textTransform:"uppercase", fontFamily:"inherit",
        }}>← Back to Layout</button>
      </div>
    </aside>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ phase, setPhase }) {
  const steps = [
    ["layout",   "01", "Layout"],
    ["materials","02", "Materials"],
    ["finish",   "03", "Finishes"],
  ];
  const order = steps.map(s => s[0]);
  const cur   = order.indexOf(phase);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0 }}>
      {steps.map(([p, num, lbl], i) => {
        const active = phase === p;
        const done   = order.indexOf(p) < cur;
        return (
          <div key={p} style={{ display:"flex", alignItems:"center" }}>
            <button onClick={() => setPhase(p)} style={{
              display:"flex", alignItems:"center", gap:7, padding:"7px 13px",
              background: active ? C.orange : done ? C.border : "transparent",
              border: active ? "none" : `1px solid ${C.border}`,
              borderRadius:5, cursor:"pointer",
              color: active ? C.white : done ? C.orange : C.sub,
              fontFamily:"inherit", fontSize:10, letterSpacing:1.2, textTransform:"uppercase",
            }}>
              <span style={{
                width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                background: active ? C.white : done ? C.orange+"33" : C.border,
                color: active ? C.orange : done ? C.orange : C.sub,
                fontSize:8, fontWeight:"bold", flexShrink:0,
              }}>{done ? "✓" : num}</span>
              {lbl}
            </button>
            {i < steps.length-1 && <div style={{ width:16, height:1, background:C.border, margin:"0 2px" }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,    setPhase]    = useState("landing");
  const [units,    setUnits]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [drag,     setDrag]     = useState(null);
  const [zoom,     setZoom]     = useState(1);
  const [roomW,    setRoomW]    = useState(4200);
  const [materials, setMaterials] = useState({ ctType: null, ctColour: null, carcass: null });
  const [showQuote,  setShowQuote]  = useState(false);

  // Live job total — recalculates whenever units or materials change
  const jobTotal = (units.length > 0 && materials.ctColour && materials.carcass)
    ? calcJobTotal(units, materials)
    : null;
  const [quoteSent,  setQuoteSent]  = useState(false);
  const [quoteSending, setQuoteSending] = useState(false);
  const [quoteError,   setQuoteError]   = useState("");
  const [cName,   setCName]   = useState("");
  const [cEmail,  setCEmail]  = useState("");
  const [cPhone,  setCPhone]  = useState("");

  const canvasRef = useRef(null);
  const wrapRef    = useRef(null);
  const idRef     = useRef(1);
  const [canvasW, setCanvasW] = useState(800); // actual rendered canvas px width

  // Measure canvas width whenever window or panel changes
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width;
      if (w && w > 10) setCanvasW(w);
    });
    ro.observe(el);
    setCanvasW(el.getBoundingClientRect().width || 800);
    return () => ro.disconnect();
  }, []);

  const { w: winW, h: winH } = useWindowSize();
  const isPhone  = winW < 640;
  const isTablet = winW >= 640 && winW < 1024;
  const isMobile = winW < 1024;  // phone or tablet

  // Panel is hidden on phone (shown as bottom sheet instead) or shown as sidebar on tablet+
  const PANEL_W  = isMobile ? 0 : 210;

  // Canvas fills available width minus panel, minus padding
  const canvasPad = isPhone ? 8 : 16;

  // Mobile: left panel slides up from bottom as a drawer
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const pxPerMm     = (canvasW / roomW) * zoom;
  const scaledW     = roomW     * pxPerMm;
  const scaledH     = WALL_H_MM * pxPerMm;
  const FLOOR_Y     = scaledH - 60*pxPerMm;

  function unitTop(unit) {
    if (unit.type === "upper") return FLOOR_Y - TALL_H_MM*pxPerMm;
    return FLOOR_Y - unit.height*pxPerMm;
  }

  function paletteDragStart(e, c) {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("cid", c.id);
  }
  function canvasDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }
  function canvasDrop(e) {
    e.preventDefault();
    const cid = e.dataTransfer.getData("cid");
    const c   = CARCASS_TYPES.find(x => x.id===cid) || APPLIANCE_TYPES.find(x => x.id===cid);
    if (!c) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const xPx   = e.clientX - rect.left + e.currentTarget.scrollLeft;
    const xSnap = Math.max(0, Math.min(snapMm(xPx/pxPerMm - c.width/2), roomW-c.width));
    const inheritFinish = units.length > 0 ? units[units.length-1].finish : DEFAULT_FINISH;
    const inheritHW     = units.length > 0 ? units[units.length-1].hardware : DEFAULT_HW;
    const nu = { id:idRef.current++, type:c.type, width:c.width, height:c.height, xMm:xSnap, finish:inheritFinish, hardware:inheritHW, hinge:DEFAULT_HINGE, runner:DEFAULT_RUNNER, rotation:0, ...(c.type==="appliance"?{appId:c.id}:{}) };
    setUnits(p => [...p, nu]);
    setSelected(nu.id);
  }

  function unitPointerDown(e, unit) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(unit.id);
    const rect = canvasRef.current.getBoundingClientRect();
    const xPx  = e.clientX - rect.left + canvasRef.current.scrollLeft;
    setDrag({ unitId:unit.id, offsetMm: xPx/pxPerMm - unit.xMm });
  }
  function canvasPtrMove(e) {
    if (!drag) return;
    const rect  = canvasRef.current.getBoundingClientRect();
    const xPx   = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const unit  = units.find(u => u.id===drag.unitId);
    if (!unit) return;
    setUnits(p => p.map(u => u.id===drag.unitId
      ? {...u, xMm: Math.max(0, Math.min(snapMm(xPx/pxPerMm - drag.offsetMm), roomW-u.width))}
      : u));
  }
  function canvasPtrUp() { setDrag(null); }

  useEffect(() => {
    const fn = e => {
      if ((e.key==="Delete"||e.key==="Backspace") && selected) {
        setUnits(p => p.filter(u => u.id!==selected));
        setSelected(null);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [selected]);

  function tapAdd(c) {
    // Place at a sensible default x position (spaced from existing units of same row)
    const existing = units.filter(u => u.type === c.type);
    const lastX    = existing.length > 0 ? Math.max(...existing.map(u => u.xMm + u.width)) : 0;
    const xSnap    = Math.min(snapMm(lastX), roomW - c.width);
    const nu = { id:idRef.current++, type:c.type, width:c.width, height:c.height, xMm:xSnap, finish:DEFAULT_FINISH, hardware:DEFAULT_HW, hinge:DEFAULT_HINGE, runner:DEFAULT_RUNNER, rotation:0, ...(c.type==="appliance"?{appId:c.id}:{}) };
    setUnits(p => [...p, nu]);
    setSelected(nu.id);
  }

  // Layout → Materials
  function goToMaterials() {
    setPhase("materials");
    setSelected(null);
  }
  // Materials → Finishes
  function goToFinish() {
    setPhase("finish");
    if (units.length > 0) setSelected(units[0].id);
  }

  const totalFloor      = units.filter(u=>u.type!=="appliance").reduce((s,u) =>
    ["base","drawer","tall-single","tall-double","corner"].includes(u.type) ? s+u.width : s, 0);
  const totalWall       = units.filter(u=>u.type!=="appliance").reduce((s,u) =>
    u.type === "upper" ? s+u.width : s, 0);
  const totalCtRun      = units.filter(u=>u.type!=="appliance").reduce((s,u) =>
    ["base","drawer","corner"].includes(u.type) ? s+u.width : s, 0);
  const totalFillerRun  = units.filter(u=>u.type!=="appliance").reduce((s,u) =>
    ["tall-single","tall-double","upper"].includes(u.type) ? s+u.width : s, 0);
  const matCtType   = COUNTERTOP_TYPES.find(t => t.id === materials.ctType);
  const matCtColour = COUNTERTOP_COLOURS.find(t => t.id === materials.ctColour);
  const matCarcass  = CARCASS_TYPES_MATERIAL.find(t => t.id === materials.carcass);

  // Build enriched BOM with fittings
  const bom = units.filter(u => u.type !== "appliance").map(u => {
    const ct   = CARCASS_TYPES.find(c => c.type===u.type && c.width===u.width);
    const hc   = hingeCount(u);
    const dc   = drawerCount(u);
    const hingeLabel  = HINGES.find(h=>h.id===(u.hinge||DEFAULT_HINGE))?.label || "";
    const runnerLabel = RUNNERS.find(r=>r.id===(u.runner||DEFAULT_RUNNER))?.label || "";
    return {
      label:       ct?.label || u.type,
      width:       u.width,
      finish:      getFinish(u.finish).label,
      hw:          HARDWARE.find(h=>h.id===u.hardware)?.label,
      rot:         u.type==="corner" ? CORNER_ROTATIONS[u.rotation||0] : null,
      hinges:      hc.total,
      hingeLabel,
      drawers:     dc,
      runnerLabel,
      hasDoors:    hc.total > 0,
      hasDrawers:  dc > 0,
    };
  });

  // Fitting totals for quote summary
  const totalHingesStd  = bom.filter(b=>b.hingeLabel.includes("Standard")).reduce((s,b)=>s+b.hinges,0);
  const totalHingesSoft = bom.filter(b=>b.hingeLabel.includes("Soft")).reduce((s,b)=>s+b.hinges,0);
  const totalHinges     = totalHingesStd + totalHingesSoft;
  const totalRunnersStd  = bom.filter(b=>b.runnerLabel.includes("Standard")).reduce((s,b)=>s+b.drawers,0);
  const totalRunnersSoft = bom.filter(b=>b.runnerLabel.includes("Soft")).reduce((s,b)=>s+b.drawers,0);
  const totalRunners     = totalRunnersStd + totalRunnersSoft;

  const clampZoom = v => setZoom(Math.min(3, Math.max(0.5, +v.toFixed(2))));
  // ── Build plain-text quote summary (used for email body + WhatsApp) ─────────
  function buildQuoteSummary() {
    const lines = [];
    lines.push("HWH DESIGNS — QUOTE REQUEST");
    lines.push("============================");
    lines.push(`Client:  ${cName}`);
    lines.push(`Email:   ${cEmail}`);
    lines.push(`Phone:   ${cPhone || "—"}`);
    lines.push("");
    lines.push("CABINET LAYOUT");
    lines.push("--------------");
    bom.forEach((item, i) => {
      let line = `${i+1}. ${item.label} ${item.width}mm — ${item.finish}`;
      if (item.rot)        line += ` (${item.rot})`;
      if (item.hasDoors)   line += ` | ${item.hinges}× ${item.hingeLabel}`;
      if (item.hasDrawers) line += ` | ${item.drawers} pairs ${item.runnerLabel}`;
      lines.push(line);
    });
    lines.push("");
    lines.push(`Floor run:           ${(totalFloor/1000).toFixed(2)}m`);
    if (totalWall > 0)      lines.push(`Wall cabinet run:    ${(totalWall/1000).toFixed(2)}m`);
    if (totalCtRun > 0)     lines.push(`Countertop run:      ${(totalCtRun/1000).toFixed(2)}m`);
    if (totalFillerRun > 0) lines.push(`Filler strip run:    ${(totalFillerRun/1000).toFixed(2)}m`);
    lines.push("");
    if (matCarcass || matCtType || matCtColour) {
      lines.push("MATERIALS");
      lines.push("---------");
      if (matCarcass)  lines.push(`Carcass build:     ${matCarcass.label}`);
      if (matCtType)   lines.push(`Countertop type:   ${matCtType.label}`);
      if (matCtColour) lines.push(`Countertop colour: ${matCtColour.label}`);
      if (totalCtRun > 0) lines.push(`Countertop run:    ${(totalCtRun/1000).toFixed(2)}m`);
      lines.push("");
    }
    if (totalHinges > 0 || totalRunners > 0) {
      lines.push("FITTINGS SUMMARY");
      lines.push("----------------");
      if (totalHingesStd)   lines.push(`Standard Hinges:         x ${totalHingesStd}`);
      if (totalHingesSoft)  lines.push(`Soft-Close Hinges:       x ${totalHingesSoft}`);
      if (totalHinges)      lines.push(`Total Hinges:            x ${totalHinges}`);
      if (totalRunnersStd)  lines.push(`Standard Runner Pairs:   x ${totalRunnersStd}`);
      if (totalRunnersSoft) lines.push(`Soft-Close Runner Pairs: x ${totalRunnersSoft}`);
      if (totalRunners)     lines.push(`Total Runner Pairs:      x ${totalRunners}`);
    }
    if (jobTotal !== null) {
      lines.push("");
      lines.push("ESTIMATED TOTAL");
      lines.push("---------------");
      lines.push(`R ${jobTotal.toLocaleString("en-ZA")} (excl. VAT)`);
      lines.push("Labour & installation quoted separately.");
    }
    return lines.join("\n");
  }

  // ── Submit: EmailJS email + pre-filled WhatsApp notification ─────────────────
  async function handleSubmitQuote() {
    setQuoteError("");
    setQuoteSending(true);
    const summary = buildQuoteSummary();

    // EmailJS send — configure Service ID + Template ID in emailjs.com dashboard
    // Template variables: to_email, client_name, client_email,
    //   client_phone, quote_summary, units_count, floor_run
    try {
      await window.emailjs.send(
        "YOUR_SERVICE_ID",   // <- replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID",  // <- replace with your EmailJS Template ID
        {
          to_email:      "kim@hwhdesigns.co.za",
          client_name:   cName,
          client_email:  cEmail,
          client_phone:  cPhone || "—",
          quote_summary: summary,
          units_count:   String(bom.length),
          floor_run:     `${totalFloor}mm (${(totalFloor/1000).toFixed(2)}m)`,
        }
      );
    } catch (err) {
      console.error("EmailJS error:", err);
      setQuoteError("Email delivery failed — please try again or contact us directly.");
      setQuoteSending(false);
      return;
    }

    // WhatsApp deep link — opens WhatsApp with pre-filled message, user taps Send
    const waLines = [
      "Hi Kim! I just submitted a quote via the HWH Designs configurator.",
      "",
      `*Client:* ${cName}`,
      `*Email:* ${cEmail}`,
      `*Phone:* ${cPhone || "—"}`,
      "",
      `*${bom.length} unit${bom.length!==1?"s":""} | ${(totalFloor/1000).toFixed(2)}m floor run*`,
      "",
      "Full spec emailed to kim@hwhdesigns.co.za"
    ].join("\n");
    window.open("https://wa.me/27828899787?text=" + encodeURIComponent(waLines), "_blank");

    setQuoteSending(false);
    setQuoteSent(true);
    setTimeout(() => {
      setShowQuote(false);
      setQuoteSent(false);
      setCName(""); setCEmail(""); setCPhone("");
    }, 4000);
  }

  if (phase === "landing") return <LandingPage onStart={() => setPhase("layout")}/>;

  return (
    <div style={{ height:"100vh", background:C.darkbg, fontFamily:"'Trebuchet MS',sans-serif", color:C.text, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── Header ── */}
      <header style={{ padding:`0 ${isPhone?10:20}px`, borderBottom:`3px solid ${C.orange}`, background:C.black, display:"flex", alignItems:"center", gap:isPhone?8:16, height:isPhone?50:58, flexShrink:0 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:"auto" }}>
          <HWHLogo size={isPhone?24:32}/>
          <div style={{ borderLeft:`2px solid ${C.orange}55`, paddingLeft:10 }}>
            <div style={{ fontSize:isPhone?12:14, fontWeight:"bold", letterSpacing:2, color:C.white, textTransform:"uppercase", lineHeight:1 }}>HWH</div>
            <div style={{ fontSize:isPhone?8:10, letterSpacing:3, color:C.gold, textTransform:"uppercase" }}>Designs</div>
          </div>
          {!isPhone && (
            <div style={{ borderLeft:`1px solid ${C.border}`, paddingLeft:12, marginLeft:2 }}>
              <div style={{ fontSize:9, letterSpacing:3, color:C.sub, textTransform:"uppercase" }}>Built-in</div>
              <div style={{ fontSize:11, letterSpacing:2, color:"#9A8878", textTransform:"uppercase" }}>Configurator</div>
            </div>
          )}
        </div>

        {/* Step indicator — icon-only on phone */}
        {isPhone ? (
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {[["layout","1"],["materials","2"],["finish","3"]].map(([p,n],i,arr) => {
              const order = arr.map(a=>a[0]);
              const cur   = order.indexOf(phase);
              const done  = order.indexOf(p) < cur;
              const active= phase===p;
              return (
                <div key={p} style={{ display:"flex", alignItems:"center" }}>
                  <button onClick={()=>setPhase(p)} style={{
                    width:24, height:24, borderRadius:"50%", border:"none", cursor:"pointer",
                    background: active ? C.orange : done ? C.orange+"33" : C.border,
                    color: active ? C.white : done ? C.orange : C.sub,
                    fontSize:9, fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center",
                  }}>{done?"✓":n}</button>
                  {i<arr.length-1 && <div style={{width:10,height:1,background:C.border}}/>}
                </div>
              );
            })}
          </div>
        ) : (
          <StepIndicator phase={phase} setPhase={setPhase}/>
        )}

        {/* Controls */}
        <div style={{ display:"flex", gap:isPhone?6:8, alignItems:"center" }}>
          {/* Room selector — hidden on phone to save space */}
          {!isPhone && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:9, color:C.sub, letterSpacing:1, textTransform:"uppercase" }}>Room</span>
              <select value={roomW} onChange={e=>setRoomW(+e.target.value)} style={{ background:C.panel, border:`1px solid ${C.border}`, color:C.text, padding:"4px 7px", borderRadius:4, fontSize:11, fontFamily:"inherit" }}>
                {[2400,3000,3600,4200,4800,5400,6000,6600,7200,7800,8400,9000,9600,10200,10800,11400,12000].map(w =>
                  <option key={w} value={w}>{(w/1000).toFixed(1)}m</option>)}
              </select>
            </div>
          )}

          {/* Zoom */}
          <div style={{ display:"flex", alignItems:"center", gap:2, background:C.panel, borderRadius:5, padding:"3px 6px", border:`1px solid ${C.border}` }}>
            <button onClick={()=>clampZoom(zoom-0.25)} style={ZB}>−</button>
            {!isPhone && <span style={{ fontSize:10, color:"#9A8878", minWidth:28, textAlign:"center" }}>{Math.round(zoom*100)}%</span>}
            <button onClick={()=>clampZoom(zoom+0.25)} style={ZB}>+</button>
            <button onClick={()=>clampZoom(1)} style={{ ...ZB, fontSize:8, color:C.sub, borderLeft:`1px solid ${C.border}`, paddingLeft:5, marginLeft:2 }}>FIT</button>
          </div>

          {/* Quote */}
          <button onClick={()=>setShowQuote(true)} style={{ background:C.orange, color:C.white, border:"none", borderRadius:5, padding:isPhone?"7px 10px":"8px 16px", cursor:"pointer", fontSize:isPhone?10:11, fontWeight:"bold", letterSpacing:1, textTransform:"uppercase", fontFamily:"inherit", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
            {isPhone ? "Quote" : "Get Quote"}
            {jobTotal !== null && <span style={{ background:"rgba(0,0,0,0.25)", borderRadius:3, padding:"2px 6px", fontSize:isPhone?9:10, fontWeight:"bold", letterSpacing:0 }}>R {jobTotal.toLocaleString("en-ZA")}</span>}
          </button>
        </div>
      </header>

      {/* ── Phone: room selector row below header ── */}
      {isPhone && (
        <div style={{ background:"#EDE6DC", borderBottom:`1px solid ${C.border}`, padding:"6px 10px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <span style={{ fontSize:9, color:C.sub, letterSpacing:1, textTransform:"uppercase" }}>Room width</span>
          <select value={roomW} onChange={e=>setRoomW(+e.target.value)} style={{ background:C.panel, border:`1px solid ${C.border}`, color:C.text, padding:"4px 8px", borderRadius:4, fontSize:11, fontFamily:"inherit", flex:1 }}>
            {[2400,3000,3600,4200,4800,5400,6000,6600,7200,7800,8400,9000,9600,10200,10800,11400,12000].map(w =>
              <option key={w} value={w}>{(w/1000).toFixed(1)}m</option>)}
          </select>
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ══ Collapsible sidebar — always present on desktop ══ */}
        {!isMobile && (
          <div style={{
            position:"relative", flexShrink:0,
            width: panelHidden ? 0 : 220,
            transition:"width 0.22s cubic-bezier(.4,0,0.2,1)",
            overflow:"visible",
          }}>
            {/* Panel body */}
            <div style={{
              position:"absolute", top:0, left:0, bottom:0,
              width:220, background:C.panel,
              borderRight:`1px solid ${C.border}`,
              display:"flex", flexDirection:"column",
              transform: panelHidden ? "translateX(-220px)" : "translateX(0)",
              transition:"transform 0.22s cubic-bezier(.4,0,0.2,1)",
              overflow:"hidden",
              zIndex:10,
            }}>
              {/* Phase-specific content */}
              {phase === "layout" && (
                <LeftPanel
                  phase={phase} units={units} selected={selected}
                  setSelected={setSelected} setUnits={setUnits}
                  onClearAll={()=>{setUnits([]);setSelected(null);}}
                  onPaletteDragStart={paletteDragStart}
                  totalFloor={totalFloor}
                  onNext={goToMaterials}
                />
              )}
              {phase === "materials" && (
                <MaterialsPanel
                  materials={materials} setMaterials={setMaterials}
                  onNext={goToFinish} onBack={()=>setPhase("layout")}
                />
              )}
              {phase === "finish" && (
                <LeftPanel
                  phase={phase} units={units} selected={selected}
                  setSelected={setSelected} setUnits={setUnits}
                  onClearAll={()=>{setUnits([]);setSelected(null);}}
                  onPaletteDragStart={paletteDragStart}
                  totalFloor={totalFloor}
                  onNext={()=>setShowQuote(true)}
                />
              )}
            </div>

            {/* ── Hide/Show tab — sits on the right edge of the sidebar ── */}
            <button
              onClick={()=>setPanelHidden(h=>!h)}
              title={panelHidden ? "Show panel" : "Hide panel"}
              style={{
                position:"absolute",
                top:"50%", right:0,
                transform:"translateY(-50%) translateX(100%)",
                background:C.black,
                border:`1px solid ${C.border}`,
                borderLeft:"none",
                borderRadius:"0 6px 6px 0",
                color: panelHidden ? C.orange : "#666",
                cursor:"pointer",
                padding:"14px 5px",
                zIndex:20,
                display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                writingMode:"vertical-rl",
                fontSize:8, letterSpacing:1.5, textTransform:"uppercase",
                fontFamily:"inherit",
                transition:"color 0.15s",
              }}
              onMouseEnter={e=>e.currentTarget.style.color=C.orange}
              onMouseLeave={e=>e.currentTarget.style.color=panelHidden?C.orange:"#666"}
            >
              {panelHidden ? "▶ Show" : "◀ Hide"}
            </button>
          </div>
        )}

          {/* ── Canvas ── */}
          <main ref={wrapRef} style={{ flex:1, background:C.darkbg, display:"flex", flexDirection:"column", padding:`${canvasPad}px`, paddingBottom:isMobile?`calc(${canvasPad}px + 58px)`:`${canvasPad}px`, overflow:"hidden", minWidth:0 }}>
            <div style={{ fontSize:8, color: phase==="layout"?"#3A2E28":C.orange+"55", marginBottom:6, letterSpacing:1.5, textTransform:"uppercase", textAlign:"center" }}>
              {phase==="layout"
                ? isMobile ? "Tap ＋ panel · tap to place · drag to move" : "Drag units from the panel · drop on wall · drag to reposition · Delete to remove"
                : phase==="materials"
                ? "Adjust materials in the panel — changes preview live on the wall"
                : "Select a cabinet in the panel — finish changes preview live on the wall"}
            </div>

            <div style={{ width:"100%", height:3, background:`linear-gradient(90deg,${C.orange},${C.gold})`, borderRadius:"2px 2px 0 0", flexShrink:0 }}/>

            <div ref={canvasRef}
              onDrop={canvasDrop} onDragOver={canvasDragOver}
              onPointerMove={canvasPtrMove} onPointerUp={canvasPtrUp}
              onClick={()=>setSelected(null)}
              style={{
                width:"100%", flex:1, overflow:"auto",
                border:`1px solid ${C.border}`, borderTop:"none",
                background:"#DDD6CC",
                cursor:drag?"grabbing":"default",
                boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
              }}
            >
              <div style={{ position:"relative", width:scaledW, height:scaledH, background:"linear-gradient(180deg,#EAE4DC 0%,#E4DDD4 50%,#DDD6CC 100%)" }}>
                {Array.from({length:Math.ceil(roomW/200)+1}).map((_,i)=>(
                  <div key={i} style={{ position:"absolute", left:i*200*pxPerMm, top:0, height:"100%", width:1,
                    background:i%5===0?"rgba(160,90,40,0.25)":"rgba(44,33,26,0.06)", pointerEvents:"none" }}/>
                ))}
                <div style={{ position:"absolute", left:0, right:0, bottom:0, height:60*pxPerMm,
                  background:"rgba(150,130,110,0.18)", borderTop:"2px solid rgba(160,90,40,0.35)", pointerEvents:"none" }}/>
                {Array.from({length:Math.floor(roomW/600)+1}).map((_,i)=>(
                  <div key={i} style={{ position:"absolute", left:i*600*pxPerMm, bottom:52*pxPerMm, pointerEvents:"none" }}>
                    <div style={{ width:1, height:6, background:"rgba(140,80,30,0.45)" }}/>
                    {i>0 && <div style={{ fontSize:8, color:"rgba(70,48,32,0.8)", marginTop:1, whiteSpace:"nowrap" }}>{i*600}mm</div>}
                  </div>
                ))}
                <div style={{ position:"absolute", top:7, left:10, fontSize:8, color:"rgba(70,48,32,0.55)", letterSpacing:2, textTransform:"uppercase", pointerEvents:"none" }}>
                  {(roomW/1000).toFixed(1)}m × {(WALL_H_MM/1000).toFixed(1)}m
                </div>
                {units.length===0 && (
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, pointerEvents:"none" }}>
                    <HWHLogo size={isPhone?30:44}/>
                    <div style={{ fontSize:isPhone?9:11, color:"rgba(44,33,26,0.12)", letterSpacing:2, textTransform:"uppercase", marginTop:4, textAlign:"center" }}>
                      {isMobile ? "Tap + below to add cabinets" : "Drag cabinets onto the wall"}
                    </div>
                  </div>
                )}
                {units.map(unit => (
                  <div key={unit.id}
                    onPointerDown={e=>unitPointerDown(e,unit)}
                    style={{ position:"absolute", left:unit.xMm*pxPerMm, top:unitTop(unit), width:unit.width*pxPerMm, height:unit.height*pxPerMm, cursor:drag?.unitId===unit.id?"grabbing":"grab", zIndex:selected===unit.id?20:5, touchAction:"none" }}
                  >
                    {unit.type==="appliance"
                      ? <ApplianceSVG unit={unit} pxPerMm={pxPerMm} selected={selected===unit.id}/>
                      : <CabinetSVG unit={unit} pxPerMm={pxPerMm} selected={selected===unit.id} ctColour={matCtColour}/>}
                    {selected===unit.id && unit.type==="corner" && (
                      <button
                        onPointerDown={e=>e.stopPropagation()}
                        onClick={e=>{ e.stopPropagation(); setUnits(p=>p.map(u=>u.id===unit.id?{...u,rotation:((u.rotation||0)+1)%4}:u)); }}
                        title="Rotate 90°"
                        style={{ position:"absolute", top:4, right:4, background:C.orange, color:C.white, border:"none", borderRadius:4, width:26, height:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:"bold", boxShadow:"0 2px 6px rgba(0,0,0,0.5)", zIndex:30 }}
                      >↻</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width:"100%", height:2, background:`linear-gradient(90deg,${C.gold},${C.orange})`, borderRadius:"0 0 2px 2px", flexShrink:0 }}/>

            {/* Mobile: open panel button */}
            {isMobile && (
              <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:90, display:"flex", flexShrink:0, boxShadow:"0 -2px 16px rgba(44,33,26,0.12)", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
                <div style={{ display:"flex", alignItems:"stretch", background:C.panel, borderTop:`1px solid ${C.border}`, flex:1, minWidth:0 }}>
                  {[["layout","①"],["materials","②"],["finish","③"]].map(([p,num])=>(
                    <button key={p} onClick={()=>setPhase(p)} style={{ flex:1, padding:"12px 4px", border:"none", borderRight:`1px solid ${C.border}`, background:phase===p?C.orange+"18":"transparent", color:phase===p?C.orange:C.sub, fontSize:11, fontWeight:"bold", fontFamily:"inherit", cursor:"pointer" }}>{num}</button>
                  ))}
                </div>
                <button onClick={()=>setPanelOpen(true)} style={{ background:C.orange, color:C.white, border:"none", padding:"12px 20px", cursor:"pointer", fontSize:12, fontWeight:"bold", letterSpacing:1, textTransform:"uppercase", fontFamily:"inherit", minWidth:130, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  {phase==="layout"?"＋ Cabinets":phase==="materials"?"⚙ Materials":"🎨 Finishes"}
                </button>
              </div>
            )}
          </main>

        {/* ── Mobile bottom sheet panel ── */}
        {isMobile && panelOpen && (
          <>
            {/* Backdrop */}
            <div onClick={()=>setPanelOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:100 }}/>
            {/* Sheet */}
            <div style={{
              position:"fixed", left:0, right:0, bottom:0,
              background:C.panel, borderTop:`3px solid ${C.orange}`,
              borderRadius:"16px 16px 0 0",
              zIndex:101, maxHeight:"82vh", display:"flex", flexDirection:"column",
              boxShadow:"0 -8px 40px rgba(0,0,0,0.7)",
            }}>
              {/* Sheet handle + header */}
              <div style={{ padding:"12px 16px 8px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
                {/* Drag handle */}
                <div style={{ width:40, height:4, borderRadius:2, background:C.border, margin:"0 auto 10px" }}/>

                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:11, letterSpacing:2, color:C.orange, textTransform:"uppercase" }}>
                    {phase==="layout" ? "① Add Cabinets" : phase==="materials" ? "② Materials" : "③ Finishes"}
                  </div>
                  <button onClick={()=>setPanelOpen(false)} style={{ marginLeft:"auto", background:"none", border:"none", color:C.sub, fontSize:20, cursor:"pointer", padding:"8px 12px", minWidth:44, minHeight:44, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>

                {/* ── Unit switcher — only shown in finish phase ── */}
                {phase === "finish" && units.length > 0 && (
                  <div style={{ marginTop:10, display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
                    {units.map((u, i) => {
                      const ct      = CARCASS_TYPES.find(c => c.type===u.type && c.width===u.width);
                      const isDrawer = u.type === "drawer";
                      const isSel   = selected === u.id;
                      const shortLabel = isDrawer ? `Drw ${u.width}` : ct?.label?.replace(" Unit","").replace(" Cabinet","").replace(" — "," ") + ` ${u.width}`;
                      return (
                        <button key={u.id} onClick={()=>setSelected(u.id)} style={{
                          flexShrink:0,
                          padding:"6px 10px", borderRadius:20, cursor:"pointer",
                          border: isSel ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                          background: isSel ? C.orange+"22" : "rgba(255,255,255,0.04)",
                          color: isSel ? C.white : "#666",
                          fontSize:10, fontFamily:"inherit", whiteSpace:"nowrap",
                          display:"flex", alignItems:"center", gap:5,
                        }}>
                          <div style={{ width:10, height:10, borderRadius:2, background:finishBg(u.finish), flexShrink:0, border:`1px solid ${C.border}` }}/>
                          {shortLabel}
                          {isDrawer && <span style={{ fontSize:8, color: isSel ? C.gold : "#444" }}>⇒</span>}
                          {!isDrawer && <span style={{ fontSize:8, color: isSel ? C.gold : "#444" }}>⬡</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sheet content — reuses existing panels */}
              <div style={{ flex:1, overflowY:"auto" }}>
                {phase === "materials"
                  ? <MaterialsPanel
                      materials={materials} setMaterials={setMaterials}
                      onNext={()=>{ setPanelOpen(false); goToFinish(); }}
                      onBack={()=>{ setPanelOpen(false); setPhase("layout"); }}
                    />
                  : <LeftPanel
                      phase={phase} units={units} selected={selected}
                      setSelected={setSelected} setUnits={setUnits}
                      onClearAll={()=>{setUnits([]);setSelected(null);}}
                      onPaletteDragStart={paletteDragStart}
                      onTapAdd={c=>{ tapAdd(c); setPanelOpen(false); }}
                      totalFloor={totalFloor}
                      onNext={phase==="layout"
                        ? ()=>{ setPanelOpen(false); goToMaterials(); }
                        : ()=>{ setPanelOpen(false); setShowQuote(true); }
                      }
                    />
                }
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quote modal */}
      {showQuote && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:isPhone?"flex-end":"center", justifyContent:"center", zIndex:300 }}>
          <div style={{ background:C.white, border:`2px solid ${C.orange}`, borderRadius:isPhone?"16px 16px 0 0":10, padding:isPhone?"20px 16px":26, width:isPhone?"100%":430, maxWidth:"100vw", maxHeight:isPhone?"92vh":"88vh", overflowY:"auto", marginTop:isPhone?"auto":0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
              <HWHLogo size={26}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:"bold" }}>Request a Quote</div>
                <div style={{ fontSize:9, color:C.orange, letterSpacing:2, textTransform:"uppercase" }}>HWH Designs · Custom Carpentry</div>
              </div>
              <button onClick={()=>setShowQuote(false)} style={{ background:"none", border:"none", color:C.sub, cursor:"pointer", fontSize:20 }}>✕</button>
            </div>

            {quoteSent ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:22 }}>✓</div>
                <div style={{ fontSize:15, marginBottom:8, fontWeight:"bold" }}>Quote Request Sent!</div>
                <div style={{ fontSize:11, color:"#9A8878", marginBottom:16 }}>Email delivered to kim@hwhdesigns.co.za</div>
                <div style={{ background:"#1A3A1A", border:"1px solid #2D6A2D", borderRadius:8, padding:"12px 16px", display:"inline-flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18 }}>💬</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:11, color:"#5DBF5D", fontWeight:"bold" }}>WhatsApp opened</div>
                    <div style={{ fontSize:9, color:"#4A8A4A" }}>Tap Send to notify Kim directly</div>
                  </div>
                </div>
              </div>
            ) : (<>
              <div style={{ marginBottom:10 }}>
                <label style={LBL}>Full Name</label>
                <input value={cName} onChange={e=>setCName(e.target.value)} placeholder="Jane Smith" style={INP}/>
              </div>
              <div style={{ marginBottom:10 }}>
                <label style={LBL}>Email Address</label>
                <input value={cEmail} onChange={e=>setCEmail(e.target.value)} placeholder="jane@example.com" style={INP}/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={LBL}>Phone Number</label>
                <input value={cPhone} onChange={e=>setCPhone(e.target.value)} placeholder="+27 11 000 0000" style={INP}/>
              </div>

              <div style={{ background:"rgba(44,33,26,0.04)", borderRadius:6, padding:12, marginBottom:16, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase", marginBottom:8 }}>
                  Specification — {bom.length} unit{bom.length!==1?"s":""}
                </div>
                {bom.length===0
                  ? <div style={{ color:C.text, fontSize:11 }}>No cabinets placed.</div>
                  : bom.map((item,i)=>(
                    <div key={i} style={{ padding:"5px 0", borderBottom:`1px solid ${C.border}33` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text }}>
                        <span>{item.label} · <span style={{color:C.gold}}>{item.width}mm</span>{item.rot?` · ${item.rot}`:""}</span>
                        <span style={{ color:C.sub }}>{item.finish}</span>
                      </div>
                      <div style={{ display:"flex", gap:12, marginTop:2 }}>
                        {item.hasDoors && (
                          <span style={{ fontSize:8, color:C.sub }}>
                            ⬡ {item.hinges} hinge{item.hinges!==1?"s":""} · {item.hingeLabel}
                          </span>
                        )}
                        {item.hasDrawers && (
                          <span style={{ fontSize:8, color:C.sub }}>
                            ⇒ {item.drawers} runner pair{item.drawers!==1?"s":""} · {item.runnerLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                }
                <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase", marginBottom:6 }}>Run Metres</div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                    <span style={{color:"#777"}}>Floor run</span>
                    <span style={{color:C.gold, fontWeight:"bold"}}>{(totalFloor/1000).toFixed(2)}m</span>
                  </div>
                  {totalWall > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                      <span style={{color:"#777"}}>Wall cabinet run</span>
                      <span style={{color:C.gold, fontWeight:"bold"}}>{(totalWall/1000).toFixed(2)}m</span>
                    </div>
                  )}
                  {totalCtRun > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                      <span style={{color:"#777"}}>Countertop run</span>
                      <span style={{color:C.gold, fontWeight:"bold"}}>{(totalCtRun/1000).toFixed(2)}m</span>
                    </div>
                  )}
                  {totalFillerRun > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                      <span style={{color:"#777"}}>Filler strip run</span>
                      <span style={{color:C.gold}}>{(totalFillerRun/1000).toFixed(2)}m</span>
                    </div>
                  )}
                </div>

                {/* Fittings totals */}
                {(totalHinges > 0 || totalRunners > 0) && (
                  <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase", marginBottom:6 }}>Fittings Summary</div>
                    {totalHingesStd > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#9A8878", padding:"2px 0" }}>
                        <span>Standard Hinges</span><span style={{color:C.gold}}>× {totalHingesStd}</span>
                      </div>
                    )}
                    {totalHingesSoft > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#9A8878", padding:"2px 0" }}>
                        <span>Soft-Close Hinges</span><span style={{color:C.gold}}>× {totalHingesSoft}</span>
                      </div>
                    )}
                    {totalHinges > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0", borderTop:`1px solid ${C.border}33`, marginTop:2 }}>
                        <span style={{fontWeight:"bold"}}>Total Hinges</span><span style={{color:C.gold,fontWeight:"bold"}}>× {totalHinges}</span>
                      </div>
                    )}
                    {totalRunnersStd > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#9A8878", padding:"2px 0", marginTop:4 }}>
                        <span>Standard Runner Pairs</span><span style={{color:C.gold}}>× {totalRunnersStd}</span>
                      </div>
                    )}
                    {totalRunnersSoft > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#9A8878", padding:"2px 0" }}>
                        <span>Soft-Close Runner Pairs</span><span style={{color:C.gold}}>× {totalRunnersSoft}</span>
                      </div>
                    )}
                    {totalRunners > 0 && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0", borderTop:`1px solid ${C.border}33`, marginTop:2 }}>
                        <span style={{fontWeight:"bold"}}>Total Runner Pairs</span><span style={{color:C.gold,fontWeight:"bold"}}>× {totalRunners}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Materials summary */}
                {(matCtType || matCtColour || matCarcass) && (
                  <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:8, letterSpacing:2, color:C.orange, textTransform:"uppercase", marginBottom:8 }}>Materials</div>
                    {matCarcass && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                        <span style={{color:"#777"}}>Carcass build</span>
                        <span style={{color:C.gold}}>{matCarcass.label}</span>
                      </div>
                    )}
                    {matCtType && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                        <span style={{color:"#777"}}>Countertop type</span>
                        <span style={{color:C.gold}}>{matCtType.label}</span>
                      </div>
                    )}
                    {matCtColour && (
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.text, padding:"3px 0" }}>
                        <span style={{color:"#777"}}>Countertop colour</span>
                        <span style={{color:C.gold}}>{matCtColour.label}</span>
                      </div>
                    )}
                    {matCarcass && matCtType && (
                      <div style={{ marginTop:6, padding:"6px 8px", background: materials.carcass==="solid"&&materials.ctType==="marble" ? C.orange+"22" : materials.carcass==="solid"||materials.ctType==="marble" ? C.gold+"15" : "rgba(255,255,255,0.03)", borderRadius:4, fontSize:9, color: materials.carcass==="solid"&&materials.ctType==="marble" ? C.orange : materials.carcass==="solid"||materials.ctType==="marble" ? C.gold : "#555" }}>
                        {(materials.carcass==="solid" && ["marble","quartz"].includes(materials.ctType)) ? "★ Premium tier" : (materials.carcass==="solid" || ["marble","quartz"].includes(materials.ctType)) ? "◆ Mid-range tier" : "● Standard tier"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job total */}
              {jobTotal !== null && (
                <div style={{ margin:"0 0 14px", padding:"14px 16px", background:`linear-gradient(135deg,${C.orange}22,${C.gold}11)`, border:`1.5px solid ${C.orange}`, borderRadius:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:2, color:C.orange, textTransform:"uppercase" }}>Estimated Total</div>
                      <div style={{ fontSize:8, color:C.sub, marginTop:2 }}>Excl. VAT · labour & installation quoted separately</div>
                    </div>
                    <div style={{ fontSize:22, fontWeight:"bold", color:C.gold }}>
                      R {jobTotal.toLocaleString("en-ZA")}
                    </div>
                  </div>
                </div>
              )}

              {quoteError && (
                <div style={{ marginBottom:10, padding:"10px 12px", background:"rgba(200,50,50,0.15)", border:"1px solid rgba(200,50,50,0.4)", borderRadius:6, fontSize:10, color:"#E08080" }}>
                  {quoteError}
                </div>
              )}

              <button
                onClick={handleSubmitQuote}
                disabled={!cName||!cEmail||units.length===0||quoteSending}
                style={{ background:C.orange, color:C.white, border:"none", borderRadius:6, width:"100%", padding:13, fontSize:12, fontWeight:"bold", letterSpacing:2, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", opacity:(!cName||!cEmail||units.length===0||quoteSending)?0.45:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {quoteSending
                  ? <><span style={{ fontSize:14, animation:"spin 1s linear infinite" }}>⟳</span> Sending…</>
                  : <><span>📧</span> Submit & Notify via WhatsApp</>
                }
              </button>
              <div style={{ marginTop:8, fontSize:9, color:C.text, textAlign:"center", lineHeight:1.6 }}>
                Sends spec to <span style={{color:C.orange}}>kim@hwhdesigns.co.za</span> · Opens WhatsApp to +27 82 889 9787
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

const sBtn = (bg, color) => ({ background:bg, color, border:`1px solid ${color}44`, borderRadius:4, padding:"7px 8px", cursor:"pointer", fontSize:9, letterSpacing:1, textTransform:"uppercase", fontFamily:"inherit", width:"100%" });
const ZB   = { background:"none", border:"none", color:"#A09080", cursor:"pointer", fontSize:15, padding:"0 4px", lineHeight:1 };
const LBL  = { fontSize:9, letterSpacing:2, color:"#D96339", textTransform:"uppercase", display:"block", marginBottom:4 };
const INP  = { width:"100%", padding:"9px 11px", boxSizing:"border-box", background:"#F5F2EE", border:`1px solid ${C.border}`, borderRadius:5, color:C.text, fontSize:12, fontFamily:"inherit" };
