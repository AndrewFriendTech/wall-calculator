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

//when moving a shape , this will be true, 
//will revert to false on mouseup
var moving = false;

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
            //to-do: make ratio labeled on each rectangle
            //and add delete function
        }
    }
    generateDetails()
    
}

//event listeners for mouse events
canvas.addEventListener("mousedown",mouseDown);
canvas.addEventListener("mousemove",mouseMove)
canvas.addEventListener("mouseup",mouseUp)



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

    if(selectedRectangle){
        moving=true;
    }
    
}

/** @param {MouseEvent} e */
function mouseMove(e){
    if(selectedRectangle && moving){
        const centerX = selectedRectangle.x + (selectedRectangle.width/2);
        const centerY = selectedRectangle.y + (selectedRectangle.height/2);
        const dx = e.offsetX - centerX;
        const dy = e.offsetY - centerY;
        const newX = selectedRectangle.x + dx;
        const newY = selectedRectangle.y + dy;
        if(newX > 0 
            && newX < canvas.width - selectedRectangle.width
            && newY > 0 
            && newY< canvas.height - selectedRectangle.height)
        {
            selectedRectangle.x = newX;
            selectedRectangle.y = newY;
            draw();
        }

    }
}

/** @param {MouseEvent} e */
function mouseUp(e){
    moving = false;
}

//key event handler
document.addEventListener("keydown", e=>{
    if(selectedRectangle){
        console.log("Key down" + e.key)
        if(e.key == "ArrowUp"){
           shapeBigger(selectedRectangle); 
        }
        else if(e.key == "ArrowDown"){
            shapeSmaller(selectedRectangle);
        } else if(e.key == "Delete"){
            rectangles.splice(rectangles.indexOf(selectedRectangle));
            draw()
        }
    }
    
})


/**
 * makes the shape the next biggest integer size for its ratio
 * @param {Rectangle} shape 
 */
function shapeBigger(shape){
    const newRatio = 
        findUpperIntegerRatio(shape.width,shape.ratio[0]/shape.ratio[1]);
    if(newRatio[0] < canvas.width && newRatio[1] < canvas.height){
        shape.width = newRatio[0];
        shape.height = newRatio[1];
    }
    draw();
}

/**
 * makes the shape the next biggest integer size for its ratio
 * @param {Rectangle} shape 
 */
 function shapeSmaller(shape){
    const MIN_WIDTH = 100
    const newRatio = 
        findLowerIntegerRatio(shape.width,shape.ratio[0]/shape.ratio[1]);
    if(newRatio && (newRatio[0] > MIN_WIDTH) ){
        shape.width = newRatio[0];
        shape.height = newRatio[1];
    }
    draw();
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
        let dimensions = findLowerIntegerRatio(200,ratio);
        let colour = rcolor();
        //create a rectangle with these dimensions in the middle of the page.
        rectangles.push(
            new Rectangle(canvas.width/2,canvas.height/2,
                dimensions[0],dimensions[1],colour,[widthRatio,heightRatio]));
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
function findLowerIntegerRatio(width,ratio){
    //breaks out when a width with a corresponding integer height is found
    while(width --> 0){
        if(((width/ratio) % 1)===0) return [width,width/ratio];
    }
    return null;
}

/**
 * finds the closest lower height and width which maintains the ratio 
 * while both values remain an integer
 * @param {number} width 
 * @param {number} ratio
 * @returns {[width:number,height:number]|null} returns compatible dimensions if exists, otherwise null
 */
function findUpperIntegerRatio(width,ratio){
    //must halt if ratio is rational
    while(width++){
        if(((width/ratio) % 1)===0) return [width,width/ratio];
    }
}

//generate details about rectangles
function generateDetails(){
    let element = document.getElementById("rectangle-container");
    element.innerHTML = rectangles.map((rectangle,index) => `
        <div id="rectangle${index}" class="rectangle" 
            style="background-color:${rectangle.colour}">
            <div class = "rectangle-x  rectangle-detail">
                <label>X:</label>
                <div class = "rectangle-value">
                ${rectangle.x}
                </div>
            </div>
            <div class = "rectangle-y  rectangle-detail">
                <label>Y:</label>
                <div class = "rectangle-value">
                ${rectangle.y}
                </div>
            </div>
            <div class = "rectangle-height  rectangle-detail">
                <label>Height:</label>
                <div class = "rectangle-value">
                ${rectangle.height}
                </div>
            </div>
            <div class = "rectangle-width  rectangle-detail">
                <label>Width:</label>
                <div class = "rectangle-value">
                ${rectangle.width}
                </div>
            </div>
            <div class = "rectangle-ratio  rectangle-detail">
                <label>Ratio:</label>
                <div class = "rectangle-value">
                ${rectangle.ratio[0]}:${rectangle.ratio[1]}
                </div>
            </div>
        </div>`).join();
}