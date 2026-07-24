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
PANEL ANIMATION
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



if(!image)
return;



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
VIMEO PLAYER API
=========================
*/


const isMobile =
window.innerWidth <= 768;



const videoFrames =
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



const url =
iframe.dataset.src;



if(!url)
return;



iframe.src =
url;



container.dataset.loaded =
"true";





iframe.onload = ()=>{


const player =
new Vimeo.Player(iframe);



player.setVolume(0);



function startVideo(){


player.play()

.then(()=>{


container.classList.add(
"video-ready"
);


})


.catch(()=>{


// Safari retry

setTimeout(()=>{


player.play()
.then(()=>{


container.classList.add(
"video-ready"
);


});


},1000);



});


}



startVideo();




};



}









/*
=========================
LOAD FIRST VIDEO
=========================
*/


if(videoFrames.length){


loadVideo(
videoFrames[0]
);


}









/*
=========================
LAZY LOAD OTHER VIDEOS
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
"800px 0px",

threshold:
0.01

});







videoFrames.forEach((video,index)=>{


if(index!==0){

videoObserver.observe(video);

}


});









/*
=========================
SCROLL PERFORMANCE
=========================
*/


let ticking=false;



function handleScroll(){


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
handleScroll,
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
INITIAL UPDATE
=========================
*/


updatePanels();

updateImageParallax();



});