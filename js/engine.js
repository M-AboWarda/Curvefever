let canvas = _("#c");
let ctx = canvas.getContext("2d");

let players = [];
let tails = [];//used only for drawing the tails

//contain array of rows that contain array of cells/sections witch contain array of players' tail points object
let sections = [];

for(let i = 0; i < qnt.rows; i++){
    sections.push(Array());//create a new row
    for(let j = 0; j < qnt.cols; j++){
        sections[i].push(Array());//create a new cell/section
        for(let p = 0; p < game.amountPlayers;p++){
            sections[i][j].push(Array());//create a container for each player tail 
        }
    }
}

const setup = () =>{

    canvas.width  = innerWidth;
    //canvas.width  = 900;
    canvas.height = innerHeight;
    //canvas.height = 600;

    //Player arguments(id, x pos, y pos, keyCode for moving right,keyCode for moving left, color);
    for(let i = 0; i < game.amountPlayers; i++){
        //the new player starting position
        let x = rand(0, canvas.width);
        let y = rand(0, canvas.height);

        //Create a tail array for every player starting with player position
        tails.push(Array({"x": x, "y":y, "active":true}));

        //create the player 
        players.push(
            new Player(
                i,                          //id
                x,                          //x Position 
                y,                          //y Position
                game.controllers[i].right,  //KeyCode for moving right
                game.controllers[i].left,   //KeyCode for moving left
                "rgb(110,110,250)"          //Color
            )
        );
    }
    
    //draw the background rectangle
    ctx.fillStyle = game.bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    //draw the dividing net
    ctx.beginPath();
    for(let i = 0; i < qnt.rows; i++){
        ctx.strokeStyle = "#fff";
        ctx.moveTo(0,(canvas.height/qnt.rows)* i);
        ctx.lineTo(canvas.width, (canvas.height/qnt.rows)* i);
    }
    ctx.stroke();
    ctx.beginPath();
    for(let i = 0; i < qnt.cols; i++){
        ctx.strokeStyle = "#fff";
        ctx.moveTo((canvas.width/qnt.cols)* i, 0);
        ctx.lineTo((canvas.width/qnt.cols)* i, canvas.height);
    }
    ctx.stroke();
}

const update = () =>{    
    //for all the players in the game
    for(player of players){
        player.update();//update the player position
        player.move();//move the player if the player is turning right/left
        
        
        if(player.isAlive){//if the player is still alive
            player.expand();// expand the tail
            player.collision();// check for any collisions with the tail
        }
        player.draw();//draw everything (players, tails, died players)
    }
    qnt.frams++;
    window.requestAnimationFrame(update);//Better thay say ¯\_(ツ)_/¯
}

/* ------------------ Keyboard ------------------ */
window.addEventListener("keydown", e =>{
    for(player of players){
        if(e.keyCode == player.toRight){
            player.movingRight = true;
        }
        else if(e.keyCode == player.toLeft){
            player.movingLeft = true;
        }
        else{continue}
    }
});
window.addEventListener("keyup", e =>{
    for(player of players){
        if(e.keyCode == player.toRight){
            player.movingRight = false;
        }
        else if(e.keyCode == player.toLeft){
            player.movingLeft = false;
        }
        else{continue}
    }
});
/* ------------------ Keyboard end ------------------ */

window.onload = ()=>{
    setup();
    window.requestAnimationFrame(update);//Better thay say ¯\_(ツ)_/¯
    //var run = setInterval(update, 1000 / 60);
}