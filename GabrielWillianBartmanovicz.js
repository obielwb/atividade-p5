// GabrielWillianBartmanovicz.js
// Reprodução de pintura geométrica abstrata — log cabin spirals (Max Bill, 1969)
// Interação: clique para rotacionar as cores / tecla para animação contínua

const RED    = [220, 50, 32];
const BLUE   = [30, 90, 200];
const GREEN  = [40, 150, 55];
const ORANGE = [235, 160, 20];
const WHITE  = [255, 255, 255];

const PALETTE = [RED, ORANGE, BLUE, GREEN];

let colorShift = 0;
let targetShift = 0;
let autoAnimate = false;

function setup() {
  createCanvas(400, 400);
  noStroke();
  frameRate(60);
}

function draw() {
  background(240);
  colorShift = lerp(colorShift, targetShift, 0.05);
  if (autoAnimate) {
    targetShift += 0.008;
  }
  drawFullPainting();
}

function getCol(idx) {
  let i = ((idx + Math.floor(colorShift)) % 4 + 4) % 4;
  return PALETTE[i];
}

function drawFullPainting() {
  let S = 400;
  let H = S / 2;
  let NUM = 6;
  let sw = H / (NUM * 2);

  // Top-Left quadrant
  drawLogCabin(0, 0, H, NUM, sw, 0);
  // Top-Right quadrant  
  drawLogCabin(H, 0, H, NUM, sw, 1);
  // Bottom-Left quadrant
  drawLogCabin(0, H, H, NUM, sw, 2);
  // Bottom-Right quadrant
  drawLogCabin(H, H, H, NUM, sw, 3);
}

// Log cabin block drawing
// Each ring has 4 strips. Colors shift by +1 each ring inward.
// The quadrant parameter controls the spiral direction via draw order.
function drawLogCabin(qx, qy, qSize, numRings, sw, quadrant) {
  for (let ring = 0; ring < numRings; ring++) {
    let inset = ring * sw;
    let s = qSize - inset * 2;
    if (s <= sw) break;

    let x = qx + inset;
    let y = qy + inset;

    // Color indices for this ring — shift by ring number
    // Base assignment for TL: left=RED(0), top=ORANGE(1), right=BLUE(2), bottom=GREEN(3)
    let li, ti, ri, bi;

    if (quadrant === 0) {
      // Top-Left: spiral clockwise inward
      ti = (1 + ring) % 4;
      ri = (2 + ring) % 4;
      bi = (3 + ring) % 4;
      li = (0 + ring) % 4;
    } else if (quadrant === 1) {
      // Top-Right: mirror of TL horizontally
      ti = (2 + ring) % 4;
      li = (1 + ring) % 4;
      bi = (0 + ring) % 4;
      ri = (3 + ring) % 4;
    } else if (quadrant === 2) {
      // Bottom-Left: mirror of TL vertically
      bi = (0 + ring) % 4;
      ri = (1 + ring) % 4;
      ti = (2 + ring) % 4;
      li = (3 + ring) % 4;
    } else {
      // Bottom-Right: mirror of TL both axes
      bi = (3 + ring) % 4;
      li = (2 + ring) % 4;
      ti = (1 + ring) % 4;
      ri = (0 + ring) % 4;
    }

    let tc = getCol(ti);
    let rc = getCol(ri);
    let bc = getCol(bi);
    let lc = getCol(li);

    // Draw strips in order that creates spiral corner overlap
    if (quadrant === 0) {
      // TL: left strip dominates TL corner
      fill(bc); rect(x, y + s - sw, s, sw);       // bottom
      fill(rc); rect(x + s - sw, y, sw, s);        // right (over bottom BR)
      fill(tc); rect(x, y, s, sw);                 // top (over right TR)
      fill(lc); rect(x, y, sw, s);                 // left (over top TL, over bottom BL)
    } else if (quadrant === 1) {
      // TR: right strip dominates TR corner
      fill(bc); rect(x, y + s - sw, s, sw);        // bottom
      fill(lc); rect(x, y, sw, s);                 // left (over bottom BL)
      fill(tc); rect(x, y, s, sw);                 // top (over left TL)
      fill(rc); rect(x + s - sw, y, sw, s);        // right (over top TR, over bottom BR)
    } else if (quadrant === 2) {
      // BL: left strip dominates BL corner
      fill(tc); rect(x, y, s, sw);                 // top
      fill(rc); rect(x + s - sw, y, sw, s);        // right (over top TR)
      fill(bc); rect(x, y + s - sw, s, sw);        // bottom (over right BR)
      fill(lc); rect(x, y, sw, s);                 // left (over bottom BL, over top TL)
    } else {
      // BR: right strip dominates BR corner
      fill(tc); rect(x, y, s, sw);                 // top
      fill(lc); rect(x, y, sw, s);                 // left (over top TL)
      fill(bc); rect(x, y + s - sw, s, sw);        // bottom (over left BL)
      fill(rc); rect(x + s - sw, y, sw, s);        // right (over bottom BR, over top TR)
    }
  }

  // White center square
  let ci = numRings * sw;
  let cs = qSize - ci * 2;
  if (cs > 0) {
    fill(WHITE);
    rect(qx + ci, qy + ci, cs, cs);
  }
}

// Click: advance color cycle
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    targetShift += 1;
  }
}

// Key: toggle continuous animation
function keyPressed() {
  autoAnimate = !autoAnimate;
}
