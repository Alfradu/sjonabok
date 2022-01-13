let pattern;
const scale = document.getElementById('scale');
let g_scale = parseInt(scale.value);
scale.addEventListener("input", (e) => {
    if (typeof pattern === 'undefined') return;
    // document.getElementById("canvasBig").style.height = (e.target.value * 100) + "%";
    // document.getElementById("canvasBig").style.width = (e.target.value * 100) + "%";
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
    var prevCanvasCtx = prevCanvas.getContext("2d");
    prevCanvas.width = json.size_x * 4;
    prevCanvas.height = json.size_y * 4;
    for (let y = 0; y < json.size_y * 4; y += 4) {
        for (let x = 0; x < json.size_x * 4; x += 4) {
            prevCanvasCtx.fillStyle = json.colors[json.pattern[x / 4 + y / 4 * json.size_y]];
            prevCanvasCtx.fillRect(x, y, 4, 4);
        }
    }
    //return;
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
                tempCtx.canvas.height = origCanvas.height;
                if (json.flipX && flip) tempCtx.translate(origCanvas.width, 0);
                if (json.flipX && flip) tempCtx.scale(-1, 1);
                if (json.flipY && flop) tempCtx.translate(0, origCanvas.height);
                if (json.flipY && flop) tempCtx.scale(1, -1);
                tempCtx.drawImage(origCanvas, 0, 0);
                if (json.flipX) flip = !flip;
                if (json.flipY) flop = !flop;
                tempCtx2.drawImage(tempCanvas, bigWidth, bigHeight);
                bigWidth += origCanvas.width - json.overlap.x;
            }
            flip = initFlip == flip ? !flip : flip;
            flop = initFlop == flop ? !flop : flop;
            bigCtx.drawImage(tempCanvas2, 0, 0);
            bigHeight += origCanvas.height - json.overlap.y * scale;
        }
    }
}

var json = {
    "page": 258,
    "size_x": 35,
    "size_y": 35,
    "behaviour": "repeat",
    "flipX": true,
    "flipY": false,
    "overlap": {
        "x": 0,
        "y": 1
    },
    "rotation": 0,
    "pattern": "5555555533333333353333333335555555544444445535555355355355553554444444555555545555525553555255555455555551111111545552555333555255545111111155515515545552525352525554551111511151515155545552553552555455515155515155511555545555535555545555111151111111111111545555355554511111111111555555151515545533355455151515555553555551151155545535545551111155555333555515151555545554555515151555533333355111111111545451111111115253333355255555155115454511511555522553335552255551515154545111115552225253352255355511551545451151155555522553352553555151515454515551555352225255355333551551154545115115533355522553333333515151545451111153333352225535533355115515454511511553335552233525535551515154545155515553522252352255355515511545451151155555522553555225555151515454511111555222525333552555551155154545115115555225533333355111111111545451111111115253333355551515155554555455551515155553335555511511555455355455511111555553555555151515545533355455151515555551111111111154555535555451111111111151555115555455555355555455551111511151515155545552553552555455515155515551551554555252535252555455111151111111115455525553335552555451111111555555545555525553555255555455555554444444553555535535535555355444444455555555333333333533333333355555555",
    "colors": {
        "1": "#949F9C",
        "2": "#8C9899",
        "3": "#2E261F",
        "4": "#60615F",
        "5": "#E0DAD3"
    }
}
generate(json, g_scale);