"use client";

import { useEffect, useMemo, useRef } from "react";

const SPOON_PATH =
  "M50,4 C70,4 80,26 80,46 C80,66 66,82 52,86 C58,96 64,120 58,150 C54,175 60,200 54,228 C51,244 50,252 50,258 C50,252 49,244 46,228 C40,200 46,175 42,150 C36,120 42,96 48,86 C34,82 20,66 20,46 C20,26 30,4 50,4 Z";

const GRADIENTS = [
  { id: "spoonGrad-0", angle: 20 },
  { id: "spoonGrad-1", angle: 65 },
  { id: "spoonGrad-2", angle: 110 },
  { id: "spoonGrad-3", angle: 155 },
  { id: "spoonGrad-4", angle: 200 },
  { id: "spoonGrad-5", angle: 245 },
];

type SpoonConfig = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  grad: number;
};

// Hand-placed to read as a loose, overlapping radial burst, mirroring the
// reference image's cluster of chrome capsules bursting from the center.
const SPOONS: SpoonConfig[] = [
  { x: 320, y: 90, rotate: 4, scale: 0.72, grad: 0 },
  { x: 210, y: 120, rotate: -34, scale: 0.6, grad: 1 },
  { x: 430, y: 115, rotate: 32, scale: 0.62, grad: 2 },
  { x: 130, y: 210, rotate: -58, scale: 0.68, grad: 3 },
  { x: 500, y: 200, rotate: 60, scale: 0.7, grad: 4 },
  { x: 90, y: 330, rotate: -88, scale: 0.6, grad: 5 },
  { x: 540, y: 320, rotate: 92, scale: 0.58, grad: 0 },
  { x: 300, y: 250, rotate: 6, scale: 0.5, grad: 1 },
  { x: 190, y: 300, rotate: -20, scale: 0.46, grad: 2 },
  { x: 420, y: 290, rotate: 22, scale: 0.48, grad: 3 },
  { x: 130, y: 440, rotate: -112, scale: 0.66, grad: 4 },
  { x: 500, y: 430, rotate: 118, scale: 0.64, grad: 5 },
  { x: 250, y: 400, rotate: -10, scale: 0.42, grad: 0 },
  { x: 380, y: 400, rotate: 14, scale: 0.44, grad: 1 },
  { x: 220, y: 500, rotate: -150, scale: 0.6, grad: 2 },
  { x: 420, y: 500, rotate: 150, scale: 0.58, grad: 3 },
  { x: 320, y: 540, rotate: 180, scale: 0.68, grad: 4 },
  { x: 310, y: 330, rotate: 40, scale: 0.34, grad: 5 },
  { x: 350, y: 180, rotate: -6, scale: 0.36, grad: 1 },
  { x: 240, y: 190, rotate: 18, scale: 0.32, grad: 3 },
];

const VIEWBOX = 640;
const PROXIMITY_RADIUS = 150;
const MAX_PUSH = 46;
const MAX_KNOCK_ROTATION = 42;

// SVG presentation-attribute syntax (space-separated, unitless) — used for
// the initial JSX `transform` attribute.
function spoonAttrTransform(s: SpoonConfig) {
  return `translate(${s.x} ${s.y}) rotate(${s.rotate}) scale(${s.scale}) translate(-50 -130)`;
}

// CSS `transform` property syntax (comma-separated, `deg`/`px` units) —
// required for the JS-driven, CSS-transitioned knock effect. The
// space-separated SVG syntax above is invalid here and gets silently
// dropped by the CSS parser, leaving style.transform empty.
function spoonCssTransform(s: SpoonConfig, pushX: number, pushY: number, rotateOffset: number) {
  return `translate(${s.x + pushX}px, ${s.y + pushY}px) rotate(${s.rotate + rotateOffset}deg) scale(${s.scale}) translate(-50px, -130px)`;
}

export default function SpoonCluster() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  // Per-spoon transition timing variance so they don't snap back in unison.
  // Deterministic pseudo-random (index-seeded) to stay pure during render.
  const transitions = useMemo(
    () =>
      SPOONS.map((_, i) => {
        const seedA = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const seedB = Math.abs(Math.sin(i * 78.233) * 12543.135) % 1;
        const duration = (260 + seedA * 180).toFixed(0);
        const delay = (seedB * 90).toFixed(0);
        return `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`;
      }),
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const gEls = Array.from(svg.querySelectorAll<SVGGElement>("g[data-spoon]"));

    const applyFrame = () => {
      rafRef.current = null;
      const pointer = pointerRef.current;

      SPOONS.forEach((s, i) => {
        const g = gEls[i];
        if (!g) return;

        if (!pointer) {
          g.style.transform = spoonCssTransform(s, 0, 0, 0);
          return;
        }

        const dx = s.x - pointer.x;
        const dy = s.y - pointer.y;
        const dist = Math.hypot(dx, dy);

        if (dist >= PROXIMITY_RADIUS) {
          g.style.transform = spoonCssTransform(s, 0, 0, 0);
          return;
        }

        const strength = 1 - dist / PROXIMITY_RADIUS;
        const nx = dist === 0 ? 1 : dx / dist;
        const ny = dist === 0 ? 0 : dy / dist;
        const pushX = nx * MAX_PUSH * strength;
        const pushY = ny * MAX_PUSH * strength;
        const rotateOffset = Math.sign(dx || 1) * MAX_KNOCK_ROTATION * strength;

        g.style.transform = spoonCssTransform(s, pushX, pushY, rotateOffset);
      });
    };

    const scheduleFrame = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(applyFrame);
      }
    };

    const toLocalPoint = (clientX: number, clientY: number) => {
      const rect = svg.getBoundingClientRect();
      const scale = Math.min(rect.width / VIEWBOX, rect.height / VIEWBOX);
      const offsetX = (rect.width - VIEWBOX * scale) / 2;
      const offsetY = (rect.height - VIEWBOX * scale) / 2;
      return {
        x: (clientX - rect.left - offsetX) / scale,
        y: (clientY - rect.top - offsetY) / scale,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = toLocalPoint(e.clientX, e.clientY);
      scheduleFrame();
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
      scheduleFrame();
    };

    svg.addEventListener("pointermove", handlePointerMove);
    svg.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      svg.removeEventListener("pointermove", handlePointerMove);
      svg.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className="h-full w-full [animation:spoon-sway_9s_ease-in-out_infinite_alternate]"
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}
      aria-hidden="true"
    >
      <defs>
        {GRADIENTS.map((g) => (
          <linearGradient
            key={g.id}
            id={g.id}
            gradientTransform={`rotate(${g.angle})`}
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#b98cff" />
            <stop offset="25%" stopColor="#7fe8c9" />
            <stop offset="50%" stopColor="#ff9ecb" />
            <stop offset="75%" stopColor="#ffe38a" />
            <stop offset="100%" stopColor="#8ec8ff" />
          </linearGradient>
        ))}
        <radialGradient id="spoonShine" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {SPOONS.map((s, i) => (
        <g
          key={i}
          data-spoon={i}
          transform={spoonAttrTransform(s)}
          style={{ transition: transitions[i] }}
        >
          <path
            d={SPOON_PATH}
            fill={`url(#${GRADIENTS[s.grad].id})`}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />
          <ellipse cx={50} cy={42} rx={20} ry={26} fill="url(#spoonShine)" style={{ mixBlendMode: "screen" }} />
        </g>
      ))}
    </svg>
  );
}
