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
  drawQuadrant(200, 20, H, 1);
  drawQuadrant(20, 200, H, 2);
  drawQuadrant(200, 200, H, 3);
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


    let lc = PALETTE[(2 + ring) % 4]; // Azul
    let tc = PALETTE[(1 + ring) % 4]; // Laranja
    let rc = PALETTE[(0 + ring) % 4]; // Vermelho
    let bc = PALETTE[(3 + ring) % 4]; // Verde
    if (quadrant == 1) {
      lc = PALETTE[(1 + ring) % 4]; // Laranja
      tc = PALETTE[(3 + ring) % 4]; // Verde
      rc = PALETTE[(0 + ring) % 4]; // Vermelho
      bc = PALETTE[(2 + ring) % 4]; // Azul
    } else if (quadrant == 2) {
      lc = PALETTE[(3 + ring) % 4];
      tc = PALETTE[(1 + ring) % 4];
      rc = PALETTE[(2 + ring) % 4];
      bc = PALETTE[(0 + ring) % 4];
    } else if (quadrant == 3) {
      lc = PALETTE[(3 + ring) % 4]; // Verde
      tc = PALETTE[(0 + ring) % 4]; // Vermelho
      rc = PALETTE[(1 + ring) % 4]; // Laranja
      bc = PALETTE[(2 + ring) % 4]; // Azul
    }

    // Draw order creates spiral corner overlap per quadrant
    if (ring === 0) {
      // TL: left strip on top → spiral from top-left corner
      fill(bc); rect(x + sw, y + s - sw, s - sw, sw);
      fill(rc); rect(x + s - sw, y, sw, s - sw);
      fill(tc); rect(x, y, s - sw, sw);
      fill(lc); rect(x, y + sw, sw, s - sw);
    } else {
      fill(bc); rect(x, y + s - sw, s - sw, sw);
      fill(rc); rect(x + s - sw, y + sw, sw, s - sw);
      fill(tc); rect(x + sw, y, s - sw, sw);
      fill(lc); rect(x, y, sw, s - sw);
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
