const PALETTE = {
  white: "#f8f8ee",
  red: "#ef2c18",
  orange: "#ffa51d",
  yellow: "#ffbc2e",
  green: "#33a948",
  blue: "#285bd7"
};

let animating = true;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent("sketch-holder");
  pixelDensity(1);
  noStroke();
}

function draw() {
  const time = animating ? frameCount * 0.04 : 0;
  drawPainting(0, 0, 400, time);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    animating = !animating;
  }
}

function drawPainting(x, y, size, time) {
  const band = size * 0.053;
  const inner = size - band * 2;
  const gutter = band;
  const cell = (inner - gutter) / 2;
  const left = x + band;
  const top = y + band;
  const right = left + cell + gutter;
  const bottom = top + cell + gutter;

  fill(PALETTE.red);
  rect(x, y, band, size - band);
  fill(PALETTE.blue);
  rect(x + band, y, size - band, band);
  fill(PALETTE.green);
  rect(x + size - band, y + band, band, size - band);
  fill(PALETTE.orange);
  rect(x, y + size - band, size - band, band);

  drawCell(left, top, cell, 0, time, [
    [PALETTE.blue, PALETTE.orange, PALETTE.red, PALETTE.green],
    [PALETTE.green, PALETTE.blue, PALETTE.orange, PALETTE.red],
    [PALETTE.red, PALETTE.green, PALETTE.blue, PALETTE.yellow],
    [PALETTE.white, PALETTE.orange, PALETTE.green, PALETTE.blue]
  ]);

  drawCell(right, top, cell, 1, time, [
    [PALETTE.orange, PALETTE.green, PALETTE.red, PALETTE.blue],
    [PALETTE.blue, PALETTE.yellow, PALETTE.green, PALETTE.red],
    [PALETTE.red, PALETTE.blue, PALETTE.orange, PALETTE.green],
    [PALETTE.white, PALETTE.orange, PALETTE.blue, PALETTE.red]
  ]);

  drawCell(left, bottom, cell, 2, time, [
    [PALETTE.orange, PALETTE.yellow, PALETTE.blue, PALETTE.green],
    [PALETTE.green, PALETTE.orange, PALETTE.red, PALETTE.red],
    [PALETTE.blue, PALETTE.yellow, PALETTE.green, PALETTE.orange],
    [PALETTE.white, PALETTE.red, PALETTE.green, PALETTE.blue]
  ]);

  drawCell(right, bottom, cell, 3, time, [
    [PALETTE.green, PALETTE.red, PALETTE.orange, PALETTE.blue],
    [PALETTE.blue, PALETTE.green, PALETTE.red, PALETTE.yellow],
    [PALETTE.orange, PALETTE.blue, PALETTE.green, PALETTE.red],
    [PALETTE.white, PALETTE.blue, PALETTE.red, PALETTE.orange]
  ]);

  drawCentralBands(left + cell, top, gutter, cell, time);
  drawHorizontalBands(left, top + cell, cell, gutter, time);
}

function drawCentralBands(x, y, w, cell, time) {
  const shimmer = animating ? sin(time * 1.2) * 1.4 : 0;

  fill(PALETTE.red);
  rect(x, y, w, cell + shimmer);
  fill(PALETTE.orange);
  rect(x + w * 0.48, y, w * 0.52, cell + shimmer);

  fill(PALETTE.blue);
  rect(x, y + cell + w, w, cell - shimmer);
  fill(PALETTE.green);
  rect(x + w * 0.48, y + cell + w, w * 0.52, cell - shimmer);
}

function drawHorizontalBands(x, y, cell, h, time) {
  const shimmer = animating ? cos(time * 1.1) * 1.2 : 0;

  fill(PALETTE.green);
  rect(x, y, cell + shimmer, h);
  fill(PALETTE.blue);
  rect(x + cell, y, h, h);

  fill(PALETTE.red);
  rect(x + cell + h, y, cell - shimmer, h);
  fill(PALETTE.blue);
  rect(x + cell + h, y + h * 0.5, cell - shimmer, h * 0.5);
}

function drawCell(x, y, size, index, time, layers) {
  const strip = size / 8;
  const hover = constrain(1 - dist(mouseX, mouseY, x + size / 2, y + size / 2) / 135, 0, 1);
  const pulse = animating ? sin(time + index * 0.85) * 1.1 : 0;

  push();
  translate(x, y);

  for (let i = 0; i < layers.length; i++) {
    const inset = i * strip;
    const span = size - inset * 2;
    const move = (pulse + hover * 2) * (i / layers.length);
    const colors = layers[i];

    fill(colors[0]);
    rect(inset, inset, span, strip + move);

    fill(colors[1]);
    rect(inset + span - strip - move, inset + strip, strip + move, span - strip);

    fill(colors[2]);
    rect(inset, inset + span - strip - move, span - strip, strip + move);

    fill(colors[3]);
    rect(inset, inset + strip, strip + move, span - strip * 2);
  }

  const center = size / 2;
  const core = strip * (0.95 + hover * 0.35 + (animating ? sin(time * 1.7 + index) * 0.06 : 0));
  fill(PALETTE.white);
  rect(center - core / 2, center - core / 2, core, core);

  if (hover > 0.02 || animating) {
    fill(255, 255, 245, 34 + hover * 45);
    rect(0, 0, size, size);
  }

  pop();
}
