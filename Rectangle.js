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
     * @property {[xRatio:number,yRatio:number]} ratio ratio between width and height.
     */
    constructor(x,y,width,height,colour,ratio){
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height
        this.colour = colour
        /** @type {[xRatio:number,yRatio:number]} */
        this.ratio = ratio
        this.id = Date.now();
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

    /**
     * works out if click is in bounds of shape
     * @param {number} x 
     * @param {number} y 
     */
    inBounds(x,y){
        
        let corners = this.getCorners();
        console.log(`bounds ${[x,y]} for ${[this.x,this.y]} to
            ${corners.bottom_right}`)
        console.log(corners.top_left);
        if(x>=corners.top_left[0] && x<=corners.bottom_right[0]
            &&
            y>=corners.top_left[1] && y<=corners.bottom_right[1])
            return true;
            else return false;
    }
}
