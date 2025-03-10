// -------------------------------------------------------------
// -------------------------- Globals --------------------------
// -------------------------------------------------------------

let page = "main";
let pattern;

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// -------------------------------------------------------------
// ---------------- Generate Pattern Elements ------------------
// -------------------------------------------------------------

const origCanvas = document.createElement("canvas");
const origCanvasCtx = origCanvas.getContext("2d");
const scale = document.getElementById("scale");
const patternSize = document.getElementById("size");
const fileSelector = document.getElementById("fileinput");
const generateSaveBtn = document.getElementById("saveImgBtn");

// -------------------------------------------------------------
// ----------------- Create Pattern Elements -------------------
// -------------------------------------------------------------

const drawBtn = document.getElementById("drawBtn");
const drawImg = document.getElementById("drawImg");
const eraseBtn = document.getElementById("eraseBtn");
const eraseImg = document.getElementById("eraseImg");
const fillBtn = document.getElementById("fillBtn");
const fillImg = document.getElementById("fillImg");
const paletteBtn = document.getElementById("colorPalette");
const color1Btn = document.getElementById("color1Btn");
const color2Btn = document.getElementById("color2Btn");
const color3Btn = document.getElementById("color3Btn");
const color4Btn = document.getElementById("color4Btn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("delBtn");
const gridBtn = document.getElementById("gridBtn");
const drawingcanvas = document.getElementById("canvas");
const canvasCtx = drawingcanvas.getContext("2d");

// -------------------------------------------------------------
// ----------------- Generate Pattern Globals ------------------
// -------------------------------------------------------------

let scaleNumber = parseInt(scale.value);
let behaviour;
let overlapX;
let overlapY;
let flipX;
let flipY;
let imageSizeX = window.innerWidth;
let imageSizeY = window.innerHeight;
let imageData;

// -------------------------------------------------------------
// ------------------ Create Pattern Globals -------------------
// -------------------------------------------------------------

let gridWidth = parseInt(document.getElementById("gridx").value);
let gridHeight = gridWidth;
var tool = "draw";
var down = false;
var activeColor = "1";
var stillclicking = false;
var template = {
  page: 0,
  size_x: 0,
  size_y: 0,
  behaviour: "repeat",
  flipX: false,
  flipY: false,
  overlap: {
    x: 0,
    y: 0,
  },
  rotation: 0,
  pattern: "",
  colors: {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  },
};
var chosenPalette = 1;
var palette = {
  1: {
    1: "#825a3f",
    2: "#5e3427",
    3: "#352e21",
    4: "#4b4031",
    5: "#b4aa94",
    bg: "#d2b593",
  },
  2: {
    1: "#949f9c",
    2: "#8c9899",
    3: "#2e261f",
    4: "#60615f",
    5: "#e0dad3",
    bg: "#aea392",
  },
  3: {
    1: "#806d56",
    2: "#453423",
    3: "#22170f",
    4: "#3a3529",
    5: "#bdb399",
    bg: "#ad9c89",
  },
  4: {
    1: "#5f5938",
    2: "#575330",
    3: "#2b2416",
    4: "#30291b",
    5: "#96866e",
    bg: "#b39f7b",
  },
};

drawingcanvas.width = gridWidth * 10;
drawingcanvas.height = gridHeight * 10;
let width = drawingcanvas.width;
let height = drawingcanvas.height;
canvasCtx.fillStyle = palette[chosenPalette]["5"];
canvasCtx.fillRect(0, 0, width, height);
canvasCtx.fillStyle = palette[chosenPalette]["1"];
color1Btn.style.backgroundColor = palette[chosenPalette]["1"];
color2Btn.style.backgroundColor = palette[chosenPalette]["2"];
color3Btn.style.backgroundColor = palette[chosenPalette]["3"];
color4Btn.style.backgroundColor = palette[chosenPalette]["4"];
drawImg.style.opacity = "0.1";
drawBtn.style.borderWidth = "2px";
drawBtn.style.borderColor = "red";
document.getElementById("color" + activeColor + "Btn").style.borderWidth =
  "3px";
document.getElementById("color" + activeColor + "Btn").style.borderColor =
  "red";

// -------------------------------------------------------------
// ------------------ Generate Pattern Events ------------------
// -------------------------------------------------------------

//TODO: make input based
patternSize.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "hd":
      imageSizeX = 1920;
      imageSizeY = 1080;
      break;
    case "2k":
      imageSizeX = 2560;
      imageSizeY = 1440;
      break;
    case "4k":
      imageSizeX = 3840;
      imageSizeY = 2160;
      break;
    default:
      imageSizeX = window.innerWidth;
      imageSizeY = window.innerHeight;
      break;
  }
});
scale.addEventListener("input", (e) => {
  if (typeof pattern === "undefined") return;
  scaleNumber = parseInt(e.target.value);
  generatePattern(pattern);
  generateBg();
});
fileSelector.addEventListener("change", (event) => {
  if (event.target.files.length == 0) return;
  const fileList = event.target.files;
  const reader = new FileReader();
  reader.onload = function (e) {
    pattern = JSON.parse(e.target.result);
    generatePattern(pattern);
    generatePreview(pattern);
    generateBg();
  };
  reader.readAsText(fileList[0]);
});
window.addEventListener("resize", () => {
  if (typeof pattern === "undefined") return;
  if (imageSizeX != window.innerWidth) patternSize.value = "auto";
  generatePattern(pattern);
  generateBg();
});
generateSaveBtn.addEventListener("click", () => {
  saveImage();
});

// -------------------------------------------------------------
// ------------------- Create Pattern Events -------------------
// -------------------------------------------------------------

document.addEventListener(
  "mouseup",
  () => {
    down = false;
    stillclicking = false;
  },
  0
);
drawingcanvas.addEventListener(
  "mouseout",
  () => {
    down = false;
  },
  0
);
drawingcanvas.addEventListener(
  "mouseover",
  () => {
    if (stillclicking) down = true;
  },
  0
);
drawingcanvas.addEventListener(
  "mousemove",
  (e) => {
    if (!down) return;
    if (tool == "draw") draw(drawingcanvas.getBoundingClientRect(), e);
    else if (tool == "erase") erase(drawingcanvas.getBoundingClientRect(), e);
  },
  0
);
drawingcanvas.addEventListener(
  "mousedown",
  (e) => {
    down = true;
    stillclicking = true;
    if (tool == "draw") draw(drawingcanvas.getBoundingClientRect(), e);
    else if (tool == "erase") erase(drawingcanvas.getBoundingClientRect(), e);
    else if (tool == "fill") {
      imageData = canvasCtx.getImageData(0, 0, width, height).data;
      fill(drawingcanvas.getBoundingClientRect(), e);
    }
  },
  0
);
drawBtn.addEventListener("click", () => {
  if (tool != "draw") {
    tool = "draw";
    drawImg.style.opacity = "0.1";
    drawBtn.style.borderWidth = "2px";
    drawBtn.style.borderColor = "red";
    eraseImg.style.opacity = "1";
    eraseBtn.style.borderWidth = "0px";
    fillImg.style.opacity = "1";
    fillBtn.style.borderWidth = "0px";
  }
});
eraseBtn.addEventListener("click", () => {
  if (tool != "erase") {
    tool = "erase";
    eraseImg.style.opacity = "0.1";
    eraseBtn.style.borderWidth = "2px";
    eraseBtn.style.borderColor = "red";
    drawImg.style.opacity = "1";
    drawBtn.style.borderWidth = "0px";
    fillImg.style.opacity = "1";
    fillBtn.style.borderWidth = "0px";
  }
});
fillBtn.addEventListener("click", () => {
  if (tool != "fill") {
    tool = "fill";
    fillImg.style.opacity = "0.1";
    fillBtn.style.borderWidth = "2px";
    fillBtn.style.borderColor = "red";
    drawImg.style.opacity = "1";
    drawBtn.style.borderWidth = "0px";
    eraseImg.style.opacity = "1";
    eraseBtn.style.borderWidth = "0px";
  }
});
paletteBtn.addEventListener("change", (e) => {
  changePalette(e.target.value);
});
color1Btn.addEventListener("click", () => {
  changeActiveColor("1");
});
color2Btn.addEventListener("click", () => {
  changeActiveColor("2");
});
color3Btn.addEventListener("click", () => {
  changeActiveColor("3");
});
color4Btn.addEventListener("click", () => {
  changeActiveColor("4");
});
saveBtn.addEventListener("click", () => {
  save();
});
deleteBtn.addEventListener("click", () => {
  clearCanvas();
});
gridBtn.addEventListener("click", () => {
  updateSize();
});

// -------------------------------------------------------------
// ----------------- Generate Pattern function -----------------
// -------------------------------------------------------------

function generatePattern(json) {
  behaviour = json.behaviour;
  overlapX = json.overlap.x;
  overlapY = json.overlap.y;
  flipX = json.flipX;
  flipY = json.flipY;
  origCanvas.width = json.size_x * scaleNumber;
  origCanvas.height = json.size_y * scaleNumber;
  for (let y = 0; y < json.size_y * scaleNumber; y += scaleNumber) {
    for (let x = 0; x < json.size_x * scaleNumber; x += scaleNumber) {
      origCanvasCtx.fillStyle =
        json.colors[
          json.pattern[x / scaleNumber + (y / scaleNumber) * json.size_y]
        ];
      origCanvasCtx.fillRect(x, y, scaleNumber, scaleNumber);
    }
  }
}

function generatePreview(json) {
  const prevCanvas = document.getElementById("previewCanvas");
  prevCanvas.style.boxShadow = "0px 0px 10px 0px rgba(0, 0, 0, 0.5)";
  const prevCanvasCtx = prevCanvas.getContext("2d");
  prevCanvas.width = json.size_x * 4;
  prevCanvas.height = json.size_y * 4;
  for (let y = 0; y < json.size_y * 4; y += 4) {
    for (let x = 0; x < json.size_x * 4; x += 4) {
      prevCanvasCtx.fillStyle =
        json.colors[json.pattern[x / 4 + (y / 4) * json.size_y]];
      prevCanvasCtx.fillRect(x, y, 4, 4);
    }
  }
}

function generateBg() {
  const origCanvasFlip = document.createElement("canvas");
  origCanvasFlip.width = origCanvas.width;
  origCanvasFlip.height = origCanvas.height;
  const origCanvasFlipCtx = origCanvasFlip.getContext("2d");
  origCanvasFlipCtx.save();
  origCanvasFlipCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  origCanvasFlipCtx.drawImage(
    origCanvas,
    flipX ? -origCanvas.width : 0,
    flipY ? -origCanvas.height : 0
  );
  origCanvasFlipCtx.restore();
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const deltaOverlapX = overlapX * scaleNumber;
  const deltaOverlapY = overlapY * scaleNumber;
  tempCtx.canvas.width = origCanvas.width * 2 - deltaOverlapX * 2;
  tempCtx.canvas.height = origCanvas.height * 2 - deltaOverlapY * 2;
  tempCtx.drawImage(origCanvas, -deltaOverlapX, -deltaOverlapY);
  tempCtx.drawImage(
    origCanvasFlip,
    origCanvas.width - deltaOverlapX * 2,
    -deltaOverlapY
  );
  tempCtx.drawImage(
    origCanvasFlip,
    -deltaOverlapX,
    origCanvas.height - deltaOverlapY * 2
  );
  tempCtx.drawImage(
    origCanvas,
    origCanvas.width - deltaOverlapX * 2,
    origCanvas.height - deltaOverlapY * 2
  );
  const bigCanvas = document.getElementById("canvasBig");
  const bigCtx = bigCanvas.getContext("2d");
  bigCtx.canvas.width = imageSizeX;
  bigCtx.canvas.height = imageSizeY;
  const pattern = bigCtx.createPattern(tempCanvas, behaviour);
  bigCtx.fillStyle = pattern;
  bigCtx.fillRect(0, 0, imageSizeX, imageSizeY);
  bigCanvas.x = imageSizeX / 2;
  bigCanvas.y = imageSizeY / 2;
}

function saveImage() {
  if (typeof pattern === "undefined") return;
  const a = document.createElement("a");
  if (imageSizeX != window.innerWidth) generateBg();
  const canvas = document.getElementById("canvasBig");
  a.href = canvas.toDataURL();
  a.download = document.getElementById("name").value + ".png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// -------------------------------------------------------------
// ---------------- Create new Pattern function ----------------
// -------------------------------------------------------------

function draw(boundingClientRect, e) {
  let x = e.clientX - boundingClientRect.left;
  let y = e.clientY - boundingClientRect.top;
  x = Math.floor((gridWidth * x) / drawingcanvas.clientWidth);
  y = Math.floor((gridHeight * y) / drawingcanvas.clientHeight);
  if (x >= 0 && x < width && y >= 0 && y < height) {
    let clampx = Math.floor(x * (width / gridWidth));
    let clampy = Math.floor(y * (height / gridHeight));
    let clampw = Math.floor(width / gridWidth);
    let clamph = Math.floor(height / gridHeight);
    canvasCtx.fillRect(clampx, clampy, clampw, clamph);
  }
}

function fill(boundingClientRect, e) {
  let fillColor = "";
  let pointStack = [];
  pointStack.push({ x: e.clientX, y: e.clientY, visited: false });

  while (pointStack.some((obj) => obj.visited == false)) {
    let currVisit = pointStack.findIndex((obj) => obj.visited == false);
    if (currVisit != -1) {
      pointStack[currVisit].visited = true;
    } else {
      continue;
    }
    if (pointStack[currVisit].x < boundingClientRect.left) continue;
    if (pointStack[currVisit].x > boundingClientRect.right) continue;
    if (pointStack[currVisit].y < boundingClientRect.top) continue;
    if (pointStack[currVisit].y > boundingClientRect.bottom) continue;
    let x = Math.floor(
      (gridWidth * (pointStack[currVisit].x - boundingClientRect.left)) /
        drawingcanvas.clientWidth
    );
    let y = Math.floor(
      (gridHeight * (pointStack[currVisit].y - boundingClientRect.top)) /
        drawingcanvas.clientHeight
    );
    let index = (x * 10 + y * 10 * width) * 4;
    let r = (imageData[index] | (1 << 8)).toString(16).slice(1);
    let g = (imageData[index + 1] | (1 << 8)).toString(16).slice(1);
    let b = (imageData[index + 2] | (1 << 8)).toString(16).slice(1);
    let color = "#" + r + g + b;
    if (fillColor == "") fillColor = color;
    if (color != fillColor) {
      pointStack.splice(currVisit, 1);
      continue;
    }
    let repos = drawingcanvas.clientWidth / gridWidth;
    if (
      !pointStack.some(
        (obj) =>
          obj.x == pointStack[currVisit].x - repos &&
          obj.y == pointStack[currVisit].y
      )
    )
      pointStack.push({
        x: pointStack[currVisit].x - repos,
        y: pointStack[currVisit].y,
        visited: false,
      });
    if (
      !pointStack.some(
        (obj) =>
          obj.x == pointStack[currVisit].x + repos &&
          obj.y == pointStack[currVisit].y
      )
    )
      pointStack.push({
        x: pointStack[currVisit].x + repos,
        y: pointStack[currVisit].y,
        visited: false,
      });
    if (
      !pointStack.some(
        (obj) =>
          obj.x == pointStack[currVisit].x &&
          obj.y == pointStack[currVisit].y - repos
      )
    )
      pointStack.push({
        x: pointStack[currVisit].x,
        y: pointStack[currVisit].y - repos,
        visited: false,
      });
    if (
      !pointStack.some(
        (obj) =>
          obj.x == pointStack[currVisit].x &&
          obj.y == pointStack[currVisit].y + repos
      )
    )
      pointStack.push({
        x: pointStack[currVisit].x,
        y: pointStack[currVisit].y + repos,
        visited: false,
      });
  }
  for (let j = 0; j < pointStack.length; j++) {
    let x = Math.floor(
      (gridWidth * (pointStack[j].x - boundingClientRect.left)) /
        drawingcanvas.clientWidth
    );
    let y = Math.floor(
      (gridHeight * (pointStack[j].y - boundingClientRect.top)) /
        drawingcanvas.clientHeight
    );
    let clampx = Math.floor(x * (width / gridWidth));
    let clampy = Math.floor(y * (height / gridHeight));
    let clampw = Math.floor(width / gridWidth);
    let clamph = Math.floor(height / gridHeight);
    canvasCtx.fillRect(clampx, clampy, clampw, clamph);
  }
}

function erase(boundingClientRect, e) {
  const tempColor = canvasCtx.fillStyle;
  canvasCtx.fillStyle = palette[chosenPalette]["5"];
  this.draw(boundingClientRect, e);
  canvasCtx.fillStyle = tempColor;
}

function clearCanvas() {
  canvasCtx.fillStyle = palette[chosenPalette]["5"];
  canvasCtx.fillRect(0, 0, width, height);
  canvasCtx.fillStyle = palette[chosenPalette][activeColor];
}

function updateSize() {
  gridWidth = parseInt(document.getElementById("gridx").value);
  gridHeight = gridWidth;
  drawingcanvas.width = gridWidth * 10;
  drawingcanvas.height = gridHeight * 10;
  width = drawingcanvas.width;
  height = drawingcanvas.height;
  clearCanvas();
}

function changeActiveColor(color) {
  if (color == activeColor) return;
  canvasCtx.fillStyle = palette[chosenPalette][color];
  document.getElementById("color" + color + "Btn").style.borderWidth = "3px";
  document.getElementById("color" + color + "Btn").style.borderColor = "red";

  document.getElementById("color" + activeColor + "Btn").style.borderWidth =
    "0px";
  activeColor = color;
}

function changePalette(value) {
  chosenPalette = value;
  color1Btn.style.backgroundColor = palette[chosenPalette]["1"];
  color2Btn.style.backgroundColor = palette[chosenPalette]["2"];
  color3Btn.style.backgroundColor = palette[chosenPalette]["3"];
  color4Btn.style.backgroundColor = palette[chosenPalette]["4"];
  clearCanvas();
}

function save() {
  const data = canvasCtx.getImageData(0, 0, width, height).data;
  let count = 0;
  let pattern = "";
  for (let i = 0; i < data.length; i += 40) {
    count++;
    if (count <= gridWidth) {
      let r = (data[i] | (1 << 8)).toString(16).slice(1);
      let g = (data[i + 1] | (1 << 8)).toString(16).slice(1);
      let b = (data[i + 2] | (1 << 8)).toString(16).slice(1);
      // a = (data[i + 3] | 1 << 8).toString(16).slice(1);
      pattern +=
        Object.keys(palette[chosenPalette]).find(
          (key) => palette[chosenPalette][key] == "#" + r + g + b
        ) || "0";
    }
    if (count >= data.length / 4 / width) count = 0;
  }
  template.size_x = gridWidth;
  template.size_y = gridHeight;
  template.pattern = pattern;
  template.colors = palette[chosenPalette];
  const blob = new Blob([JSON.stringify(template, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.setAttribute("download", "pattern.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
