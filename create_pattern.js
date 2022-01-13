var tool = 'draw';
var width = parseInt(document.getElementById("gridx").value);
var height = parseInt(document.getElementById("gridy").value);
document.getElementById("drawImg").style.opacity = "0.5"

class Canvas {
    constructor(width, height) {}
    draw(x, y) {}
    erase(x, y) {}
    setcolor(color) {}
    setTool(i) {}
    save() {}
    delete() {}
}

var canvas = document.getElementById("canvas");
canvas.addEventListener("mousemove", (e) => {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    x = Math.floor(width / canvas.clientWidth);
    y = Math.floor(height / canvas.clientHeight);
    if (tool == 'draw') {
        var canvas = document.querySelector("#canvas");
        var ctx = canvas.getContext('2d');
        ctx.fillRect(10, 10, 50, 50); // creates a 50 X 50 rectangle with upper-left corner at (10,10)
    } else if (tool == 'erase') {
        //this.erase(x, y); 
    }
});