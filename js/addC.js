// element selector from DOM
const _ = e =>{
    return document.querySelector(e);
}
//---pick a random number between min and max---
const rand = (min,max) => {
    return Math.floor(Math.random() * (max-min+1)) + min;
}