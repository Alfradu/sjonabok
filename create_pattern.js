var tool = 'draw';
var down = false;
var stillclicking = false;
document.getElementById("drawImg").style.opacity = "0.1"

var grid_width = parseInt(document.getElementById("gridx").value);
var grid_height = grid_width;
var canvas = document.getElementById("canvas");
var canvasCtx = canvas.getContext("2d");
canvas.width = grid_width*10;
canvas.height = grid_height*10;
var width = canvas.width;
var height = canvas.height;

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
    if(!down) return;
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
        document.getElementById("eraseImg").style.opacity = "1"
    }
});

const eraseBtn = document.getElementById('eraseBtn');
eraseBtn.addEventListener("click", () => {
    if (tool != 'erase') {
        tool = 'erase';
        document.getElementById("drawImg").style.opacity = "1"
        document.getElementById("eraseImg").style.opacity = "0.1"
    }
});

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener("click", () => {
    save();
});

const deleteBtn = document.getElementById('delBtn');
deleteBtn.addEventListener("click", () => {
    canvasCtx.clearRect(0, 0, width, height);
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
function erase(boundingClientRect, e){
    var tempColor = canvasCtx.fillStyle;
    canvasCtx.fillStyle = "white";
    this.draw(boundingClientRect, e);
    canvasCtx.fillStyle = tempColor;
}

function updateSize(){
    canvasCtx.clearRect(0, 0, width, height);
    grid_width = parseInt(document.getElementById("gridx").value);
    grid_height = grid_width;
    canvas.width = grid_width*10;
    canvas.height = grid_height*10;
    width = canvas.width;
    height = canvas.height;

}
function save(){
    console.log("clicked save");
    var data = canvasCtx.getImageData(0, 0, width, height).data;
    var clampw = Math.floor(width / grid_width);
    var clamph = Math.floor(height / grid_height);
    console.log(JSON.stringify(data));
    for (let i = 0; i < data.length; i+=clampw+(data.length/10)%i) {
        red = data[i];
        green = data[i+1];
        blue = data[i+2];
        alpha = data[i+3];
        console.log(red + " : " + green + " : " + blue + " : " + alpha);
    }
    //create json
}