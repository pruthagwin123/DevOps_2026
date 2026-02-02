import React, { useState, useEffect, useRef } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const displayRef = useRef(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (count === 0) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(id);
  }, [count]);

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  // render text to an offscreen canvas and return pixel positions
  function sampleTextPositions(text, step = 8) {
    const canvas = canvasRef.current || document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const W = 220;
    const H = 120;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "white";
    const fontSize = Math.floor(H * 0.7);
    ctx.font = `${fontSize}px Poppins, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), W / 2, H / 2 + 6);

    const img = ctx.getImageData(0, 0, W, H);
    const positions = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const idx = (y * W + x) * 4;
        if (img.data[idx + 3] > 120) {
          positions.push({ x, y });
        }
      }
    }
    return { positions, W, H };
  }

  function createCube(x, y, size = 8) {
    const el = document.createElement("div");
    // use golden cubes explicitly
    el.className = "cube golden" + (size <= 6 ? " tiny" : "") + " glow";
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${x - size / 2}px`;
    el.style.top = `${y - size / 2}px`;
    el.style.opacity = "0";
    return el;
  }

  // assemble: cubes fly in from all 360° directions and form the text, then fade to the normal number text
  async function animateAssemble(text) {
    if (!containerRef.current || !overlayRef.current) return;
    if (animatingRef.current) return;
    if (prefersReducedMotion()) {
      if (displayRef.current) displayRef.current.style.opacity = "1";
      return;
    }
    animatingRef.current = true;

    const rect = containerRef.current.getBoundingClientRect();
    const overlay = overlayRef.current;
    const step = Math.max(6, Math.round(Math.min(rect.width, rect.height) / 26));
    const { positions, W, H } = sampleTextPositions(text, step);
    overlay.innerHTML = "";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";

    const scaleX = rect.width / W;
    const scaleY = rect.height / H;

    // hide the text while cubes form
    if (displayRef.current) displayRef.current.style.opacity = "0";

    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
    const minRadius = Math.max(rect.width, rect.height) * 0.6;

    const cubes = [];
    positions.forEach((p, i) => {
      const targetX = Math.round(p.x * scaleX);
      const targetY = Math.round(p.y * scaleY);
      const size = Math.max(5, Math.round(step * 0.9));
      const cube = createCube(targetX, targetY, size);

      cube.style.position = "absolute";
      cube.style.left = `${targetX - size / 2}px`;
      cube.style.top = `${targetY - size / 2}px`;

      // start from a random angle/distance around the screen (360 degrees)
      const angle = Math.random() * Math.PI * 2;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * radius;

      cube.style.transform = `translate(${startX}px, ${startY}px) scale(0.35) rotate(${(Math.random() - 0.5) * 90}deg)`;
      overlay.appendChild(cube);
      cubes.push(cube);

      // stagger animation
      setTimeout(() => {
        cube.style.opacity = "1";
        cube.style.transform = `translate(0px, 0px) scale(1) rotate(0deg)`;
      }, 60 + i * 8);
    });

    // wait until animations finish
    await new Promise((res) => setTimeout(res, 900 + positions.length * 8));

    // fade out cubes to reveal the normal text
    cubes.forEach((cube, i) => {
      setTimeout(() => {
        cube.style.transform = `translate(0px, -18px) scale(0.6) rotate(8deg)`;
        cube.style.opacity = "0";
      }, i * 10);
    });

    await new Promise((res) => setTimeout(res, 300 + positions.length * 10));

    overlay.innerHTML = "";
    if (displayRef.current) displayRef.current.style.opacity = "1";

    // small pop effect via pulse state
    setPulse(true);
    setTimeout(() => setPulse(false), 280);

    animatingRef.current = false;
  }

  // explode: the displayed number is converted into cubes which fly outward
  // keepHidden: if true, leaves the display hidden at the end (for chaining)
  async function animateExplode(text, keepHidden = false) {
    if (!containerRef.current || !overlayRef.current || !displayRef.current) return;
    if (animatingRef.current) return;
    if (prefersReducedMotion()) {
      // if user prefers reduced motion, just hide/show quickly
      displayRef.current.style.opacity = keepHidden ? "0" : "1";
      return;
    }
    animatingRef.current = true;

    const overlay = overlayRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";

    // start with a collapse effect on the gold number
    displayRef.current.classList.add('collapse');

    // brief pause to let the collapse look smooth
    await new Promise((res) => setTimeout(res, 160));

    // hide the text so it looks like it transforms into cubes
    displayRef.current.style.opacity = "0";
    displayRef.current.classList.remove('collapse');

    const existing = Array.from(overlay.children);

    if (existing.length > 0) {
      // explode the existing cubes
      existing.forEach((cube, i) => {
        cube.style.opacity = "1"; // ensure visible
        setTimeout(() => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 120 + Math.random() * 380;
          const tx = Math.cos(angle) * distance + (Math.random() - 0.5) * 40;
          const ty = Math.sin(angle) * distance + (Math.random() - 0.5) * 40 - 20;
          const rot = (Math.random() - 0.5) * 720;
          cube.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.8)`;
          cube.style.opacity = "0";
        }, i * 6);
      });

      await new Promise((res) => setTimeout(res, 1000 + existing.length * 6));
      overlay.innerHTML = "";
      if (!keepHidden) displayRef.current.style.opacity = "1";
      animatingRef.current = false;
      return;
    }

    // No existing cubes: sample text and create cubes then explode them
    const step = Math.max(6, Math.round(Math.min(rect.width, rect.height) / 26));
    const { positions, W, H } = sampleTextPositions(text, step);

    const scaleX = rect.width / W;
    const scaleY = rect.height / H;

    positions.forEach((p, i) => {
      const x = Math.round(p.x * scaleX);
      const y = Math.round(p.y * scaleY);
      const size = Math.max(5, Math.round(step * 0.9));
      const cube = createCube(x, y, size);
      cube.style.position = "absolute";
      cube.style.left = `${x - size / 2}px`;
      cube.style.top = `${y - size / 2}px`;
      cube.style.opacity = "1";
      overlay.appendChild(cube);

      // explode outward after a small delay
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 380;
        const tx = Math.cos(angle) * distance + (Math.random() - 0.5) * 40;
        const ty = Math.sin(angle) * distance + (Math.random() - 0.5) * 40 - 20;
        const rot = (Math.random() - 0.5) * 720;
        cube.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.8)`;
        cube.style.opacity = "0";
      }, i * 6);
    });

    // wait until animations finish
    await new Promise((res) => setTimeout(res, 1000 + positions.length * 6));

    overlay.innerHTML = "";
    if (!keepHidden) displayRef.current.style.opacity = "1";
    animatingRef.current = false;
  }

  const increment = async () => {
    if (animatingRef.current) return;
    const newCount = count + 1;
    // animate forming the new number from 360° then set the value
    await animateAssemble(newCount);
    setCount(newCount);
  };

  const decrement = async () => {
    if (animatingRef.current) return;
    if (count === 0) return;
    const cur = count;
    // turn current number into cubes that fly away (keep display hidden to chain)
    await animateExplode(cur, true);

    const newCount = cur - 1;
    setCount(newCount);

    // assemble the new number using cubes flying in from 360°
    await animateAssemble(newCount);
  };

  const reset = async () => {
    if (animatingRef.current) return;
    if (count === 0) return;
    await animateExplode(count);
    setCount(0);
  };

  return (
    <div className="counter-card">
      <h2 className="counter-title">Counter Application</h2>

      <div className="counter-wrapper" ref={containerRef} style={{ margin: '8px 0 6px' }}>
        <div ref={displayRef} className={`count-display ${pulse ? "pop" : ""}`}>{count}</div>
        <div className="counter-overlay" ref={overlayRef} aria-hidden="true"></div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="button-row">
        <button className="btn btn-primary" onClick={increment} aria-label="Increment">+ Add</button>
        <button className="btn btn-secondary" onClick={decrement} aria-label="Decrement">- Sub</button>
        <button className="btn btn-ghost" onClick={reset} aria-label="Reset">Reset</button>
      </div>
    </div>
  );
}

export default Counter;