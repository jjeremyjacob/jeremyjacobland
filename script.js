document.addEventListener("DOMContentLoaded",()=>{


/*
=========================
PANELS
=========================
*/


const panels =
document.querySelectorAll(".panel");


const SCROLL_FACTOR = 1.5;



function updatePanels(){


const scrollY =
window.scrollY;


const panelHeight =
window.innerHeight;



panels.forEach((panel,index)=>{


if(index===0){

panel.style.transform =
"translateY(0)";

return;

}



const start =
index *
panelHeight *
SCROLL_FACTOR;



const progress =
(scrollY-start) /
(panelHeight*SCROLL_FACTOR);



const position =
Math.max(
-100,
Math.min(
0,
-100+(progress*100)
)
);



panel.style.transform =
`translateY(${position}%)`;



});


}






/*
=========================
IMAGE PARALLAX
=========================
*/


function updateImageParallax(){


panels.forEach(panel=>{


const image =
panel.querySelector(".panel-image");


if(!image)return;



const rect =
panel.getBoundingClientRect();



const offset =
rect.top +
rect.height/2 -
window.innerHeight/2;



image.style.transform =
`translateY(${offset*-0.82}px)`;


});


}







/*
=========================
VIDEO LOADING
=========================
*/


const mobile =
window.innerWidth <= 768;



const videoContainers =
document.querySelectorAll(".video-frame");



videoContainers.forEach(container=>{


const iframe =
container.querySelector(
mobile
? ".mobile-frame"
: ".desktop-frame"
);



if(!iframe)return;



iframe.src =
iframe.dataset.src;



iframe.onload = ()=>{


container.classList.add(
"video-ready"
);


};



});








/*
=========================
SCROLL PERFORMANCE
=========================
*/


let ticking=false;



function scrollUpdate(){


if(!ticking){


requestAnimationFrame(()=>{


updatePanels();

updateImageParallax();


ticking=false;


});


ticking=true;


}


}



window.addEventListener(
"scroll",
scrollUpdate,
{passive:true}
);



window.addEventListener(
"resize",
()=>{

updatePanels();

updateImageParallax();

}
);







/*
=========================
INITIAL
=========================
*/


updatePanels();

updateImageParallax();


});