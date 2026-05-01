// GabrielWillianBartmanovicz.js
// Reprodução de pintura geométrica abstrata — log cabin spirals (Max Bill, 1969)
// Interação: clique na imagem para girar as espirais

const RED = [220, 50, 32];
const BLUE = [30, 90, 200];
const GREEN = [40, 150, 55];
const ORANGE = [235, 160, 20];
const WHITE = [255, 255, 255];

// Paleta: 0=VERMELHO, 1=LARANJA, 2=AZUL, 3=VERDE
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
  // Interpolação suave em direção à rotação alvo
  rotationAngle = lerp(rotationAngle, targetAngle, 0.2);
  drawFullPainting();
}

function drawFullPainting() {
  // Desenha a moldura externa
  let x = 0;
  let y = 0;
  let s = 400;
  let sw = 20;

  fill(ORANGE); rect(x, y + s - sw, s - sw, sw);      // baixo
  fill(GREEN); rect(x + s - sw, y + sw, sw, s - sw); // direita
  fill(BLUE); rect(x + sw, y, s - sw, sw);          // topo
  fill(RED); rect(x, y, sw, s - sw);               // esquerda

  let H = 180;
  drawQuadrant(20, 20, H, 0);
  drawQuadrant(200, 20, H, 1);
  drawQuadrant(20, 200, H, 2);
  drawQuadrant(200, 200, H, 3);
}

function drawQuadrant(qx, qy, qSize, quadrant) {
  // 5 anéis coloridos + 1 quadrado central branco (= 11 unidades por lado)
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


    // Cores base para cada quadrante: [Topo, Direita, Baixo, Esquerda]
    const baseColors = [
      [1, 0, 3, 2], // Quadrante 0
      [3, 0, 2, 1], // Quadrante 1
      [1, 2, 0, 3], // Quadrante 2
      [0, 1, 2, 3]  // Quadrante 3
    ];

    let qBase = baseColors[quadrant];

    // Desloca as cores ciclicamente com base na profundidade do anel
    // T recebe o L anterior, R recebe o T anterior, etc.
    let tc_idx = qBase[(0 - (ring % 4) + 4) % 4];
    let rc_idx = qBase[(1 - (ring % 4) + 4) % 4];
    let bc_idx = qBase[(2 - (ring % 4) + 4) % 4];
    let lc_idx = qBase[(3 - (ring % 4) + 4) % 4];

    let tc = PALETTE[tc_idx];
    let rc = PALETTE[rc_idx];
    let bc = PALETTE[bc_idx];
    let lc = PALETTE[lc_idx];

    // A ordem de desenho cria a sobreposição dos cantos da espiral por quadrante
    if (ring === 0) {
      // SE: faixa esquerda no topo -> espiral a partir do canto superior esquerdo
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

  // Quadrado central branco
  let ci = NUM * sw;
  let cs = qSize - ci * 2;
  if (cs > 0) {
    fill(WHITE);
    rect(qx + ci, qy + ci, cs, cs);
  }

  pop();
}

// Clicar no canvas aciona uma rotação de 90°
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    targetAngle += HALF_PI;
  }
}
