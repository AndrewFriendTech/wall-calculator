/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("main-canvas")
/**
 * @type {CanvasRenderingContext2D} 
 */
var ctx = canvas.getContext("2d");


/** @type {[Rectangle]} */
var rectangles = [];
/** @type {Rectangle} */
var selectedRectangle = null;

//resizing corner constants
const RESIZE_CIRCLE_RADIUS = 5;
const RESIZE_CIRCLE_CLICK_BOUNDS = 10; 
const resizingCorner = () => selectedRectangle.getCorners().bottom_right;

//clear canvas of items
function clearCanvas(){
    ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
}

function draw(){
    clearCanvas();
    //draw most recently added first
    for(let i = rectangles.length - 1 ; i >= 0 ; i--){
        ctx.fillStyle = rectangles[i].colour;
        ctx.fillRect(rectangles[i].x,rectangles[i].y,rectangles[i].width,
            rectangles[i].height);
        if(rectangles[i] === selectedRectangle){
            ctx.strokeRect(rectangles[i].x,rectangles[i].y,
                rectangles[i].width,
                rectangles[i].height);
            //draw a circle in the bottom right rectangle for resizing;
            let corner = resizingCorner();
            ctx.moveTo(corner[0],corner[1])
            ctx.arc(corner[0],corner[1],
                RESIZE_CIRCLE_RADIUS,0,Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill()
            //to-do: make ratio labeled on each rectangle
            //and add delete function
        }
    }
        
    
}

//event listeners for mouse events
canvas.addEventListener("mousedown",mouseDown);
canvas.addEventListener("mousemove",mouseMove)


//functions for mouse events
/** @param {MouseEvent} e */
function mouseDown(e){
    console.log("mouse down")
    let inBound = false;
    for(let i = rectangles.length-1; i >=0 && !inBound;i--){
        if(rectangles[i].inBounds(e.offsetX,e.offsetY)){
            selectedRectangle = rectangles[i];
            draw()
            inBound = true
        }
    }
    //if not in any bounds , rectangle deselected
    if(!inBound){
        selectedRectangle = null;
        draw()
    }
    
}

/** @param {MouseEvent} e */
function mouseMove(e){
    if(selectedRectangle){
        let corner = resizingCorner();
        console.log(corner);
        if(distPoints(e.offsetX,e.offsetY,corner[0],corner[1]) 
            < RESIZE_CIRCLE_CLICK_BOUNDS)
        {
            console.log("here")
            let ratioArr = selectedRectangle.ratio;
            let ratio = ratioArr[0]/ratioArr[1];
            let newWidth = e.offsetX - selectedRectangle.x
            console.log(newWidth)
            let newDimensions = findIntegerHeight(newWidth,ratio);
            if (newDimensions[0] > 20 && newDimensions[1] != null ){
                selectedRectangle.width = newDimensions[0];
                selectedRectangle.height = newDimensions[1];
                draw()
            }; 
        }    
    }
}

/** @param {MouseEvent} e */
function mouseUp(e){

}

//handle dist between points
function distPoints(x1,y1,x2,y2){
    let dx = Math.abs(x1-x2);
    let dy = Math.abs(y1-y2);
    return Math.abs(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2) ));
}

function newRectangle(){
    let widthRatio = 
        Number(document.getElementById("rectangle-ratio-width").value)
    let heightRatio = 
        Number(document.getElementById("rectangle-ratio-height").value)
    if(widthRatio&&heightRatio){
        let ratio = widthRatio/heightRatio;
        let height = 100;
        let width = height * ratio;
        let colour = rcolor();
        //create a rectangle with these dimensions in the middle of the page.
        rectangles.push(
            new Rectangle(canvas.width/2,canvas.height/2,
                width,height,colour,[widthRatio,heightRatio]));
        draw();
    }

}

function updateCanvasSize(){
    canvas.width = document.getElementById("canvas-width").value;
    canvas.height = document.getElementById("canvas-height").value;
}

function selectCanvasRatio(){
    console.log("called")
    let value = document.getElementById("common-sizes").value;
    //splits a string in form of XXXxYYY into [x,y]
    let resolution = value.split("x")
    console.log(resolution)
    if(resolution.length == 2){
        document.getElementById("canvas-width").value = resolution[0];
        document.getElementById("canvas-height").value = resolution[1];
        updateCanvasSize()
    }
}

/**
 * finds the closest lower height and width which maintains the ratio 
 * while both values remain an integer
 * @param {number} width 
 * @param {number} ratio
 * @returns {[width:number,height:number]|null} returns compatible dimensions if exists, otherwise null
 */
function findLowerIntegerHeight(width,ratio){
    //breaks out when a width with a corresponding integer height is found
    while(width --> 0){
        if(((width/ratio) % 1)===0) return [width,width/ratio];
    }
    return null;
}

//must halt if ratio is rational
function findUpperIntegerHeight(width,ratio){
    while(width++){
        if(((width/ratio) % 1)===0) return [width,width/ratio];
    }
}