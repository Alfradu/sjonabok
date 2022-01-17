const genBtn = document.getElementById('generatePageBtn');
genBtn.addEventListener("click", () => {
    document.getElementById('mainPage').style.display = "none";
    document.getElementById('generatePage').style.display = "inline";
});
const backCanvasBtn = document.getElementById('backCanvasBtn');
backCanvasBtn.addEventListener("click", () => {
    document.getElementById('mainPage').style.display = "inline";
    document.getElementById('generatePage').style.display = "none";
});
const createBtn = document.getElementById('createPageBtn');
createBtn.addEventListener("click", () => {
    document.getElementById('mainPage').style.display = "none";
    document.getElementById('createPage').style.display = "inline";
});
const backCreateBtn = document.getElementById('backCreateBtn');
backCreateBtn.addEventListener("click", () => {
    document.getElementById('mainPage').style.display = "inline";
    document.getElementById('createPage').style.display = "none";
});