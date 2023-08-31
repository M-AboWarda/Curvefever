class Player {
    constructor(id, x, y, toRight, toLeft, color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        

        //-----------------------------player setings -----------------------------
        this.r = game.player.radius;
        this.tailWidth = game.player.tailWidth;

        //the player is facing towordes the middel 
        this.angle = 
            ( Math.atan(((canvas.height/2)-this.y) / ((canvas.width/2)-this.x)) )//calculate the angle 
            *(360/(Math.PI*2));//convert to degress
        if(this.x > canvas.width/2){this.angle += 180}//correct the direction

        this.speed = game.player.speed;
        this.steering = game.player.steering;//this number get added to the this.angle in degress
        
        //keybord
        //toRight and toLeft are keyCodes for moving
        this.toRight = toRight;
        this.toLeft  = toLeft;
        //----------------------------- Setings end ----------------------------- 
        
        //player status
        //this.immune = false;
        this.isAlive = true;
        this.movingRight = false;
        this.movingLeft = false;


    }
    update(){
        let angleToRadian = ((this.angle) / 360) * (Math.PI *2);//Convert the angle from degress to radians
        this.x += ( Math.cos( angleToRadian ) ) * this.speed;
        this.y += ( Math.sin( angleToRadian ) ) * this.speed;

    }

    move(){
        //keybord
        if(this.movingLeft){
            this.angle -= this.steering;
        }
        if(this.movingRight){
            this.angle += this.steering;
        }

    }
    //expand the tail by adding a point to the tails[this.id] array //remove it later and draw the tail in another way
    //expand the tail by adding a point to the cell/section array that the player is in. 
    expand(){
        //if the player is alive the tail will expand
        //if(player.isAlive) is called in the "engine.js"
        if(qnt.frams % game.resolution == 0){
            //let randBoolean = (qnt.frams % 100 > 13)? true : false;
            let randBoolean =  true;
            //remove this later and draw the tails in another way
            tails[this.id].push({"x": this.x, "y": this.y, "active":randBoolean});//add the player position to the tail


            let getRow = Math.floor(this.y / (canvas.height / qnt.rows));
            let getCol = Math.floor(this.x / (canvas.width / qnt.cols));
            if(getRow < 0|| getRow >= qnt.rows || getCol < 0 || getCol >= qnt.cols){
                return;
            }
            sections[getRow][getCol][this.id].push({
                "x": this.x, 
                "y": this.y, 
                "active":randBoolean, 
                "tailIndex":qnt.frams/game.resolution//first point will get 0 secound 1 third 2 and so on
            });
        }
    }
    
    collision(){

        //if the player touched the edge
        if(this.x < 0 || this.x > canvas.width){
            this.crashed();
            return;
        }
        if(this.y < 0 || this.y > canvas.height){
            this.crashed();
            return;
        }

        //find the player current section
        let getRow = Math.floor(this.y / (canvas.height / qnt.rows));
        let getCol = Math.floor(this.x / (canvas.width / qnt.cols));

        //loop through niebger sections 
        for(let n = 0; n < 9; n++){
            let y = (n % 3) -1;             // -1 -1 -1  0  0  0  1  1  1 
            let x = Math.floor( n / 3) -1;  // -1  0  1 -1  0  1 -1  0  1

            //if unexisting row or colon for example section[-1][3]
            if(getRow + x < 0|| getRow + x >= qnt.rows || getCol + y < 0 || getCol + y >= qnt.cols){
                //console.log("Skiped", x, y);//debugging
                continue;
            }
            //check if the player is intersecting with any tail in this section
            this.lineIntersect(sections[getRow + x][getCol + y]);

        }

    }
    lineIntersect(section){
        //section contains array of points foreach player tail we call it (points) for short 
        //pointsArr contains object of points
        //points contan x, y, active, tailIndex

        //go throgh all the tail points' arrays in this section
        for(let points of section){
            //if the tail points' array does not contain any point skip it
            if(points.length == 0){continue}

            
            //loop through all tail points in the section
            for(let i = 1;i < points.length; i++){//let i = points[0].tailIndex??
                
                //skip if the point[i] and point[i-1] are not dirctly after eachothers
                if(points[i].tailIndex - points[i-1].tailIndex  > 1){
                    //console.log("skipd for big gap between the tail points");//debugging
                    continue;
                }
                
                //do not check last this.r elements
                if((qnt.frams/game.resolution) - points[i].tailIndex  < Math.ceil(this.r /game.resolution) ){continue}


                /**
                 * Rectangle around the line with boundaries between startx, endx, starty and endy
                 * startx < endx && starty < endy 
                 * k ميلان الخط المرسوم داخل المستطيل
                 * */  
                let startx;
                let starty;
                let endx;
                let endy;
                let k;
                
                //get the rectangle boundaries
                if(points[i-1].x < points[i].x){
                    startx = points[i-1].x;
                    endx   = points[i].x;
                }else{
                    startx = points[i].x;
                    endx   = points[i-1].x;
                }
                if(points[i-1].y < points[i].y){
                    starty = points[i-1].y;
                    endy   = points[i].y;
                }else{
                    starty = points[i].y;
                    endy   = points[i-1].y;
                }
                //the width of the box (deltax) and the height of the box (deltay)
                let deltax = endx - startx;
                let deltay = endy - starty;

                //calculate k
                //is the k positive or negative// not important any more thanks to javascript coordinatesystem
                if      (startx == endx){k = Infinity}//vertical line
                else if(k != Infinity){ k = deltay / deltax }
                

                //player (x, y) relative to the rectangle box
                let xb = this.x - startx;
                let yb = this.y - starty;

                //coordinatesystem in javascript is stupid thats way it need a stupied fix
                //some stupid fixes and oriantation correction
                if (endx   == points[i-1].x && starty == points[i-1].y || //top right corner (started drawing from)
                    startx == points[i-1].x && endy   == points[i-1].y){  //bottom left corner (started drawing from)
                    yb -= deltay;
                    yb *= -1;
                }

                let halfTailWidth = this.tailWidth / 2;

                //rare conditions (vertical line & horizotal line)
                //we can not check a box. the width or the hight will be zero in thess cases 

                if(k == Infinity){//vertical line (tail)
                    if( yb + this.r > 0 && 
                        yb - this.r < deltay && 
                        xb + (halfTailWidth + this.r) > 0 && 
                        xb - (halfTailWidth + this.r) < 0){
                            /*
                            if(!points[i].active){
                                this.immune = true;
                            }
                            */
                            //kill the player
                            //if(!this.immune){//if there is no gaps (the only reson for now)
                            this.crashed()
                            //}
                    }
                    continue;
                }
                if(k == 0){//horizotal line (tail)
                    //check if crashed with the tail
                    if( xb + this.r > 0 && 
                        xb - this.r < deltax && 
                        yb + (halfTailWidth + this.r) > 0 &&
                        yb - (halfTailWidth + this.r) < 0){
                            /*
                            if(!points[i].active){
                                this.immune = true;
                            }
                            */
                            //kill the player
                            //if(!this.immune){//if there is no gaps (the only reson for now)
                            this.crashed()
                            //}
                    }
                    continue;
                }

                // (yb == k * xb) the function for checking the intersect
                //from the player center to the tail center line (no thickness)
                //to aplay the thickness we need to
                //defind two parallell lines with the original line to represent its thickness
                //and then check if the the player is intersecting with them
                // we call them for yRight and yLeft
                let ang = Math.atan(k);
                let d = (halfTailWidth + this.r) / Math.cos(ang);
                let yRight = (k * xb) +  d ;// first parallell line   
                let yLeft = (k * xb) -  d;  // second parallell line  

                //check if any the player is intersecting with the tail rectangle box 
                let inx = (this.x + this.r > startx && this.x - (this.r + halfTailWidth) < endx);
                let iny = (this.y + this.r > starty && this.y - (this.r + halfTailWidth) < endy);
                if(inx && iny){

                    //check if any the player is intersecting with the tail lines
                    if(yb <= yRight && yb >= yLeft){
                        /*
                        if(!points[i].active){
                            this.immune = true;
                        }
                        */
                        //kill the player
                        //if(!this.immune){//if there is no gaps (the only reson for now)
                        this.crashed()
                        //}
                    }
                }
            }
        }//for (points of section) end
        return;
    }

    crashed(){
        //kill the player and stop it from moving
        this.isAlive = false;
        this.speed = 0;

        alert("crashed!");//debugging

        //draw the explotion
        ctx.beginPath();
        ctx.fillStyle = game.bgColor;
        ctx.arc(this.x, this.y, game.player.explosionRadius, 0, 2* Math.PI);
        ctx.fill();
        
    }
    draw(){
        
        if(this.isAlive){
            
            //hidden circle to remove the player
            ctx.beginPath();
            //debugging//
            ctx.fillStyle = game.bgColor;
            //ctx.fillStyle = "red";//debugging
            let xc = this.x - Math.cos(((this.angle) / 360) * (Math.PI *2)) * this.speed;//| The erasing circle should be placed a bit of the player circle depending on the player direction
            let yc = this.y - Math.sin(((this.angle) / 360) * (Math.PI *2)) * this.speed;//| (in the back of the player)
            ctx.ellipse(xc, yc, this.r +1  , this.r +1 ,0,0,Math.PI*2);
            ctx.fill();

            //draw the player
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.r, 0, (Math.PI *2));
            ctx.fill();
            

            //for later improvment draw tha tail in another way (from sections insted if tails)
            //draw the tail
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.tailWidth;
            for(let i = tails[this.id].length - this.r -1; i < tails[this.id].length; i++){
                if(i == tails[this.id].length -1 ){
                    ctx.lineTo(this.x, this.y);//connect the player with the tail
                    
                }else{//draw the tail if the point is active
                    if(tails[this.id][i]){//the 'i' will be negative att the beging
                    if(tails[this.id][i].active){
                        //ctx.strokeStyle = this.color;
                        //ctx.beginPath();
                        ctx.lineTo(tails[this.id][i].x, tails[this.id][i].y);
                        
                    }else{
                        //
                        ctx.stroke();
                        ctx.beginPath();
                        //ctx.strokeStyle = game.bgColor;
                        ctx.moveTo(tails[this.id][i].x, tails[this.id][i].y);
                        }
                    }
                }

                
            }
            ctx.stroke();

            
        }else if(!this.isAlive){
            //he is dead x_x

            /*------------------------------ Draw with Alpha -----------------------------*/
            /* to draw with alpha we need to rease the previous drawing (cuz its looping)*/
            ctx.beginPath();
            ctx.fillStyle = game.bgColor;
            ctx.arc(this.x, this.y, (this.r*1.5) + 2.5, 0, Math.PI*2);
            ctx.fill();

            ctx.beginPath();
            let n = this.color;
            //the same collor but with alpha
            ctx.strokeStyle = `rgb(${n[4]+n[5]+n[6]},${n[8]+n[9]+n[10]},${n[12]+n[13]+n[14]}, 0.2)`;
            ctx.lineWidth = 5;
            ctx.arc(this.x, this.y, this.r*1.5, 0, Math.PI*2);
            ctx.stroke();
            /*--------------------------- Draw with Alpha end ----------------------------*/

        }
    }
}