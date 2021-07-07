var canvas = document.getElementById("main-canvas")
/**
 * @type {CanvasRenderingContext2D} 
 */
var ctx = canvas.getContext("2d");

/** @typedef {[x:number,y:number]} Coordinate */

/** Class representing a Rectangle shape*/
class Rectangle{
    /**
     * 
     * @param {number} x x coordinate of top left point 
     * @param {number} y y coordinate of top left point
     * @param {number} width width of shape, measured from top left
     * @param {number} height height of shape, measured from top left
     * @param {string} [colour = "grey"] CSS colour to fill the shape
     */
    constructor(x,y,width,height,colour = "grey"){
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height
        this.colour = colour
    }
    /**
     * returns the coordinates of each rectangles corners
     * in format [[x,y],[x,y],]
     * height and width are measured from top left point like
     * @returns {{
     *  top_left: Coordinate,
     *  top_right: Coordinate,
     *  bottom_left:Coordinate,
     *  bottom_right:Coordinate
     * }} 
     */
    getCorners(){
        return {
            top_left:[this.x,this.y],
            top_right:[this.x + this.width,this.y],
            bottom_left:[this.x,this.y + this.height],
            bottom_right:[this.x+this.width,this.y + this.height]
        }
    }
}

var rectangle = new Rectangle(100,100,20,30,"red");
rectangle.height;

corners = rectangle.getCorners();

function draw(){
    clearCanvas();
    ctx.fillStyle = rectangle.colour;
    ctx.fillRect(rectangle.x,
        rectangle.y
        ,rectangle.width,
        rectangle.height);
    ctx.fillStyle = "pink"
    
    ctx.beginPath()
    corners = rectangle.getCorners();
    
    
    //draw corners of the shape
    ctx.arc(corners.top_left[0],corners.top_left[1],5,0,Math.PI*2);
    ctx.moveTo(corners.top_right[0],corners.top_right[1])
    ctx.arc(corners.top_right[0],corners.top_right[1],5,0,Math.PI*2);
    ctx.moveTo(corners.bottom_left[0],corners.bottom_left[1]);
    ctx.arc(corners.bottom_left[0],corners.bottom_left[1],5,0,Math.PI*2);
    ctx.moveTo(corners.bottom_right[0],corners.bottom_right[1])
    ctx.arc(corners.bottom_right[0],corners.bottom_right[1],5,0,Math.PI*2);
    ctx.fill();        
}

draw()

//handle dragging
var isDrawing = false;
canvas.addEventListener("mousedown", e => isDrawing = true);
canvas.addEventListener("mouseup",e => isDrawing = false);
canvas.addEventListener("mousemove", e => {
    if(isDrawing){
        console.log("drawing")
        console.log(Math.abs(distPoints(corners.top_left[0],corners.top_left[1],
            e.clientX,e.clientY
        ) ))
        console.log([corners.top_left[0],corners.top_left[1]],[e.clientX,e.clientY])
        //now cycle through corners
        if(
            Math.abs(distPoints(corners.top_left[0],corners.top_left[1],
                e.offsetX,e.offsetY
            ) < 5)
        ){
            console.log("dragging")
            rectangle.width +=  rectangle.x - e.offsetX;
            rectangle.height += rectangle.y - e.offsetY;  
            rectangle.x = e.offsetX;
            rectangle.y = e.offsetY;
            
        }
        draw();
    }
})

//clear canvas of items
function clearCanvas(){
    ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
}


//handle dist between points
function distPoints(x1,y1,x2,y2){
    let dx = Math.abs(x1-x2);
    let dy = Math.abs(y1-y2);
    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2) )
}