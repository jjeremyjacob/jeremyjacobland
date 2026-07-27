document.addEventListener("DOMContentLoaded", () => {


/*
=========================
RESET SCROLL IMMEDIATELY
=========================
*/


if("scrollRestoration" in history){

    history.scrollRestoration = "manual";

}


window.scrollTo(
    0,
    0
);


document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;






/*
=========================
LOADING SCREEN CONTROL
=========================
*/

const loadingScreen =
document.querySelector(".loading-screen");


const firstLoad =
!sessionStorage.getItem("siteLoaded");



if(
    loadingScreen &&
    firstLoad
){


    document.documentElement.classList.add(
        "loading-active"
    );


    document.body.classList.add(
        "loading-active"
    );


    window.scrollTo(
        0,
        0
    );



    setTimeout(()=>{


        loadingScreen.remove();


        sessionStorage.setItem(
            "siteLoaded",
            "true"
        );



        document.documentElement.classList.remove(
            "loading-active"
        );


        document.body.classList.remove(
            "loading-active"
        );



        startInitialVideos();



        window.scrollTo(
            0,
            0
        );


        updatePanels();



    },3000);



}
else{


    if(loadingScreen){

        loadingScreen.remove();

    }


}





/*
=========================
SETUP
=========================
*/


const panels =
document.querySelectorAll(".panel");



const videos =
document.querySelectorAll(".video-frame");



const SCROLL_FACTOR =
1.5;



const STACK_REVEAL =
28;

/*
=========================
PAGE HEIGHT
=========================
*/


function setPageHeight(){


    const totalPanels =
    panels.length;



    document.body.style.height =

    `${((totalPanels - 1) * SCROLL_FACTOR + 1) * 100}vh`;


}



setPageHeight();









/*
=========================
IMAGE LOADING
=========================
*/


const loadedPanels =
new WeakSet();



const imageObserver =

new IntersectionObserver(

(entries)=>{


    entries.forEach(entry=>{


        if(!entry.isIntersecting)
        return;



        const panel =
        entry.target;



        if(loadedPanels.has(panel))
        return;



        let image =
        panel.dataset.image;



        if(!image)
        return;





        if(
            window.innerWidth <= 768 &&
            image.includes(".webp")
        ){


            image =
            image.replace(
                ".webp",
                "-mobile.webp"
            );


        }






        const img =
        document.createElement("img");



        img.className =
        "panel-image";



        img.alt =
        "";



        img.decoding =
        "async";



        panel.appendChild(img);



        img.src =
        image;



        img.onload =
        async ()=>{


            try{

                await img.decode();

            }

            catch(e){

                console.warn(
                    "IMAGE DECODE FAILED:",
                    image
                );

            }



            img.classList.add(
                "loaded"
            );


        };



        img.onerror =
        ()=>{


            console.warn(
                "IMAGE FAILED:",
                image
            );


        };



        loadedPanels.add(
            panel
        );



        imageObserver.unobserve(
            panel
        );


    });


},

{

    rootMargin:
    "200px 0px"

}

);






panels.forEach(panel=>{


    imageObserver.observe(
        panel
    );


});









/*
=========================
SCROLL POSITION
=========================
*/


function getScrollPosition(){


    return window.scrollY;


}









/*
=========================
PANEL MOVEMENT
=========================
*/


function updatePanels(){


    const height =
    window.innerHeight;



    const scrollY =
    getScrollPosition();





    panels.forEach(
    (panel,index)=>{


        if(index === 0){


            panel.style.transform =
            "translateY(0)";


            return;


        }





        const start =

        (index - 1)
        *
        height
        *
        SCROLL_FACTOR;





        const progress =


        Math.min(

            1,

            Math.max(

                0,

                (
                    scrollY -
                    start
                )
                /

                (
                    height *
                    SCROLL_FACTOR
                )

            )

        );

        

        /*
=========================
DYNAMIC STACK SINK
=========================
*/


const panelProgress =

scrollY /
(height * SCROLL_FACTOR);



let stackDrift = 0;



/*
Begin slowly lowering entire stack
around the middle of the page
*/





const totalProgress =

panelProgress /
(panels.length - 1);



if(totalProgress > 0.4){

    stackDrift =

    Math.min(

        200,

      ((totalProgress - 0.35) / 0.65)
        *
        200

    );

}

const stackOffset =

index *
STACK_REVEAL;


/*
=========================
SMOOTH STACK SINK
=========================
*/


const driftLock =

Math.min(

    1,

    Math.max(

        0,

        (progress - 0.85) / 0.15

    )

);


const activeDrift =

stackDrift * driftLock;


const y =


-height +

(

    progress *

    (

        height -
        stackOffset

    )

)

+

activeDrift;




panel.style.transform =


`translateY(${y}px)`;


        if(index === 9){


            const email =

            panel.querySelector(
                ".email-arrival"
            );



            if(email){


                email.style.transform =


                `translateY(${
                    -180 +
                    progress * 180
                }px)`;


                email.style.opacity =
                progress;


            }


        }




    });


}









/*
=========================
IMAGE PARALLAX
=========================
*/


function updateImageParallax(){


    panels.forEach(panel=>{


        const images =

        panel.querySelectorAll(
            ".panel-image"
        );



        images.forEach(image=>{


            image.style.transform =

            "translateY(0)";


        });


    });


}

/*
=========================
VIMEO LAZY LOADING
=========================
*/


function loadVideo(container){


    if(!container)
    return;



    if(container.dataset.loaded)
    return;





    const mobile =
    window.innerWidth <= 768;






    const iframe =

    mobile

    ?

    container.querySelector(
        ".mobile-frame"
    )

    :

    container.querySelector(
        ".desktop-frame"
    );






    if(!iframe)
    return;








    const unused =

    mobile

    ?

    container.querySelector(
        ".desktop-frame"
    )

    :

    container.querySelector(
        ".mobile-frame"
    );






    if(unused){

        unused.remove();

    }








    iframe.src =


    iframe.dataset.src +

    "&autoplay=1&muted=1&loop=1&background=1&quality=720p";








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
START INITIAL VIDEOS
=========================
*/


function startInitialVideos(){


    loadVideo(
        document.querySelector(
            ".panel-02 .video-frame"
        )
    );



    setTimeout(()=>{


        loadVideo(
            document.querySelector(
                ".panel-04 .video-frame"
            )
        );


    },1000);


}









/*
=========================
VIDEO OBSERVER
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


            videoObserver.unobserve(
                entry.target
            );


        }


    });


},


{


    rootMargin:
    "1500px",


    threshold:
    .5


}



);









videos.forEach(video=>{


    videoObserver.observe(
        video
    );


});









/*
=========================
SCROLL PERFORMANCE LOOP
=========================
*/


let ticking =
false;






function scrollUpdate(){


    if(ticking)
    return;





    requestAnimationFrame(()=>{


        updatePanels();


        updateImageParallax();


        ticking =
        false;


    });





    ticking =
    true;


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


}

);









/*
=========================
INITIAL POSITION
=========================
*/


requestAnimationFrame(()=>{


    // Always begin at panel 1

    window.scrollTo(
        0,
        0
    );


    updatePanels();


    updateImageParallax();


});









/*
=========================
VARIABLE TICKER FONTS
=========================
*/


document
.querySelectorAll(".ticker-item")
.forEach(item=>{


    const fonts = [


        '"Courier Prime", monospace',

        '"Courier New", monospace',

        '"Baskerville", serif',

        '"Georgia", serif',

        '"Times New Roman", serif',

        'Helvetica, Arial, sans-serif',

        '"Helvetica Neue", sans-serif',

        'Arial, sans-serif',

        '"Gill Sans", sans-serif'


    ];






    const text =
    item.textContent.trim();





    item.innerHTML =
    "";





    let currentFont =


    fonts[

        Math.floor(
            Math.random()
            *
            fonts.length
        )

    ];







    [...text].forEach(letter=>{


        const span =

        document.createElement(
            "span"
        );



        span.textContent =
        letter;







        if(
            /[.,;:'"!?]/.test(letter)
        ){


            span.style.fontFamily =

            '"Courier Prime", monospace';


        }

        else{


            if(
                Math.random() > .85
            ){


                currentFont =

                fonts[

                    Math.floor(
                        Math.random()
                        *
                        fonts.length
                    )

                ];


            }





            span.style.fontFamily =

            currentFont;


        }





        span.style.fontWeight =

        "400";





        item.appendChild(
            span
        );



    });



});


});