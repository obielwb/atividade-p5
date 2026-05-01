// GabrielWillianBartmanovicz.js
// Reprodução de pintura geométrica abstrata — log cabin spirals (Max Bill, 1969)
// Interação: clique para animar rotação / tecla para animação contínua

const RED    = [220, 50, 32];
const BLUE   = [30, 90, 200];
const GREEN  = [40, 150, 55];
const ORANGE = [235, 160, 20];
const WHITE  = [255, 255, 255];

// Palette: 0=RED, 1=ORANGE, 2=BLUE, 3=GREEN
const PALETTE = [RED, ORANGE, BLUE, GREEN];

// Animation: rotation per quadrant
let rotationAngle = 0;
let targetAngle = 0;
let autoAnimate = false;

function setup() {
  createCanvas(400, 400);
  noStroke();
  frameRate(60);
}

function draw() {
  background(240);
  rotationAngle = lerp(rotationAngle, targetAngle, 0.04);
  if (autoAnimate) {
    targetAngle += 0.015;
  }
  drawFullPainting();
}

function drawFullPainting() {
  let H = 200;
  drawQuadrant(0, 0, H, 0);
  drawQuadrant(H, 0, H, 1);
  drawQuadrant(0, H, H, 2);
  drawQuadrant(H, H, H, 3);
}

function drawQuadrant(qx, qy, qSize, quadrant) {
  let NUM = 6;
  let sw = qSize / (NUM * 2);

  let direction = (quadrant === 0 || quadrant === 3) ? 1 : -1;
  let angle = rotationAngle * direction;

  push();
  let cx = qx + qSize / 2;
  let cy = qy + qSize / 2;
  translate(cx, cy);
  rotate(angle);
  translate(-cx, -cy);

  for (let ring = 0; ring < NUM; ring++) {
    let inset = ring * sw;
    let s = qSize - inset * 2;
    if (s <= sw) break;

    let x = qx + inset;
    let y = qy + inset;

    let lc, tc, rc, bc;

    if (quadrant === 0) {
      // Top-Left: L=Orange, T=Blue, R=Green, B=Red; colors shift +1 per ring
      lc = PALETTE[(1 + ring) % 4];
      tc = PALETTE[(2 + ring) % 4];
      rc = PALETTE[(3 + ring) % 4];
      bc = PALETTE[(0 + ring) % 4];
    } else if (quadrant === 1) {
      // Top-Right: L=Blue, T=Green, R=Red, B=Orange; shift +1 per ring
      lc = PALETTE[(2 + ring) % 4];
      tc = PALETTE[(3 + ring) % 4];
      rc = PALETTE[(0 + ring) % 4];
      bc = PALETTE[(1 + ring) % 4];
    } else if (quadrant === 2) {
      // Bottom-Left: L=Red, T=Green, R=Blue, B=Orange; shift -1 per ring
      lc = PALETTE[((0 - ring) % 4 + 4) % 4];
      tc = PALETTE[((3 - ring) % 4 + 4) % 4];
      rc = PALETTE[((2 - ring) % 4 + 4) % 4];
      bc = PALETTE[((1 - ring) % 4 + 4) % 4];
    } else {
      // Bottom-Right: L=Orange, T=Red, R=Green, B=Blue; shift -1 per ring
      lc = PALETTE[((1 - ring) % 4 + 4) % 4];
      tc = PALETTE[((0 - ring) % 4 + 4) % 4];
      rc = PALETTE[((3 - ring) % 4 + 4) % 4];
      bc = PALETTE[((2 - ring) % 4 + 4) % 4];
    }

    // Draw strips — order controls which strip overlaps at the spiral corner
    if (quadrant === 0) {
      fill(bc); rect(x, y + s - sw, s, sw);
      fill(rc); rect(x + s - sw, y, sw, s);
      fill(tc); rect(x, y, s, sw);
      fill(lc); rect(x, y, sw, s);
    } else if (quadrant === 1) {
      fill(bc); rect(x, y + s - sw, s, sw);
      fill(lc); rect(x, y, sw, s);
      fill(tc); rect(x, y, s, sw);
      fill(rc); rect(x + s - sw, y, sw, s);
    } else if (quadrant === 2) {
      fill(tc); rect(x, y, s, sw);
      fill(rc); rect(x + s - sw, y, sw, s);
      fill(bc); rect(x, y + s - sw, s, sw);
      fill(lc); rect(x, y, sw, s);
    } else {
      fill(tc); rect(x, y, s, sw);
      fill(lc); rect(x, y, sw, s);
      fill(bc); rect(x, y + s - sw, s, sw);
      fill(rc); rect(x + s - sw, y, sw, s);
    }
  }

  // White center
  let ci = NUM * sw;
  let cs = qSize - ci * 2;
  if (cs > 0) {
    fill(WHITE);
    rect(qx + ci, qy + ci, cs, cs);
  }

  pop();
}

// Click: rotate spirals 90°
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    targetAngle += HALF_PI;
  }
}

// Key: toggle continuous rotation
function keyPressed() {
  autoAnimate = !autoAnimate;
}
