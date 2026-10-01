"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const SPOON_SRC = "/spoon.svg";
const SPOON_NATIVE_WIDTH = 143;
const SPOON_NATIVE_HEIGHT = 663;
const SPOON_ASPECT = SPOON_NATIVE_WIDTH / SPOON_NATIVE_HEIGHT;

const WALL_THICKNESS = 120;
const MOBILE_BREAKPOINT = 768;
const MOBILE_SPOON_SCALE = 0.5;
const MAX_SPOONS = 80;
const SPAWN_INTERVAL_MS = 120;
const HOVER_RADIUS = 140;
const HOVER_NUDGE_FORCE = 0.0022;
const MAX_HOVER_SPEED = 60;

export default function MatterSpoons() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { Engine, Render, Runner, Bodies, Composite, Body, Mouse, MouseConstraint, Events } = Matter;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = width < MOBILE_BREAKPOINT;

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        background: "#000000",
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const ground = Bodies.rectangle(width / 2, height + WALL_THICKNESS / 2, width * 2, WALL_THICKNESS, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height * 2, {
      isStatic: true,
      render: { visible: false },
    });
    Composite.add(world, [ground, leftWall, rightWall]);

    const spoonHeight = Math.max(80, Math.min(150, height / 5.5)) * (isMobile ? MOBILE_SPOON_SCALE : 1);
    const spoonWidth = spoonHeight * SPOON_ASPECT;

    const spoons: Matter.Body[] = [];

    const spawnSpoon = () => {
      const x = spoonWidth + Math.random() * (width - spoonWidth * 2);
      const y = -spoonHeight - Math.random() * height * 0.5;
      const body = Bodies.rectangle(x, y, spoonWidth, spoonHeight, {
        chamfer: { radius: spoonWidth / 2 },
        angle: Math.random() * Math.PI * 2,
        friction: 0.5,
        frictionAir: 0.01,
        restitution: 0.35,
        density: 0.0025,
        render: {
          sprite: {
            texture: SPOON_SRC,
            xScale: spoonWidth / SPOON_NATIVE_WIDTH,
            yScale: spoonHeight / SPOON_NATIVE_HEIGHT,
          },
        },
      });
      spoons.push(body);
      Composite.add(world, body);
    };

    let spawnInterval: number | undefined;
    if (isMobile) {
      for (let i = 0; i < MAX_SPOONS; i++) {
        spawnSpoon();
      }
    } else {
      let spawned = 0;
      spawnInterval = window.setInterval(() => {
        if (spawned >= MAX_SPOONS) {
          window.clearInterval(spawnInterval);
          return;
        }
        spawnSpoon();
        spawned += 1;
      }, SPAWN_INTERVAL_MS);
    }

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    let hoverActive = false;
    const handlePointerMove = () => {
      hoverActive = true;
    };
    const handlePointerLeave = () => {
      hoverActive = false;
    };
    render.canvas.addEventListener("pointermove", handlePointerMove);
    render.canvas.addEventListener("pointerleave", handlePointerLeave);

    // Nudges spoons in the direction the cursor is actually moving, scaled by
    // how fast it's moving -- a stationary cursor resting over the pile
    // applies no force, so it never carves out a static empty zone.
    let lastMousePos: { x: number; y: number } | null = null;
    const applyHoverForce = () => {
      if (!hoverActive) {
        lastMousePos = null;
        return;
      }
      const mousePos = mouse.position;
      if (!lastMousePos) {
        lastMousePos = { x: mousePos.x, y: mousePos.y };
        return;
      }

      const moveX = mousePos.x - lastMousePos.x;
      const moveY = mousePos.y - lastMousePos.y;
      lastMousePos = { x: mousePos.x, y: mousePos.y };

      const rawSpeed = Math.hypot(moveX, moveY);
      if (rawSpeed < 1) return;
      const dirX = moveX / rawSpeed;
      const dirY = moveY / rawSpeed;
      const speed = Math.min(rawSpeed, MAX_HOVER_SPEED);

      for (const body of spoons) {
        if (mouseConstraint.body === body) continue;
        const dist = Math.hypot(body.position.x - mousePos.x, body.position.y - mousePos.y);
        if (dist >= HOVER_RADIUS) continue;
        const strength = 1 - dist / HOVER_RADIUS;
        const forceMagnitude = HOVER_NUDGE_FORCE * strength * speed * body.mass;
        const applicationPoint = {
          x: body.position.x + (Math.random() - 0.5) * (body.bounds.max.x - body.bounds.min.x),
          y: body.position.y + (Math.random() - 0.5) * (body.bounds.max.y - body.bounds.min.y),
        };
        Body.applyForce(body, applicationPoint, {
          x: dirX * forceMagnitude,
          y: dirY * forceMagnitude,
        });
      }
    };
    Events.on(engine, "beforeUpdate", applyHoverForce);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;
      Render.setPixelRatio(render, window.devicePixelRatio || 1);

      Body.setPosition(ground, { x: newWidth / 2, y: newHeight + WALL_THICKNESS / 2 });
      Body.setPosition(rightWall, { x: newWidth + WALL_THICKNESS / 2, y: newHeight / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (spawnInterval !== undefined) window.clearInterval(spawnInterval);
      window.removeEventListener("resize", handleResize);
      render.canvas.removeEventListener("pointermove", handlePointerMove);
      render.canvas.removeEventListener("pointerleave", handlePointerLeave);
      Events.off(engine, "beforeUpdate", applyHoverForce);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
