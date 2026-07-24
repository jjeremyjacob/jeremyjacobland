document.addEventListener("DOMContentLoaded",()=>{


/*
=========================
FORCE START AT PANEL 1
=========================
*/


if ("scrollRestoration" in history){

    history.scrollRestoration = "manual";

}


setTimeout(()=>{

    window.scrollTo({
        top:0,
        left:0,
        behavior:"instant"
    });

},50);







/*
=========================
PANELS
=========================
*/


const panels =
document.querySelectorAll(".panel");


const SCROLL_FACTOR = 1.5;







/*
=========================
PAGE HEIGHT
=========================
*/


function setPageHeight(){

    document.body.style.height =
    `${panels.length * SCROLL_FACTOR * 100}vh`;

}


setPageHeight();








/*
=========================
PANEL SCROLL ANIMATION
=========================
*/


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
(scrollY - start) /
(panelHeight * SCROLL_FACTOR);




const position =
Math.max(
-100,
Math.min(
0,
-100 + (progress * 100)
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



if(!image)
return;



const rect =
panel.getBoundingClientRect();



const offset =
rect.top +
(rect.height / 2) -
(window.innerHeight / 2);



image.style.transform =
`translateY(${offset * -0.82}px)`;


});


}








/*
=========================
VIMEO LAZY LOADING
=========================
*/


const isMobile =
window.innerWidth <= 768;



const videoContainers =
document.querySelectorAll(".video-frame");




function loadVideo(container){


if(container.dataset.loaded)
return;



const iframe =
isMobile
?
container.querySelector(".mobile-frame")
:
container.querySelector(".desktop-frame");



if(!iframe)
return;



const source =
iframe.dataset.src;



if(!source)
return;



iframe.src =
source;



container.dataset.loaded =
"true";



iframe.onload = ()=>{


container.classList.add(
"video-ready"
);


};



}









/*
=========================
LOAD FIRST VIDEO
IMMEDIATELY
=========================
*/


if(videoContainers.length){

    loadVideo(
        videoContainers[0]
    );

}








/*
=========================
LOAD UPCOMING VIDEOS
=========================
*/


const videoObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


    loadVideo(
        entry.target
    );


}



});


},
{

rootMargin:
"500px 0px",

threshold:
0.01

});






videoContainers.forEach((video,index)=>{


if(index !== 0){

    videoObserver.observe(video);

}


});








/*
=========================
SCROLL PERFORMANCE
=========================
*/


let ticking = false;



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
{
passive:true
}
);








/*
=========================
RESIZE
=========================
*/


window.addEventListener(
"resize",
()=>{


setPageHeight();


updatePanels();


updateImageParallax();


});









/*
=========================
INITIAL DRAW
=========================
*/


updatePanels();

updateImageParallax();



});