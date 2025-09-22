"use client";

import React, { useEffect, useRef } from "react";

// A subtle snake-like light trail moving around the viewport using a canvas.
// Designed to be very lightweight and respect prefers-reduced-motion.
export default function LightSnake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mediaReduced = useRef<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaReduced.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => (mediaReduced.current = e.matches);
    mq.addEventListener?.("change", onChange);

  const canvas = canvasRef.current;
  if (!canvas) return;
  const canvasEl: HTMLCanvasElement = canvas;
  const maybeCtx = canvasEl.getContext("2d", { alpha: true });
  if (!maybeCtx) return;
  const ctx: CanvasRenderingContext2D = maybeCtx;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0,
      height = 0;

    // Grid and snake parameters
  const GRID = 10; // px per cell
  const CORNER_CROSS_SIZE = 100; // aligns with CornerMarks default size
  const MAX_LENGTH_PX = CORNER_CROSS_SIZE * 6; // requested ~6x cross size
  const maxCells = Math.max(8, Math.round(MAX_LENGTH_PX / GRID)); // keep fixed to avoid excessive length
  const LINE_THICKNESS = 2; // thicker core line for visibility
  const CELLS_PER_SEC = 20; // calmer movement speed

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      // canvas and ctx are defined in this closure
      canvasEl.style.width = width + "px";
      canvasEl.style.height = height + "px";
      canvasEl.width = Math.floor(width * DPR);
      canvasEl.height = Math.floor(height * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  // keep maxCells fixed to avoid too long beam
    }
    resize();
    window.addEventListener("resize", resize);

    // Snake state (grid based, axis-aligned) — we'll draw a mirrored twin vertically
    type Cell = { cx: number; cy: number };
    const points: Cell[] = [];
    // Start in center cell
  const initCols = Math.max(1, Math.floor(width / GRID));
  const start: Cell = { cx: Math.floor(initCols / 2), cy: 1 }; // near top
    points.push(start);
  let dir: Cell = [{ cx: 1, cy: 0 }, { cx: -1, cy: 0 }, { cx: 0, cy: 1 }, { cx: 0, cy: -1 }][Math.floor(Math.random() * 4)];
  // Tuning to reduce jittery turns:
  // - MIN_STRAIGHT_CELLS: minimum number of cells to go straight between turns
  // - TURN_PROB: probability to turn when cooldown is over (per cell)
  const MIN_STRAIGHT_CELLS = 20;
  const TURN_PROB = 0.08;
  let turnCooldown = MIN_STRAIGHT_CELLS; // start with a straight run
    let acc = 0; // cell accumulator
    let lastTime = performance.now();

    // If reduced motion is on at init, seed a short static segment so something is visible
    if (mediaReduced.current) {
      const cols = Math.max(1, Math.floor(width / GRID));
      const rows = Math.max(1, Math.floor(height / GRID));
      for (let i = 1; i < Math.min(maxCells, 12); i++) {
        const nx = (start.cx + dir.cx * i + cols) % cols;
        const ny = (start.cy + dir.cy * i + rows) % rows;
        points.push({ cx: nx, cy: ny });
      }
    } else {
      // pre-seed a bit of trail so the effect is visible immediately
      const cols = Math.max(1, Math.floor(width / GRID));
      const rows = Math.max(1, Math.floor(height / GRID));
      for (let i = 1; i < 6; i++) {
        const nx = (start.cx + dir.cx * i + cols) % cols;
        const ny = (start.cy + dir.cy * i + rows) % rows;
        points.push({ cx: nx, cy: ny });
      }
    }

    function step(now: number) {
      const elapsed = Math.min(48, now - lastTime);
      lastTime = now;

      if (!mediaReduced.current) {
        acc += (CELLS_PER_SEC * elapsed) / 1000;
        const cols = Math.max(1, Math.floor(width / GRID));
        const rows = Math.max(1, Math.floor(height / GRID));

        while (acc >= 1) {
          // Decide if we turn at this cell step (only when cooldown elapsed)
          if (turnCooldown <= 0) {
            const options: Cell[] = dir.cx === 0 ? [{ cx: 1, cy: 0 }, { cx: -1, cy: 0 }] : [{ cx: 0, cy: 1 }, { cx: 0, cy: -1 }];
            const next = options[Math.floor(Math.random() * options.length)];
            // Avoid reversing (shouldn't happen since options are perpendicular), and gate by probability
            if (!(next.cx === -dir.cx && next.cy === -dir.cy) && Math.random() < TURN_PROB) {
              dir = next;
              turnCooldown = MIN_STRAIGHT_CELLS;
            }
          }

          const head = points[0];
          const nx = (head.cx + dir.cx + cols) % cols;
          const ny = (head.cy + dir.cy + rows) % rows;
          points.unshift({ cx: nx, cy: ny });
          // keep length limited by cells
          while (points.length > maxCells) points.pop();
          acc -= 1;
          if (turnCooldown > 0) turnCooldown -= 1;
        }
      }

      // Draw
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

  // Render segments with fading alpha. Draw a soft underlay (glow), then a crisp core line.
      function drawSegment(x0: number, y0: number, x1: number, y1: number, alpha: number) {
        // Handle wrap-around to avoid drawing a long line across the entire viewport
        if (y0 === y1) {
          const dx = x1 - x0;
          if (Math.abs(dx) > GRID) {
            // horizontal wrap: split into two pieces
            if (dx > 0) {
              // from near left edge to right edge
              // piece 1: x0 -> 0
              const w1 = Math.abs(x0 - 0);
              if (w1 > 0) {
                const gx = 0;
                const gy = y0;
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(Math.min(x0, gx), gy - Math.floor(glowThickness / 2), w1, glowThickness);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(Math.min(x0, gx), gy - Math.floor(LINE_THICKNESS / 2), w1, LINE_THICKNESS);
              }
              // piece 2: width -> x1
              const w2 = Math.abs(canvasEl.width / DPR - x1);
              if (w2 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(canvasEl.width / DPR - w2, y1 - Math.floor(glowThickness / 2), w2, glowThickness);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(canvasEl.width / DPR - w2, y1 - Math.floor(LINE_THICKNESS / 2), w2, LINE_THICKNESS);
              }
              return;
            } else {
              // from near right edge to left edge
              // piece 1: x0 -> width
              const w1 = Math.abs(canvasEl.width / DPR - x0);
              if (w1 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(x0, y0 - Math.floor(glowThickness / 2), w1, glowThickness);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(x0, y0 - Math.floor(LINE_THICKNESS / 2), w1, LINE_THICKNESS);
              }
              // piece 2: 0 -> x1
              const w2 = Math.abs(x1 - 0);
              if (w2 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(0, y1 - Math.floor(glowThickness / 2), w2, glowThickness);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(0, y1 - Math.floor(LINE_THICKNESS / 2), w2, LINE_THICKNESS);
              }
              return;
            }
          }
        } else if (x0 === x1) {
          const dy = y1 - y0;
          if (Math.abs(dy) > GRID) {
            // vertical wrap: split
            if (dy > 0) {
              // top -> bottom edge
              const h1 = Math.abs(y0 - 0);
              if (h1 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(x0 - Math.floor(glowThickness / 2), Math.min(y0, 0), glowThickness, h1);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(x0 - Math.floor(LINE_THICKNESS / 2), Math.min(y0, 0), LINE_THICKNESS, h1);
              }
              const h2 = Math.abs(canvasEl.height / DPR - y1);
              if (h2 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(x1 - Math.floor(glowThickness / 2), canvasEl.height / DPR - h2, glowThickness, h2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(x1 - Math.floor(LINE_THICKNESS / 2), canvasEl.height / DPR - h2, LINE_THICKNESS, h2);
              }
              return;
            } else {
              // bottom -> top edge
              const h1 = Math.abs(canvasEl.height / DPR - y0);
              if (h1 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(x0 - Math.floor(glowThickness / 2), y0, glowThickness, h1);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(x0 - Math.floor(LINE_THICKNESS / 2), y0, LINE_THICKNESS, h1);
              }
              const h2 = Math.abs(y1 - 0);
              if (h2 > 0) {
                const glowThickness = LINE_THICKNESS * 2;
                const glowAlpha = Math.min(0.25, alpha * 0.6);
                ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
                ctx.fillRect(x1 - Math.floor(glowThickness / 2), 0, glowThickness, h2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillRect(x1 - Math.floor(LINE_THICKNESS / 2), 0, LINE_THICKNESS, h2);
              }
              return;
            }
          }
        }

        // normal (non-wrap) segment drawing
        const glowThickness = LINE_THICKNESS * 2;
        const glowAlpha = Math.min(0.25, alpha * 0.6);
        ctx.fillStyle = `rgba(255,255,255,${glowAlpha})`;
        if (y0 === y1) {
          const x = Math.min(x0, x1);
          const w = Math.max(1, Math.abs(x1 - x0));
          ctx.fillRect(x, y0 - Math.floor(glowThickness / 2), w, glowThickness);
        } else if (x0 === x1) {
          const y = Math.min(y0, y1);
          const h = Math.max(1, Math.abs(y1 - y0));
          ctx.fillRect(x0 - Math.floor(glowThickness / 2), y, glowThickness, h);
        }
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        if (y0 === y1) {
          const x = Math.min(x0, x1);
          const w = Math.max(1, Math.abs(x1 - x0));
          ctx.fillRect(x, y0 - Math.floor(LINE_THICKNESS / 2), w, LINE_THICKNESS);
        } else if (x0 === x1) {
          const y = Math.min(y0, y1);
          const h = Math.max(1, Math.abs(y1 - y0));
          ctx.fillRect(x0 - Math.floor(LINE_THICKNESS / 2), y, LINE_THICKNESS, h);
        }
      }
      // helper: draw both the main segment and its vertical mirror
      const drawMirrored = (x0: number, y0: number, x1: number, y1: number, rowsPx: number, alpha: number) => {
        // original
        drawSegment(x0, y0, x1, y1, alpha);
        // vertical mirror around center line (in pixel space)
        const y0m = Math.round(rowsPx - y0);
        const y1m = Math.round(rowsPx - y1);
        drawSegment(x0, y0m, x1, y1m, alpha);
      };

      // Draw both snakes: base and mirrored vertically (top/bottom)
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const x0 = Math.round((p0.cx + 0.5) * GRID);
        const y0 = Math.round((p0.cy + 0.5) * GRID);
        const x1 = Math.round((p1.cx + 0.5) * GRID);
        const y1 = Math.round((p1.cy + 0.5) * GRID);
        const alpha = Math.max(0, 0.24 * (1 - i / points.length));
        drawMirrored(x0, y0, x1, y1, Math.round((Math.max(1, Math.floor(height / GRID)) - 1 + 0.5) * GRID), alpha);
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
  className="pointer-events-none fixed inset-0 z-0 opacity-37 mix-blend-screen"
      aria-hidden
    />
  );
}
