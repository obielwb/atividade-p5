// GabrielWillianBartmanovicz.js
// Reprodução de pintura geométrica abstrata — log cabin spirals (Max Bill, 1969)
// Interação: clique na imagem para girar as espirais

const RED = [220, 50, 32];
const BLUE = [30, 90, 200];
const GREEN = [40, 150, 55];
const ORANGE = [235, 160, 20];
const WHITE = [255, 255, 255];

// Palette: 0=RED, 1=ORANGE, 2=BLUE, 3=GREEN
const PALETTE = [RED, ORANGE, BLUE, GREEN];

let rotationAngle = 0;
let targetAngle = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
  frameRate(60);
}

function draw() {
  background(240);
  // Smooth interpolation toward target rotation
  rotationAngle = lerp(rotationAngle, targetAngle, 0.04);
  drawFullPainting();
}

function drawFullPainting() {
  let H = 180;
  drawQuadrant(20, 20, H, 0);
  // drawQuadrant(H, 20, H, 1);
  // drawQuadrant(20, H, H, 2);
  // drawQuadrant(H, H, H, 3);
}

function drawQuadrant(qx, qy, qSize, quadrant) {
  // 5 colored rings + 1 white center square (= 11 units per side)
  let NUM = 4;
  let sw = qSize / (2 * NUM + 1);

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

    // Color indices per quadrant, shifted +1 per ring inward.
    // TL: L=B(2), T=O(1), R=R(0), B=G(3)
    // TR: L=O(1), T=G(3), R=B(2), B=R(0)   (horiz mirror)
    // BL: L=G(3), T=R(0), R=O(1), B=B(2)   (vert mirror)
    // BR: L=R(0), T=B(2), R=G(3), B=O(1)   (both axes)
    let lc, tc, rc, bc;

    if (quadrant === 0) {
      // TL: spiral clockwise inward from top-left
      lc = PALETTE[(2 + ring) % 4];
      tc = PALETTE[(1 + ring) % 4];
      rc = PALETTE[(0 + ring) % 4];
      bc = PALETTE[(3 + ring) % 4];
    }

    // Draw order creates spiral corner overlap per quadrant
    if (quadrant === 0) {
      // TL: left strip on top → spiral from top-left corner
      fill(bc); rect(x + sw, y + s - sw, s - sw, sw);
      fill(rc); rect(x + s - sw, y, sw, s - sw);
      fill(tc); rect(x, y, s - sw, sw);
      fill(lc); rect(x, y + sw, sw, s - sw);
    }
  }

  // White center square
  let ci = NUM * sw;
  let cs = qSize - ci * 2;
  if (cs > 0) {
    fill(WHITE);
    rect(qx + ci, qy + ci, cs, cs);
  }

  pop();
}

// Click on canvas: trigger a smooth 90° rotation
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    targetAngle += HALF_PI;
  }
}
