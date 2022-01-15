let pattern;
var behaviour;
var overlapX;
var overlapY;
var flipX;
var flipY;
var origCanvas = document.createElement('canvas');
var origCanvasCtx = origCanvas.getContext("2d");
let imgSizeX = window.innerWidth;
let imgSizeY = window.innerHeight;
const patternSize = document.getElementById('size');
patternSize.addEventListener('change', (e) => {
    switch (e.target.value) {
        case "hd":
            imgSizeX = 1920;
            imgSizeY = 1080;
            break;
        case "2k":
            imgSizeX = 2560;
            imgSizeY = 1440;
            break;
        case "4k":
            imgSizeX = 3840;
            imgSizeY = 2160;
            break;
        default:
            imgSizeX = window.innerWidth;
            imgSizeY = window.innerHeight;
            break;
    }
});

const scale = document.getElementById('scale');
let g_scale = parseInt(scale.value);
scale.addEventListener("input", (e) => {
    if (typeof pattern === 'undefined') return;
    g_scale = parseInt(e.target.value);
    generatePattern(pattern);
    generateBg();
});

const fileSelector = document.getElementById('fileinput');
fileSelector.addEventListener('change', (event) => {
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

window.addEventListener('resize', () => {
    if (typeof pattern === 'undefined') return;
    if (imgSizeX != window.innerWidth) patternSize.value = "auto";
    generatePattern(pattern);
    generateBg();
});

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener("click", () => { saveImage(); });

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

function generatePattern(json) {
    behaviour = json.behaviour;
    overlapX = json.overlap.x;
    overlapY = json.overlap.y;
    flipX = json.flipX;
    flipY = json.flipY;
    origCanvas.width = json.size_x * g_scale;
    origCanvas.height = json.size_y * g_scale;
    for (let y = 0; y < json.size_y * g_scale; y += g_scale) {
        for (let x = 0; x < json.size_x * g_scale; x += g_scale) {
            origCanvasCtx.fillStyle = json.colors[json.pattern[x / g_scale + y / g_scale * json.size_y]];
            origCanvasCtx.fillRect(x, y, g_scale, g_scale);
        }
    }
}

function generatePreview(json) {
    var prevCanvas = document.getElementById('previewCanvas');
    prevCanvas.style.boxShadow = "0px 0px 10px 0px rgba(0, 0, 0, 0.5)";
    var prevCanvasCtx = prevCanvas.getContext("2d");
    prevCanvas.width = json.size_x * 4;
    prevCanvas.height = json.size_y * 4;
    for (let y = 0; y < json.size_y * 4; y += 4) {
        for (let x = 0; x < json.size_x * 4; x += 4) {
            prevCanvasCtx.fillStyle = json.colors[json.pattern[x / 4 + y / 4 * json.size_y]];
            prevCanvasCtx.fillRect(x, y, 4, 4);
        }
    }
}

function generateBg() {
    var bigWidth = 0;
    var bigHeight = 0;
    var bigCanvas = document.getElementById('canvasBig');
    var bigCtx = bigCanvas.getContext('2d');
    bigCtx.canvas.width = imgSizeX;
    bigCtx.canvas.height = imgSizeY;
    if (behaviour == 'no-repeat') return;
    if (behaviour == 'repeat') {
        var flip = true;
        var flop = true;
        while (bigHeight <= imgSizeY) {
            var initFlip = flip;
            var initFlop = flop;
            var tempCanvas2 = document.createElement('canvas');
            var tempCtx2 = tempCanvas2.getContext('2d');
            tempCtx2.canvas.width = bigCtx.canvas.width;
            tempCtx2.canvas.height = bigCtx.canvas.height;
            bigWidth = 0;
            while (bigWidth <= imgSizeX) {
                var tempCanvas = document.createElement('canvas');
                var tempCtx = tempCanvas.getContext('2d');
                tempCtx.canvas.width = bigCtx.canvas.width;
                tempCtx.canvas.height = origCanvas.height;
                if (flipX && flip) tempCtx.translate(origCanvas.width, 0);
                if (flipX && flip) tempCtx.scale(-1, 1);
                if (flipY && flop) tempCtx.translate(0, origCanvas.height);
                if (flipY && flop) tempCtx.scale(1, -1);
                tempCtx.drawImage(origCanvas, 0, 0);
                if (flipX) flip = !flip;
                if (flipY) flop = !flop;
                tempCtx2.drawImage(tempCanvas, bigWidth, bigHeight);
                bigWidth += origCanvas.width - overlapX * g_scale;
            }
            flip = initFlip == flip ? !flip : flip;
            flop = initFlop == flop ? !flop : flop;
            bigCtx.drawImage(tempCanvas2, 0, 0);
            bigHeight += origCanvas.height - overlapY * g_scale;
        }
    }
}

function saveImage() {
    if (typeof pattern === 'undefined') return;
    var a = document.createElement('a');
    if (imgSizeX != window.innerWidth) generateBg();
    var canvas = document.getElementById("canvasBig");
    a.href = canvas.toDataURL();
    a.download = document.getElementById('name').value + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}