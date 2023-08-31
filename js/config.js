//default game setings
let game = {

    bgColor: "#002",
    resolution :3,//tail resolution. High resulution if low nomber

    player:{
        radius:      4,
        tailWidth:   8,
        speed:    2.15,//2.15
        steering:  2.8,//2.8
        gapSize:     5,//Not used yet
        explosionRadius:37
    },

    amountPlayers: 2,
    
    controllers: [
        {right: 39, left: 37},// rightArrow, leftArrow
        {right: 68, left: 65},// d, a
        {right: 72, left: 70},// h, f
        {right: 76, left: 74} // l, j
    ]
    
}

let tailTest = [
    {x:000, y:0},
    {x : 150, y:000},
    {x : 250, y:200}, 
    {x : 500, y:350},
    {x : 200, y:620}, 
    {x : 200, y:630}, 
    {x : 400, y:620}
];//Debugging

//quantities
let qnt = {
    rows : Math.floor(innerHeight / (game.player.radius*2 +50)),//depending on the default player radius
    cols : Math.floor(innerWidth  / (game.player.radius*2 +50)),//depending on the default player radius
    frams: 0
}