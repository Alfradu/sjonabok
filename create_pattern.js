var tool = 'draw';
var down = false;
var activeColor = "1";
var template = {
    "page": 0,
    "size_x": 0,
    "size_y": 0,
    "behaviour": "no-repeat",
    "flipX": false,
    "flipY": false,
    "overlap": {
        "x": 0,
        "y": 0
    },
    "rotation": 0,
    "pattern": "",
    "colors": {
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": ""
    }
}
var palette = {
    "1": "#949f9c",
    "2": "#8c9899",
    "3": "#2e261f",
    "4": "#60615f",
    "5": "#e0dad3"
}
document.getElementById("color1Btn").style.backgroundColor = palette["1"];
document.getElementById("color2Btn").style.backgroundColor = palette["2"];
document.getElementById("color3Btn").style.backgroundColor = palette["3"];
document.getElementById("color4Btn").style.backgroundColor = palette["4"];

var stillclicking = false;
document.getElementById("drawImg").style.opacity = "0.1";
document.getElementById("drawBtn").style.borderWidth = "2px";
document.getElementById("drawBtn").style.borderColor = "red";
document.getElementById("color" + activeColor + "Btn").style.borderWidth = "3px";
document.getElementById("color" + activeColor + "Btn").style.borderColor = "red";

var grid_width = parseInt(document.getElementById("gridx").value);
var grid_height = grid_width;
var canvas = document.getElementById("canvas");
var canvasCtx = canvas.getContext("2d");
canvas.width = grid_width * 10;
canvas.height = grid_height * 10;
var width = canvas.width;
var height = canvas.height;
canvasCtx.fillStyle = palette["5"];
canvasCtx.fillRect(0, 0, width, height);
canvasCtx.fillStyle = palette["1"];

document.addEventListener('mouseup', () => {
    down = false;
    stillclicking = false;
}, 0);
canvas.addEventListener('mouseout', () => {
    down = false;
}, 0);
canvas.addEventListener('mouseover', () => {
    if (stillclicking) down = true;
}, 0);
canvas.addEventListener('mousemove', (e) => {
    if (!down) return;
    if (tool == 'draw') draw(canvas.getBoundingClientRect(), e);
    else erase(canvas.getBoundingClientRect(), e);
}, 0);
canvas.addEventListener('mousedown', (e) => {
    down = true;
    stillclicking = true;
    if (tool == 'draw') draw(canvas.getBoundingClientRect(), e);
    else erase(canvas.getBoundingClientRect(), e);
}, 0);

const drawBtn = document.getElementById('drawBtn');
drawBtn.addEventListener("click", () => {
    if (tool != 'draw') {
        tool = 'draw';
        document.getElementById("drawImg").style.opacity = "0.1"
        document.getElementById("drawBtn").style.borderWidth = "2px";
        document.getElementById("drawBtn").style.borderColor = "red";

        document.getElementById("eraseImg").style.opacity = "1"
        document.getElementById("eraseBtn").style.borderWidth = "0px";
    }
});

const eraseBtn = document.getElementById('eraseBtn');
eraseBtn.addEventListener("click", () => {
    if (tool != 'erase') {
        tool = 'erase';
        document.getElementById("eraseImg").style.opacity = "0.1"
        document.getElementById("eraseBtn").style.borderWidth = "2px";
        document.getElementById("eraseBtn").style.borderColor = "red";

        document.getElementById("drawImg").style.opacity = "1"
        document.getElementById("drawBtn").style.borderWidth = "0px";
    }
});

const color1Btn = document.getElementById('color1Btn');
color1Btn.addEventListener("click", () => { changeActiveColor("1") });
const color2Btn = document.getElementById('color2Btn');
color2Btn.addEventListener("click", () => { changeActiveColor("2") });
const color3Btn = document.getElementById('color3Btn');
color3Btn.addEventListener("click", () => { changeActiveColor("3") });
const color4Btn = document.getElementById('color4Btn');
color4Btn.addEventListener("click", () => { changeActiveColor("4") });

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener("click", () => {
    save();
});

const deleteBtn = document.getElementById('delBtn');
deleteBtn.addEventListener("click", () => {
    clearCanvas();
});

const gridBtn = document.getElementById('gridBtn');
gridBtn.addEventListener("click", () => {
    updateSize();
});

function draw(boundingClientRect, e) {
    var x = e.clientX - boundingClientRect.left;
    var y = e.clientY - boundingClientRect.top;
    x = Math.floor(grid_width * x / canvas.clientWidth);
    y = Math.floor(grid_height * y / canvas.clientHeight);
    if (x >= 0 && x < width && y >= 0 && y < height) {
        var clampx = Math.floor(x * (width / grid_width));
        var clampy = Math.floor(y * (height / grid_height));
        var clampw = Math.floor(width / grid_width);
        var clamph = Math.floor(height / grid_height);
        canvasCtx.fillRect(clampx, clampy, clampw, clamph);
    }
}

function erase(boundingClientRect, e) {
    var tempColor = canvasCtx.fillStyle;
    canvasCtx.fillStyle = palette["5"];
    this.draw(boundingClientRect, e);
    canvasCtx.fillStyle = tempColor;
}

function clearCanvas() {
    canvasCtx.fillStyle = palette["5"];
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = palette[activeColor];
}

function updateSize() {
    grid_width = parseInt(document.getElementById("gridx").value);
    grid_height = grid_width;
    canvas.width = grid_width * 10;
    canvas.height = grid_height * 10;
    width = canvas.width;
    height = canvas.height;
    clearCanvas();
}

function changeActiveColor(color) {
    if (color == activeColor) return;
    canvasCtx.fillStyle = palette[color];
    document.getElementById("color" + color + "Btn").style.borderWidth = "3px";
    document.getElementById("color" + color + "Btn").style.borderColor = "red";

    document.getElementById("color" + activeColor + "Btn").style.borderWidth = "0px";
    activeColor = color;
}

function save() {
    var data = canvasCtx.getImageData(0, 0, width, height).data;
    var colorNumbers = data.length / 4;
    var rowNumbers = colorNumbers / width;
    var count = 0;
    var pattern = "";
    for (let i = 0; i < data.length; i += 40) {
        count++
        if (count <= grid_width) {
            r = (data[i] | 1 << 8).toString(16).slice(1);
            g = (data[i + 1] | 1 << 8).toString(16).slice(1);
            b = (data[i + 2] | 1 << 8).toString(16).slice(1);
            // a = (data[i + 3] | 1 << 8).toString(16).slice(1);
            pattern += Object.keys(palette).find(key => palette[key] === "#" + r + g + b) || "0";
        }
        if (count >= rowNumbers) count = 0;
    }
    template.size_x = grid_width;
    template.size_y = grid_height;
    template.pattern = pattern;
    template.colors = palette;
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", "pattern.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}