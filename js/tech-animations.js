/**
 * KallaiDigitalSurvey - Real Field Technology Canvas Animation Engine
 * 60FPS Lightweight Technical Visualizations for Total Station, DGPS GNSS, Drone, Boundary, 3D Terrain, CAD GIS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Total Station Animation
  initTotalStationCanvas();

  // 2. GPS / GNSS Animation
  initGNSSCanvas();

  // 3. Drone Survey Animation
  initDroneCanvas();

  // 4. Land Boundary Animation
  initBoundaryCanvas();

  // 5. 3D Terrain Animation
  initTerrainCanvas();

  // 6. CAD & GIS Mapping Animation
  initMappingCanvas();
});

// Helper for DPI scaling
function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 360;
  const height = rect.height || 200;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  return { canvas, ctx, width, height };
}

/* ══════════════════════════════════════════════════════════════════
   1. TOTAL STATION ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initTotalStationCanvas() {
  const sys = setupCanvas('canvas-total-station');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;
  const targetPoints = [
    { x: 180, y: 140, label: 'P1 (124.5, 89.2)' },
    { x: 280, y: 120, label: 'P2 (210.8, 145.6)' },
    { x: 310, y: 165, label: 'P3 (195.4, 180.1)' },
    { x: 200, y: 175, label: 'P4 (110.2, 172.5)' }
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Background Grid
    drawGrid(ctx, width, height);

    // Tripod & Instrument at (60, 150)
    const tx = 55, ty = 145;
    
    // Tripod legs
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, ty - 25); ctx.lineTo(tx - 22, ty + 35);
    ctx.moveTo(tx, ty - 25); ctx.lineTo(tx, ty + 38);
    ctx.moveTo(tx, ty - 25); ctx.lineTo(tx + 22, ty + 35);
    ctx.stroke();

    // Total station body
    ctx.fillStyle = '#10b981';
    ctx.fillRect(tx - 8, ty - 45, 16, 20);
    ctx.fillStyle = '#0b1a30';
    ctx.fillRect(tx - 6, ty - 40, 12, 10);
    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.arc(tx + 4, ty - 35, 3, 0, Math.PI * 2);
    ctx.fill();

    // Surveyor Silhouette
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(tx - 18, ty - 40, 7, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.fillRect(tx - 22, ty - 32, 8, 30); // Body

    // Laser Beam targeting active point
    const pointIdx = Math.floor((frame / 90) % targetPoints.length);
    const progress = (frame % 90) / 90;
    const pt = targetPoints[pointIdx];

    // Pulsing Laser beam
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(tx + 6, ty - 35);
    ctx.lineTo(tx + (pt.x - tx) * progress, ty - 35 + (pt.y - (ty - 35)) * progress);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw connected points & polygon line
    const activeCount = Math.min(targetPoints.length, Math.floor(frame / 90) + 1);
    if (activeCount > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(targetPoints[0].x, targetPoints[0].y);
      for (let i = 1; i < activeCount; i++) {
        ctx.lineTo(targetPoints[i].x, targetPoints[i].y);
      }
      if (activeCount === targetPoints.length) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.fill();
      }
      ctx.stroke();
    }

    // Render target points
    targetPoints.forEach((p, idx) => {
      if (idx < activeCount) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7 + Math.sin(frame * 0.1) * 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Inter, sans-serif';
        ctx.fillText(p.label, p.x - 30, p.y + 16);
      }
    });

    // Top overlay specs
    drawTelemetryBadge(ctx, 10, 20, `TOTAL STATION LASER SIGHT: SCANNING PT ${pointIdx + 1}`);

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════════
   2. GPS / GNSS ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initGNSSCanvas() {
  const sys = setupCanvas('canvas-gnss');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    // Satellites at top
    const sats = [
      { x: 60 + Math.sin(frame * 0.02) * 15, y: 25 },
      { x: 180 + Math.cos(frame * 0.02) * 15, y: 20 },
      { x: 300 - Math.sin(frame * 0.02) * 15, y: 25 }
    ];

    // DGPS Rover Pole at (180, 140)
    const rx = 180, ry = 140;

    // Draw Satellite Signal Beams to Rover Dish
    sats.forEach(s => {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(s.x - 6, s.y - 4, 12, 8);
      // Solar panels
      ctx.fillStyle = '#0077ff';
      ctx.fillRect(s.x - 14, s.y - 2, 6, 4);
      ctx.fillRect(s.x + 8, s.y - 2, 6, 4);

      // Signal wave line
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + 4);
      ctx.lineTo(rx, ry - 30);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // DGPS Rover antenna dish & pole
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(rx, ry - 30, 8, 0, Math.PI, true); // Dish top
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.fillRect(rx - 8, ry - 30, 16, 4);

    // Pole stem
    ctx.strokeStyle = '#0b1a30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rx, ry - 26);
    ctx.lineTo(rx, ry + 35);
    ctx.stroke();

    // Pulse Ring on Ground Tip
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    const pulseR = (frame % 40) * 0.4;
    ctx.beginPath();
    ctx.arc(rx, ry + 35, pulseR, 0, Math.PI * 2);
    ctx.stroke();

    // Coordinates Box
    const lat = (11.9562 + Math.sin(frame * 0.05) * 0.00001).toFixed(6);
    const lng = (78.9641 + Math.cos(frame * 0.05) * 0.00001).toFixed(6);
    const elev = (124.58 + Math.sin(frame * 0.03) * 0.02).toFixed(2);

    ctx.fillStyle = 'rgba(7, 21, 39, 0.85)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillRect(15, 120, 130, 65);
    ctx.strokeRect(15, 120, 130, 65);

    ctx.fillStyle = '#00d2ff';
    ctx.font = '700 8.5px Outfit, sans-serif';
    ctx.fillText('RTK SATELLITE FIX', 22, 134);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText(`LAT:  ${lat}° N`, 22, 147);
    ctx.fillText(`LNG:  ${lng}° E`, 22, 160);
    ctx.fillText(`ELEV: ${elev} m`, 22, 173);

    drawTelemetryBadge(ctx, 10, 20, 'GNSS DGPS FIX: 18 SATELLITES CONNECTED');

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════════
   3. DRONE SURVEY & MAPPING ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initDroneCanvas() {
  const sys = setupCanvas('canvas-drone');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    // Drone flight X position
    const dx = 80 + (frame % 200) * 1.0;
    const dy = 35 + Math.sin(frame * 0.05) * 4;

    // Scan cone onto ground
    ctx.fillStyle = 'rgba(0, 210, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(dx, dy + 6);
    ctx.lineTo(dx - 55, 170);
    ctx.lineTo(dx + 55, 170);
    ctx.closePath();
    ctx.fill();

    // Laser scan lines
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dx, dy + 6);
    ctx.lineTo(dx - 55, 170);
    ctx.moveTo(dx, dy + 6);
    ctx.lineTo(dx + 55, 170);
    ctx.stroke();

    // Ground point cloud grid
    for (let x = 40; x < width - 40; x += 16) {
      for (let y = 135; y < 185; y += 12) {
        const dist = Math.abs(x - dx);
        if (dist < 60) {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(x, y + Math.sin(x + frame * 0.1) * 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Drone body & spinning props
    ctx.fillStyle = '#0b1a30';
    ctx.fillRect(dx - 12, dy - 4, 24, 8);
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(dx, dy - 2, 4, 0, Math.PI * 2); ctx.fill();

    // Arms & Rotors
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dx - 18, dy - 8); ctx.lineTo(dx + 18, dy + 8);
    ctx.moveTo(dx - 18, dy + 8); ctx.lineTo(dx + 18, dy - 8);
    ctx.stroke();

    // Spinning rotor blur
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
    const propBlur = (frame % 2 === 0) ? 8 : 10;
    ctx.beginPath();
    ctx.arc(dx - 18, dy - 8, propBlur, 0, Math.PI * 2);
    ctx.arc(dx + 18, dy - 8, propBlur, 0, Math.PI * 2);
    ctx.arc(dx - 18, dy + 8, propBlur, 0, Math.PI * 2);
    ctx.arc(dx + 18, dy + 8, propBlur, 0, Math.PI * 2);
    ctx.stroke();

    drawTelemetryBadge(ctx, 10, 20, 'DRONE PHOTOGRAMMETRY: ORTHOMOSAIC SCANNING');

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════════
   4. LAND BOUNDARY ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initBoundaryCanvas() {
  const sys = setupCanvas('canvas-boundary');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    const corners = [
      { x: 80, y: 55, label: 'A (0, 0)' },
      { x: 270, y: 45, label: 'B (120m, 0)' },
      { x: 300, y: 155, label: 'C (135m, 85m)' },
      { x: 70, y: 165, label: 'D (0m, 90m)' }
    ];

    const progress = (frame % 180) / 180;

    // Draw boundary line filling in clockwise
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);

    const totalSegs = corners.length;
    const currentSeg = progress * totalSegs;

    for (let i = 0; i < totalSegs; i++) {
      const p1 = corners[i];
      const p2 = corners[(i + 1) % totalSegs];

      if (currentSeg >= i + 1) {
        ctx.lineTo(p2.x, p2.y);
      } else if (currentSeg > i) {
        const subFrac = currentSeg - i;
        ctx.lineTo(p1.x + (p2.x - p1.x) * subFrac, p1.y + (p2.y - p1.y) * subFrac);
      }
    }

    if (progress > 0.95) {
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.fill();
    }
    ctx.stroke();

    // Corner pins & dimensions
    corners.forEach((c, idx) => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(c.x, c.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Inter, sans-serif';
      ctx.fillText(c.label, c.x - 15, c.y - 8);
    });

    // Area calculation overlay
    if (progress > 0.8) {
      ctx.fillStyle = '#00d2ff';
      ctx.font = '700 9px Outfit, sans-serif';
      ctx.fillText('TOTAL AREA: 24.5 CENTS (10,670 SQ.FT)', 90, 110);
    }

    drawTelemetryBadge(ctx, 10, 20, 'LAND BOUNDARY VERIFICATION & CALCULATIONS');

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════════
   5. 3D TERRAIN & CONTOUR ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initTerrainCanvas() {
  const sys = setupCanvas('canvas-terrain');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    const cols = 12, rows = 8;
    const cellW = width / (cols + 1);
    const cellH = height / (rows + 1);

    // Dynamic 3D elevation mesh
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const x = (c + 1) * cellW;
        const elev = Math.sin(c * 0.5 + frame * 0.03) * Math.cos(r * 0.5 + frame * 0.03) * 18;
        const y = (r + 1) * cellH - elev;

        if (c === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Color coding by elevation
        const colorRatio = (elev + 18) / 36;
        ctx.fillStyle = colorRatio > 0.6 ? '#ef4444' : colorRatio > 0.3 ? '#10b981' : '#0077ff';
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    drawTelemetryBadge(ctx, 10, 20, '3D DIGITAL ELEVATION MODEL (DEM) & CONTOURS');

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════════════════════════
   6. CAD & GIS DIGITAL MAPPING ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function initMappingCanvas() {
  const sys = setupCanvas('canvas-mapping');
  if (!sys) return;
  const { ctx, width, height } = sys;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    // CAD Blueprint background
    ctx.strokeStyle = 'rgba(0, 119, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, width - 60, height - 50);

    // Tracing cursor X, Y
    const cx = 40 + (frame % 260);
    const cy = 60 + Math.sin(frame * 0.04) * 40;

    // Crosshair
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
    ctx.stroke();

    // Layer checkboxes box
    ctx.fillStyle = 'rgba(7, 21, 39, 0.85)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.fillRect(40, 45, 120, 55);
    ctx.strokeRect(40, 45, 120, 55);

    ctx.fillStyle = '#10b981';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('[✓] SURVEY POINTS', 46, 58);
    ctx.fillText('[✓] PATTA SUB-DIVISION', 46, 70);
    ctx.fillText('[✓] GIS SPATIAL LAYERS', 46, 82);

    drawTelemetryBadge(ctx, 10, 20, 'AUTOCAD 2D/3D & GIS SPATIAL DATA INTEGRATION');

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

// Common grid drawer
function drawGrid(ctx, w, h) {
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}

// Telemetry badge drawer
function drawTelemetryBadge(ctx, x, y, text) {
  ctx.fillStyle = 'rgba(7, 21, 39, 0.85)';
  ctx.fillRect(x, y - 12, 280, 16);
  ctx.fillStyle = '#10b981';
  ctx.font = '700 8px Outfit, sans-serif';
  ctx.fillText(text, x + 6, y);
}
