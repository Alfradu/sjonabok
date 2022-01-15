let pattern;
const scale = document.getElementById('scale');
let g_scale = parseInt(scale.value);
scale.addEventListener("input", (e) => {
    if (typeof pattern === 'undefined') return;
    g_scale = parseInt(e.target.value);
    generate(pattern, g_scale);
});

const fileSelector = document.getElementById('fileinput');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    const reader = new FileReader();
    reader.onload = function(e) {
        pattern = JSON.parse(e.target.result);
        generate(pattern, g_scale);
    };
    reader.readAsText(fileList[0]);
});

window.addEventListener('resize', () => {
    if (typeof pattern !== 'undefined') generate(pattern, g_scale);
});

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener("click", () => {
    if (typeof pattern === 'undefined') return;
    var a = document.createElement('a');
    var canvas = document.getElementById("canvasBig");
    a.href = canvas.toDataURL();
    a.download = document.getElementById('name').value + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

function generate(json, scale) {
    var windowSizeX = window.innerWidth;
    var windowSizeY = window.innerHeight;
    var origCanvas = document.createElement('canvas');
    var origCanvasCtx = origCanvas.getContext("2d");
    origCanvas.width = json.size_x * scale;
    origCanvas.height = json.size_y * scale;
    for (let y = 0; y < json.size_y * scale; y += scale) {
        for (let x = 0; x < json.size_x * scale; x += scale) {
            origCanvasCtx.fillStyle = json.colors[json.pattern[x / scale + y / scale * json.size_y]];
            origCanvasCtx.fillRect(x, y, scale, scale);
        }
    }
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
    var bigWidth = 0;
    var bigHeight = 0;
    var bigCanvas = document.getElementById('canvasBig');
    var bigCtx = bigCanvas.getContext('2d');
    bigCtx.canvas.width = windowSizeX;
    bigCtx.canvas.height = windowSizeY;
    if (json.behaviour == 'no-repeat') return;
    if (json.behaviour == 'repeat-x') {
        var flip = true;
        var flop = true;
        while (bigWidth <= windowSizeX) {
            var tempCanvas = document.createElement('canvas');
            var tempCtx = tempCanvas.getContext('2d');
            tempCtx.canvas.width = bigCtx.canvas.width;
            tempCtx.canvas.height = bigCtx.canvas.height;
            if (json.flipX && flip) tempCtx.translate(origCanvas.width, 0);
            if (json.flipX && flip) tempCtx.scale(-1, 1);
            if (json.flipY && flop) tempCtx.translate(0, origCanvas.height);
            if (json.flipY && flop) tempCtx.scale(1, -1);
            tempCtx.drawImage(origCanvas, 0, 0);
            if (json.flipX) flip = !flip;
            if (json.flipY) flop = !flop;
            bigCtx.drawImage(tempCanvas, bigWidth, bigHeight);
            bigWidth += origCanvas.width - json.overlap.x * scale;
        }
    }
    if (json.behaviour == 'repeat') {
        var flip = true;
        var flop = true;
        while (bigHeight <= windowSizeY) {
            var initFlip = flip;
            var initFlop = flop;
            var tempCanvas2 = document.createElement('canvas');
            var tempCtx2 = tempCanvas2.getContext('2d');
            tempCtx2.canvas.width = bigCtx.canvas.width;
            tempCtx2.canvas.height = bigCtx.canvas.height;
            bigWidth = 0;
            while (bigWidth <= windowSizeX) {
                tempCanvas = document.createElement('canvas');
                tempCtx = tempCanvas.getContext('2d');
                tempCtx.canvas.width = bigCtx.canvas.width;
                tempCtx.canvas.height = origCanvas.height;
                if (json.flipX && flip) tempCtx.translate(origCanvas.width, 0);
                if (json.flipX && flip) tempCtx.scale(-1, 1);
                if (json.flipY && flop) tempCtx.translate(0, origCanvas.height);
                if (json.flipY && flop) tempCtx.scale(1, -1);
                tempCtx.drawImage(origCanvas, 0, 0);
                if (json.flipX) flip = !flip;
                if (json.flipY) flop = !flop;
                tempCtx2.drawImage(tempCanvas, bigWidth, bigHeight);
                bigWidth += origCanvas.width - json.overlap.x * scale;
            }
            flip = initFlip == flip ? !flip : flip;
            flop = initFlop == flop ? !flop : flop;
            bigCtx.drawImage(tempCanvas2, 0, 0);
            bigHeight += origCanvas.height - json.overlap.y * scale;
        }
    }
}